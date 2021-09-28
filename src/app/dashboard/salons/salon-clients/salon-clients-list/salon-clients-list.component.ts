import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Constants } from '../../../../../utils/constants';
import { ServiceResponse } from '../../../../../utils/enums';
import { Clients, ClientsResponse, MetaData } from '../../../dashboard.model';
import { DashboardService } from '../../../dashboard.service';
import { SalonClientsFilterComponent } from '../salon-clients-filter/salon-clients-filter.component';
import { PhoneNumberFormatPipe } from '../../../../shared/phonenumber.pipe';

@Component({
    selector: 'app-salon-clients-list',
    templateUrl: './salon-clients-list.component.html',
    styleUrls: ['./salon-clients-list.component.scss']
})
export class SalonClientsListComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;

    displayedColumns: string[] = ['avatar', 'name', 'email', 'phone_number', 'status', 'chat_link'];
    adminDisplayedColumns: string[] = ['avatar', 'name', 'email', 'phone_number', 'status'];
    skeletonHead: string[] = ['', 'Name', 'Email', 'Phone Number', 'Status', ''];
    skeletonColumn: string[] = ['client-name', 'client-email', 'client-phn', '', 'w-40'];
    adminSkeletonHead: string[] = ['', 'Name', 'Email', 'Phone Number', 'Status'];
    adminSkeletonColumn: string[] = ['client-name', 'client-email', 'client-phn', ''];
    clientsDataSource: ClientsDataSource;
    clientsResponse: ClientsResponse;
    clientsDataSub: Subscription;
    clientsEmptySub: Subscription;
    clientsLoaderSub: Subscription;
    clients: Clients[];
    metaData: MetaData;
    isLoadingAPI: boolean;
    isClientsEmpty: boolean;
    searchString: string = "";
    state: string = "";
    status: string = "";
    currentPage: number = 1;
    offset: number = 10;
    salonId: number;
    formate: any;
    requestObject;
    userRole;
    constructor(
        public dialog: MatDialog,
        private router: Router,
        private titleService: Title,
        private activatedRoute: ActivatedRoute,
        private dashboardService: DashboardService,
        public phoneFormate: PhoneNumberFormatPipe
    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + Constants.clients);
        this.formate = this.phoneFormate;
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.dashboardService.clientFilterDetails.subscribe((details) => {
            if (details) {
                this.requestObject = details;
                this.searchString = details.searchString;
                this.state = details.state;
                this.status = details.status;
            }
        })
        this.getClientsData();
        this.subscribeData();
        this.userRole = localStorage.getItem('userRole');
        console.log(this.userRole);
    }

    getClientsData() {
        if (this.dashboardService.listCurrentPage != -1) {
            this.currentPage = this.dashboardService.listCurrentPage
        }
        this.clientsDataSource = new ClientsDataSource(this.dashboardService);
        this.clientsDataSource.getClientsListService(this.salonId, this.offset, this.currentPage, this.searchString, this.status);
    }

    subscribeData() {
        this.clientsDataSub = this.clientsDataSource.observeClientsResponse.subscribe(usersListData => {
            this.clientsResponse = usersListData;
            this.clients = this.clientsResponse.clients;
            this.metaData = this.clientsResponse.meta_data;
        });

        this.clientsLoaderSub = this.clientsDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.clientsEmptySub = this.clientsDataSource.observeClientsEmpty.subscribe(isListEmpty => {
            this.isClientsEmpty = isListEmpty;
        });
    }
    ngOnDestroy(): void {
        if (!!this.clientsEmptySub) this.clientsEmptySub.unsubscribe();
        if (!!this.clientsLoaderSub) this.clientsLoaderSub.unsubscribe();
        if (!!this.clientsDataSub) this.clientsDataSub.unsubscribe();
    }
    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.clientsDataSource.getClientsListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.status
        );
    }
    clearSearch() {
        this.searchString = "";
        this.clientsDataSource.getClientsListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.status
        );
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.clientsDataSource.getClientsListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.status
        );
        this.persistanceData();
    }

    persistanceData() {
        localStorage.setItem("a_page_index", "" + this.currentPage);
    }
    activeList(value): boolean {
        return value === 'Active' ? false : true
    }
    navigateToInfo(id, clientName, date) {
        this.router.navigate([id + '/information'], {
            relativeTo: this.activatedRoute,
        })
        localStorage.setItem("client_id", id);
        localStorage.setItem("client_name", clientName);
        localStorage.setItem("date", date);
        this.filterDetailsData();
    }
    filterDetailsData() {
        this.requestObject = {
            status: this.status,
            state: this.state,
            searchString: this.searchString
        }
        this.dashboardService.clientFilterDetails.next(this.requestObject)
    }

    openSalonClientFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let clientDialogref = this.dialog.open(SalonClientsFilterComponent, {
            width: "330px",
            position: { right: right + 'px', top: top + 'px' },
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                selectedStatus: this.status,
                searchString: this.searchString,
            },
        });
        clientDialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.status = response.status;
                this.searchString = response.searchString;
                this.currentPage = 1;
                this.clientsDataSource.getClientsListService(this.salonId, this.offset, this.currentPage, this.searchString, this.status)
            }
        })
    }

    onClickNavigateToChat(clientId, quickbloxId) {
        this.router.navigate(['/home/salons/salon/' + this.salonId + "/conversations"], {
            relativeTo: this.activatedRoute,
        })
        localStorage.setItem("clientQuickBloxId", quickbloxId)
        localStorage.setItem("clientId", clientId)
        return false;
    }

}

export class ClientsDataSource extends DataSource<Clients> {
    private observeClients = new BehaviorSubject<Clients[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeClientsEmpty = new BehaviorSubject<boolean>(false);
    public observeClientsResponse = new Subject<ClientsResponse>();

    constructor(public dashboardService: DashboardService) {
        super();
    }

    getClientsListService(salonId: number, offset: number, page: number, search: string, status: string) {
        search = search.replace('+', '%2B');
        this.observeLoader.next(true);
        this.dashboardService.clientsListService(salonId, offset, page, search, status, (status, response) => {
            this.observeLoader.next(false);
            if (status === ServiceResponse.success) {
                this.observeClientsEmpty.next(false);
                this.observeClientsResponse.next(response);
                this.observeClients.next(response.clients);
            } else if (status === ServiceResponse.emptyList) {
                this.observeClientsResponse.next(new ClientsResponse());
                this.observeClients.next(new Array<Clients>());
                this.observeClientsEmpty.next(true);
            } else {
                this.observeClientsEmpty.next(true);
            }
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Clients[]> {
        return this.observeClients.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}