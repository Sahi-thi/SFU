import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuList } from '../../dashboard.model';
import { Constants } from 'src/utils/constants';
import { UserRole } from 'src/utils/enums';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { SalonService } from '../salon.service';
import { ConversationsService } from '../conversations/conversations.service';
import { VideoCallListenerService } from '../../videoCallListeners.service';
import { MatDialog } from '@angular/material';
import { ConformationDialogComponent } from '../../conformation-dialog/conformation-dialog.component';
import { ServiceResponse } from '../../../../utils/enums';
import { Salon } from '../salon.model';
declare var QB: any;

@Component({
    selector: 'app-salon-dashboard',
    templateUrl: './salon-dashboard.component.html',
    styleUrls: ['./salon-dashboard.component.scss'],
})
export class SalonDashboardComponent implements OnInit {
    @ViewChild('salonSidenav', { static: true }) public salonSidenav: MatSidenav;

    private _mobileQueryListener: () => void;
    routeSub: Subscription;
    mobileQuery: MediaQueryList;
    superAdminMenu: MenuList[] = Constants.SuperAdminSalonMenu;
    adminMenu: MenuList[] = Constants.AdminSalonMenu;
    providerMenu: MenuList[] = Constants.ProviderMenu;
    userRole: string;
    headerTitle: string = 'Details';
    isMenuClicked: boolean = false;
    salonTitle: string;
    salonId: string;
    requestObject;
    salon: Salon;

    constructor(
        public changeDetectorRef: ChangeDetectorRef,
        public media: MediaMatcher,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dashboardService: DashboardService,
        private salonService: SalonService,
        private conversationService: ConversationsService,
        private videoCallListenerService: VideoCallListenerService,
        public dialog: MatDialog,
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 700px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        localStorage.setItem('salonDashboard', 'SD');
    }

    ngOnInit() {

        localStorage.setItem('headerTab', 'Studios');
        this.salonTitle = localStorage.getItem('salonTitle');
        this.userRole = localStorage.getItem('userRole');
        this.setVideoCallListener();
        this.routeSub = this.activatedRoute.queryParams.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = localStorage.getItem('salon_id');
            }
        });

        this.salonService.observeFilterDetails.subscribe((details) => {
            if (details) {
                this.requestObject = details;
            }
        });
        this.salonId && this.getSalonOwnerDetails()
    }

    getSalonOwnerDetails() {
        this.salonService.salonsDetailsService(this.salonId, (status, response) => {
            this.salon = response.salon
            const details = this.salon
            const ownerDetails = {}
            if (status === ServiceResponse.success) {
                ownerDetails['phone_number'] = details.phone_number
                ownerDetails['city'] = details.city
                ownerDetails['state'] = details.state
            }
            localStorage.setItem('ownerDetails', JSON.stringify(ownerDetails))
            localStorage.setItem('sup_admin_quickblox_id', details.sup_admin_quickblox_id)
        });
    }

    setVideoCallListener() {
        const scope = this
        if (QB.webrtc) {
            QB.webrtc.onCallListener = function(session, extension) {
                console.log("onCallListener SD", session);

                if (session.currentUserID !== session.initiatorID) {
                    scope.getCallingUserData(session, extension);
                }
            }
        }
    }

    getCallingUserData(session, extension) {
        const self = this
        QB.users.get(Number(session.initiatorID), function(error, user) {
            self.videoCallListenerService.callerData.next(
                { callerId: user.id, callerSession: session, callerExtension: extension },
            )
            if (error) { }
            else {
                if (session.state !== QB.webrtc.SessionConnectionState.CLOSED) {

                    setTimeout(() => {
                        self.openConfirmationDialog(user, session);
                    }, 1000)
                }
            }
        });
    }

    openConfirmationDialog(user, session) {
        var audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
        audio.play();
        this.dialog.open(ConformationDialogComponent, {
            panelClass: ['formList-dialog-confirm', 'card-shadow'],
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                profilePhoto: user.custom_data.profile_pic_thumb_url,
                callerName: user.full_name,
                audio: audio,
                callingSession: session
            },
        });
    }

    checkMenuOnUserRole() {
        return this.userRole === UserRole.superAdmin
            ? this.superAdminMenu
            : this.userRole === UserRole.admin
                ? this.adminMenu
                : this.providerMenu;
    }

    clickNavigationMenu() {
        this.isMenuClicked = !this.isMenuClicked;
        this.salonSidenav.toggle();
    }

    backNavigation() {
        this.salonService.observeFilterDetails.next(this.requestObject);
    }

    handleClick(menu) {
        this.headerTitle = menu.name;
        this.dashboardService.salonHeaderTitle.next(menu.name);
    }

    backToNavigation() {
        this.salonService.observeFilterDetails.next(this.requestObject);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.routeSub.unsubscribe();
    }

    setUserToLogin() {
        try {
            this.conversationService.login({ email: localStorage.getItem('email') });
        } catch (error) { }
    }
}
