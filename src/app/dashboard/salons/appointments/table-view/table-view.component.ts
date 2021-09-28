import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFilterComponent } from '../appointment-filter/appointment-filter.component';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ServiceResponse } from 'src/utils/enums';
import { PhoneNumberFormatPipe } from '../../../../shared/phonenumber.pipe';
import { Constants } from 'src/utils/constants';
import { Title } from '@angular/platform-browser';
import { AppointmentResponse, Appointment, MetaData } from '../appointment.model';
import { AppointmentService } from '../appointment.service';

@Component({
    selector: 'app-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements OnInit {

    displayedColumns: string[] = ['avatar', 'client_name', 'email', 'phone_number', 'date', 'status', 'edit'];
    skeletonHead: string[] = ['', 'Client Name', 'Email', 'Phone Number', 'Date & Time', 'Status', ''];
    skeletonColumn: string[] = ['appointment-name', 'appointment-email', 'appointment-phone', 'appointment-date', 'w-70', 'w-40'];
    appointmentDataSource: AppointmentDataSource;
    appointmentsResponse: AppointmentResponse;
    metaData: MetaData;
    appointment: Appointment[];
    appointmentDataSub: Subscription
    appointmentEmptySub: Subscription
    appointmentLoadingSub: Subscription
    formate: any;
    salonId = null;
    requestObject;

    @ViewChild("appFilter", { static: false }) appButtonFilter: MatButton;
    searchString: string = "";
    state: string = "";
    headerTab: string = "";
    currentPage: number = 1;
    serviceId: number = null;
    service = null;
    status: string = null;
    offset = 10;
    isLoadingAPI: boolean;
    isAppointmentEmpty: boolean;
    filteredItems

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        public appointmentService: AppointmentService,
        public phoneFormate: PhoneNumberFormatPipe,
        public titleService: Title
    ) { }

    ngOnInit() {
        this.headerTab = localStorage.getItem('headerTab');

        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.appointmentService.appointmentFilteredDetails.subscribe((details) => {
            if (details) {
                this.filteredItems = details;
                this.searchString = details.searchString;
                this.currentPage = details.page;
                this.service = details.service;
                this.status = details.status;
            }
        })
        this.getAppointmentsData();
        this.subscribeData();
        this.formate = this.phoneFormate;
        this.titleService.setTitle(Constants.skinForYou + Constants.appointmentTab);
        localStorage.setItem('appointment_from', 'registered');

    }

    getAppointmentsData() {
        if (this.appointmentService.listCurrentPage != -1) {
            this.currentPage = this.appointmentService.listCurrentPage
        }
        this.appointmentDataSource = new AppointmentDataSource(this.appointmentService);
        this.appointmentDataSource.getAppointmentListService(this.salonId, this.offset, this.currentPage, this.searchString, this.service, this.status);
    }

    subscribeData() {
        this.appointmentDataSub = this.appointmentDataSource.observeAppointmentResponse.subscribe(usersListData => {
            this.appointmentsResponse = usersListData;
            this.appointment = this.appointmentsResponse.appointments;
            this.metaData = this.appointmentsResponse.meta_data;
        });

        this.appointmentLoadingSub = this.appointmentDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.appointmentEmptySub = this.appointmentDataSource.observeAppointmentEmpty.subscribe(isListEmpty => {
            this.isAppointmentEmpty = isListEmpty;
        });
    }
    ngOnDestroy() {
        if (!!this.appointmentLoadingSub) this.appointmentLoadingSub.unsubscribe();
        if (!!this.appointmentEmptySub) this.appointmentEmptySub.unsubscribe();
        if (!!this.appointmentDataSub) this.appointmentDataSub.unsubscribe();
    }
    onClickRegisteredAppointments() {
        if (this.headerTab === 'Studios') {
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/appointments/registered-users');
            // this.filteredItems = {
            //     service: this.service,
            //     status: this.status,
            //     searchString: '',
            //     page: this.currentPage
            // }
            this.appointmentService.appointmentFilteredDetails.next(this.filteredItems);

        } else {
            this.navigationToScreen('/home/appointments/registered-users');
            // this.filteredItems = {
            //     service: this.service,
            //     status: this.status,
            //     searchString: '',
            //     page: this.currentPage
            // }
            this.appointmentService.appointmentFilteredDetails.next(this.filteredItems);

        }
        localStorage.setItem('appointment_from', 'registered')

    }

    onClickUnregisteredAppointments() {
        if (this.headerTab === 'Studios') {
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/appointments/unregistered-users');

            // this.filteredItems = {
            //     service: this.service,
            //     status: this.status,
            //     searchString: '',
            //     page: this.currentPage
            // }
            this.appointmentService.appointmentFilteredDetails.next(this.filteredItems);

        } else {
            this.navigationToScreen('/home/appointments/unregistered-users');
            // this.filteredItems = {
            //     service: this.service,
            //     status: this.status,
            //     searchString: '',
            //     page: this.currentPage
            // }
            this.appointmentService.appointmentFilteredDetails.next(this.filteredItems);

        }
        localStorage.setItem('appointment_from', 'unregistered')

    }

    navigateToAppointmentDetails() {
        this.filteredItems = {
            service: this.service,
            status: this.status,
            searchString: this.searchString,
            page: this.currentPage
        }
        this.appointmentService.appointmentFilteredDetails.next(this.filteredItems);

    }

    navigationToScreen(URL: string) {
        this.router.navigate([URL], {
            relativeTo: this.activatedRoute,
        })
    }

    activeList(value): boolean {
        return value === 'Active' ? false : true
    }

    openEditMenu() {
        localStorage.setItem('appointmentButtonTitle', 'SAVE');
        localStorage.setItem('appointmentTitle', 'Edit');
        localStorage.setItem('isFromDetails', 'false');
        localStorage.setItem('appointment_from', 'registered')
    }

    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.appointmentDataSource.getAppointmentListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.service,
            this.status

        );
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.appointmentDataSource.getAppointmentListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.service,
            this.status
        );
    }

    openFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.appButtonFilter._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let dialogref = this.dialog.open(AppointmentFilterComponent, {
            width: "330px",
            panelClass: "filter-dialog",
            position: { right: right + 'px', top: top + 'px' },
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                salonId: this.salonId,
                status: this.status,
                service: this.service,
                searchString: this.searchString,
            },
        });
        dialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.service = response.service;
                this.status = response.status;
                this.currentPage = 1;
                this.appointmentDataSource.getAppointmentListService(this.salonId, this.offset, this.currentPage, this.searchString, this.service, this.status)
            }
        })
    }

    clearSearch() {
        this.searchString = "";
        this.appointmentDataSource.getAppointmentListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.service,
            this.status
        );
    }
}

export class AppointmentDataSource extends DataSource<Appointment> {
    private observeAppointment = new BehaviorSubject<Appointment[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeAppointmentEmpty = new BehaviorSubject<boolean>(false);
    public observeAppointmentResponse = new Subject<AppointmentResponse>();

    constructor(public appointmentService: AppointmentService) {
        super();
    }

    getAppointmentListService(salonId: number, offset: number, page: number, search: string, service: number, status: string) {
        search = search.replace('+', '%2B');

        this.observeLoader.next(true);

        this.appointmentService.appointmentListService(salonId, offset, page, search, service, status, (status, response) => {
            this.observeLoader.next(false);

            if (status === ServiceResponse.success) {
                this.observeAppointmentEmpty.next(false);
                this.observeAppointmentResponse.next(response);
                this.observeAppointment.next(response.appointments);
            } else if (status === ServiceResponse.emptyList) {
                this.observeAppointmentResponse.next(new AppointmentResponse());
                this.observeAppointment.next(new Array<Appointment>());
                this.observeAppointmentEmpty.next(true);
            } else {
                this.observeAppointmentEmpty.next(true);
            }

        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Appointment[]> {
        return this.observeAppointment.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {

    }

}
