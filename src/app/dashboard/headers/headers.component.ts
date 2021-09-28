import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MenuList } from '../dashboard.model';
import { Constants } from '../../../utils/constants';
import { UserRole } from '../../../utils/enums';
declare var QB: any;

@Component({
    selector: 'app-headers',
    templateUrl: './headers.component.html',
    styleUrls: ['./headers.component.scss'],
})
export class HeadersComponent implements OnInit {
    @Input() sidenav: any;
    @Input() userRole: string;

    headerMenu: MenuList[] = Constants.HeaderMenu;
    isSubmitted: boolean;
    isSalonClicked: boolean = false;
    public userRoleEnum: UserRole;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.dashboardService.isSalonClickedBySuperAdmin.subscribe((toolbar) => {
            this.isSalonClicked = toolbar;
        });
    }

    menuHeaderClick(headerTab) {
        localStorage.setItem('headerTab', headerTab);
    }

    navigateToLogout() {
        this.isSubmitted = true;
        this.dashboardService.logoutService((status, data) => {
            localStorage.clear();
            this.isSubmitted = false;
        });
        try {
            QB.chat.disconnect();
            QB.destroySession(() => {
                return null
            });
            localStorage.removeItem('loggedinUser');
            localStorage.removeItem('sessionResponse');
        } catch (err) { }
    }
}
