import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { PhoneNumberFormatPipe } from '../../shared/phonenumber.pipe';
import { DashboardService } from '../dashboard.service';
import { SalonsFilterComponent } from '../salons-filter/salons-filter.component';
import { MetaData, SalonDetails, SalonsListResponse } from '../salons/salon.model';
import { SalonService } from '../salons/salon.service';

@Component({
    selector: 'app-salons-list',
    templateUrl: './salons-list.component.html',
    styleUrls: ['./salons-list.component.scss']
})

export class SalonsListComponent implements OnInit {
    @ViewChild(MatButton, { static: false }) button: MatButton;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns: string[] = ['avatar', 'name', 'email', 'phone_number', 'city', 'state', 'status', 'edit'];
    skeletonHead: string[] = ['', 'Studio Name', 'Email', 'Phone Number', 'City', 'State', 'Status', ''];
    skeletonColumn: string[] = ['studio-name', 'salon-email', 'salon-phn', 'salon-city', 'salon-state', '', 'w-40'];
    salonsListResponse: SalonsListResponse;
    salonsDataSource: SalonsListDataSource;
    salonLoaderSub: Subscription;
    salonDataSub: Subscription;
    salonEmptyListSub: Subscription;
    metaData: MetaData;
    isClicked = false;
    isSalonsListEmpty: boolean;
    isLoadingAPI: any;
    isListEmpty: any;
    currentPage: number = 1;
    offset: number = 10;
    searchString: string = "";
    state: string = "";
    status: string = "";
    formate;
    requestObject
    salons: SalonDetails[];

    constructor(
        private titleService: Title,
        private router: Router,
        public dialog: MatDialog,
        private activeRoute: ActivatedRoute,
        private dashboardService: DashboardService,
        private salonService: SalonService,
        public phoneFormate: PhoneNumberFormatPipe,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        private http: HttpClient
    ) {
        iconRegistry.addSvgIcon(
            'search',
            sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/search.svg'));
    }

    ngOnInit() {
        this.formate = this.phoneFormate;
        this.titleService.setTitle(Constants.skinForYou + Constants.salons);
        this.salonService.observeFilterDetails.subscribe((details) => {
            if (details) {
                this.requestObject = details;
                this.searchString = details.searchString;
                this.state = details.state;
                this.status = details.status;
                this.currentPage = details.page;
            }
        })
        this.getSalonsData();
        this.subscribeData();

    }

    getSalonsData() {
        if (this.dashboardService.listCurrentPage != -1) {
            this.currentPage = this.dashboardService.listCurrentPage
        }
        this.salonsDataSource = new SalonsListDataSource(this.salonService);

        this.salonsDataSource.getSalonsService(this.offset, this.currentPage, this.searchString, this.state, this.status);
    }

    activeList(value): boolean {
        return value === 'Active' ? false : true
    }

    subscribeData() {
        this.salonDataSub = this.salonsDataSource.observeSalonsListResponse.subscribe(usersListData => {
            this.salonsListResponse = usersListData;
            this.salons = this.salonsListResponse.salons;

            this.metaData = this.salonsListResponse.meta_data;
        });

        this.salonLoaderSub = this.salonsDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.salonEmptyListSub = this.salonsDataSource.observeSalonsListEmpty.subscribe(isListEmpty => {
            this.isSalonsListEmpty = isListEmpty;
        });
    }
    ngOnDestroy(): void {
        if (!!this.salonEmptyListSub) this.salonEmptyListSub.unsubscribe();
        if (!!this.salonLoaderSub) this.salonLoaderSub.unsubscribe();
        if (!!this.salonDataSub) this.salonDataSub.unsubscribe();
    }

    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.salonsDataSource.getSalonsService(
            this.offset,
            this.currentPage,
            this.searchString,
            this.state,
            this.status
        );
    }

    clearSearch() {
        this.searchString = "";
        this.salonsDataSource.getSalonsService(
            this.offset,
            this.currentPage,
            this.searchString,
            this.state,
            this.status
        );
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;

        this.salonsDataSource.getSalonsService(
            this.offset,
            this.currentPage,
            this.searchString,
            this.state,
            this.status
        );
    }
    persistanceData() {
        localStorage.setItem("a_page_index", "" + this.currentPage);
    }

    openSideMenu(salonId: string, salonTitle: string) {
        this.onClickNavigationScreen('/home/salons/salon/' + salonId + "/details");
        this.filteredDetails(salonId, salonTitle);
        this.dashboardService.isSalonClickedBySuperAdmin.next(true)
    }

    openEditMenu(salonId: string, salonTitle: string) {
        this.onClickNavigationScreen('/home/salons/salon/' + salonId + "/details/edit");
        this.filteredDetails(salonId, salonTitle)
    }

    onClickNavigationScreen(URL: string) {
        this.router.navigate([URL], {
            relativeTo: this.activeRoute,
        })
    }

    filteredDetails(salonId, salonTitle) {
        localStorage.setItem("salonTitle", salonTitle)
        localStorage.setItem("salon_id", salonId);

        this.requestObject = {
            status: this.status,
            state: this.state,
            searchString: this.searchString,
            page: this.currentPage
        }
        this.salonService.observeFilterDetails.next(this.requestObject)
    }

    openSalonFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let dialogref = this.dialog.open(SalonsFilterComponent, {
            width: "330px",
            position: { right: right + 'px', top: top + 'px' },
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                selectedState: this.state,
                selectedStatus: this.status,
                searchString: this.searchString,
            },
        });
        dialogref.afterClosed().subscribe((response) => {

            if (response !== undefined) {
                this.state = response.state.trim();
                this.status = response.status;
                this.searchString = response.searchString;
                this.currentPage = 1;
                this.salonsDataSource.getSalonsService(this.offset, this.currentPage, this.searchString, this.state, this.status)

            }

        })
    }

}

export class SalonsListDataSource extends DataSource<SalonDetails> {
    private observeSalonsList = new BehaviorSubject<SalonDetails[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeSalonsListEmpty = new BehaviorSubject<boolean>(false);
    public observeSalonsListResponse = new Subject<SalonsListResponse>();

    constructor(public salonService: SalonService) {
        super();
    }

    getSalonsService(offset: number, page: number, search: string, state: string, status: string) {
        search = search.replace('+', '%2B');
        this.observeLoader.next(true);
        this.salonService.salonsListService(offset, page, search, state, status, (status, response) => {
            this.observeLoader.next(false);
            if (status === ServiceResponse.success) {
                this.observeSalonsListEmpty.next(false);
                this.observeSalonsListResponse.next(response);
                this.observeSalonsList.next(response.salons);

            } else if (status === ServiceResponse.emptyList) {
                this.observeSalonsListResponse.next(new SalonsListResponse());
                this.observeSalonsList.next(new Array<SalonDetails>());
                this.observeSalonsListEmpty.next(true);

            } else {
                this.observeSalonsListEmpty.next(true);

            }

        });
    }

    connect(collectionViewer: CollectionViewer): Observable<SalonDetails[]> {
        return this.observeSalonsList.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}