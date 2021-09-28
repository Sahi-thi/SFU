import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Constants } from '../../../utils/constants';
import { UserRole } from '../../../utils/enums';
import { MenuList } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { ConversationsService } from '../salons/conversations/conversations.service';
import { VideoCallListenerService } from '../videoCallListeners.service';

declare let QB: any;
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;
    routeSub: Subscription
    mobileQuery: MediaQueryList;
    superAdminMenu: MenuList[] = Constants.SuperAdminSalonMenu;
    adminMenu: MenuList[] = Constants.AdminSalonMenu;
    providerMenu: MenuList[] = Constants.ProviderMenu;
    userRole: string;
    salonId: string;

    private _mobileQueryListener: () => void;

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public media: MediaMatcher,
        private activatedRoute: ActivatedRoute,
        private videoCallListenerService: VideoCallListenerService,
        private dashboardService: DashboardService,
        private conversationService: ConversationsService

    ) {
        this.mobileQuery = media.matchMedia('(max-width: 700px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit() {
        if (QB.webrtc) {
            this.videoCallListenerService.videoCallSetListeners();
        } else {
            this.dashboardService.initialiseQuickBlox();
            this.setUserToLogin();
        }
        this.userRole = localStorage.getItem('userRole');
        this.routeSub = this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = localStorage.getItem('salon_id')
            }
        });
    }

    setUserToLogin() {
        try {
            this.conversationService.login({ email: localStorage.getItem('email') });
            setTimeout(() => {
                this.videoCallListenerService.videoCallSetListeners();
            }, 3000)
        } catch (error) { }
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.routeSub.unsubscribe();
    }

    checkMenuOnUserRole() {
        return this.userRole === UserRole.superAdmin ? this.superAdminMenu :
            this.userRole === UserRole.admin ? this.adminMenu : this.providerMenu
    }

}
