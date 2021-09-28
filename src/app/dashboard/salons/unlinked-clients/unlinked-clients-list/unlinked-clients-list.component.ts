import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { PhoneNumberFormatPipe } from 'src/app/shared/phonenumber.pipe';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { UnlinkedClientService } from '../unlinked-client.service';
import { UnlinkedClientsFilterComponent } from '../unlinked-clients-filter/unlinked-clients-filter.component';
import { MetaData, UnlinkedClients, UnlinkedClientsResponse } from '../unlinked-clients.model';

interface Status {
    id: string;
    value: string;
}
@Component({
    selector: 'app-unlinked-clients-list',
    templateUrl: './unlinked-clients-list.component.html',
    styleUrls: ['./unlinked-clients-list.component.scss']
})

export class UnlinkedClientsListComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;

    displayedColumns: string[] = ['avatar', 'name', 'email', 'phone_number', 'status'];
    skeletonHead: string[] = ['', 'Name', 'Email', 'Phone Number', 'Status'];
    skeletonColumn: string[] = ['client-name', 'client-email', 'client-phn', ''];
    unLinkedClientsDataSource: UnLinkedClientsDataSource;
    unLinkedClientResponse: UnlinkedClientsResponse;
    unLinkedClients: UnlinkedClients[];
    unlinedClientsDataSub: Subscription;
    unlinedClientsEmptySub: Subscription;
    unlinedClientsLoaderSub: Subscription;
    metaData: MetaData;
    isLoadingAPI: boolean;
    isClientsEmpty: boolean;
    searchString: string = "";
    state: string = "";
    status: string = "";
    currentPage: number = 1;
    offset: number = 10;
    formate: any;
    requestObject
    constructor(
        public dialog: MatDialog,
        private router: Router,
        private titleService: Title,
        private activatedRoute: ActivatedRoute,
        private unLinkedClientService: UnlinkedClientService,
        public phoneFormate: PhoneNumberFormatPipe
    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + 'Unlinked Clients');
        this.formate = this.phoneFormate;
        this.getClientsData();
        this.subscribeData();
    }

    getClientsData() {
        if (this.unLinkedClientService.listCurrentPage != -1) {
            this.currentPage = this.unLinkedClientService.listCurrentPage
        }
        this.unLinkedClientsDataSource = new UnLinkedClientsDataSource(this.unLinkedClientService);
        this.unLinkedClientsDataSource.getUnLinkedClientsListService(this.offset, this.currentPage, this.searchString, this.status);
    }

    subscribeData() {
        this.unlinedClientsDataSub = this.unLinkedClientsDataSource.observeClientsResponse.subscribe(usersListData => {
            this.unLinkedClientResponse = usersListData;
            this.unLinkedClients = this.unLinkedClientResponse.clients;
            this.metaData = this.unLinkedClientResponse.meta_data;
        });

        this.unlinedClientsLoaderSub = this.unLinkedClientsDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.unlinedClientsEmptySub = this.unLinkedClientsDataSource.observeClientsEmpty.subscribe(isListEmpty => {
            this.isClientsEmpty = isListEmpty;
        });
    }
    ngOnDestroy() {
        if (!!this.unlinedClientsDataSub) this.unlinedClientsDataSub.unsubscribe();
        if (!!this.unlinedClientsLoaderSub) this.unlinedClientsDataSub.unsubscribe();
        if (!!this.unlinedClientsDataSub) this.unlinedClientsDataSub.unsubscribe();
    }

    isClientsAdded(): boolean {
        // this.isClientsAdded = this.clients && this.clients.length > 0 && this.searchString === ''
        if (this.unLinkedClients) {
            return true
        } else {
            return this.searchString === '' && this.status === '' ? false : true
        }
    }

    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.unLinkedClientsDataSource.getUnLinkedClientsListService(
            this.offset,
            this.currentPage,
            this.searchString,
            this.status
        );

    }
    clearSearch() {
        this.searchString = "";
        this.unLinkedClientsDataSource.getUnLinkedClientsListService(
            this.offset,
            this.currentPage,
            this.searchString,
            this.status
        );
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.unLinkedClientsDataSource.getUnLinkedClientsListService(
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
    }

    openSalonClientFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let clientDialogref = this.dialog.open(UnlinkedClientsFilterComponent, {
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
                this.unLinkedClientsDataSource.getUnLinkedClientsListService(this.offset, this.currentPage, this.searchString, this.status)
            }
        })
    }

    statuses: Status[] = [
        { id: 'Active', value: 'Active' },
        { id: 'Inactive', value: 'Inactive' }
    ];
    selectedOption = 'Active';
}

export class UnLinkedClientsDataSource extends DataSource<UnlinkedClients> {
    private observeClients = new BehaviorSubject<UnlinkedClients[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeClientsEmpty = new BehaviorSubject<boolean>(false);
    public observeClientsResponse = new Subject<UnlinkedClientsResponse>();

    constructor(public unLinkedClientService: UnlinkedClientService) {
        super();
    }

    getUnLinkedClientsListService(offset: number, page: number, search: string, status: string) {
        //   search = search.replace('+', '%2B');
        this.observeLoader.next(true);
        this.unLinkedClientService.unLinkedClientList(offset, page, search, status, (status, response) => {
            this.observeLoader.next(false);

            if (status === ServiceResponse.success) {
                this.observeClientsEmpty.next(false);
                this.observeClientsResponse.next(response);
                this.observeClients.next(response.clients);
            } else if (status === ServiceResponse.emptyList) {
                this.observeClientsResponse.next(new UnlinkedClientsResponse());
                this.observeClients.next(new Array<UnlinkedClients>());
                this.observeClientsEmpty.next(true);
            } else {
                this.observeClientsEmpty.next(true);
            }

        });
    }

    connect(collectionViewer: CollectionViewer): Observable<UnlinkedClients[]> {
        return this.observeClients.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}
