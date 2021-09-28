import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ServiceResponse } from 'src/utils/enums';
import { Constants } from '../../../../utils/constants';
import { MetaData } from '../../dashboard.model';
import { ProvidersFilterComponent } from '../providers-filter/providers-filter.component';
import { Provider, ProvidersResponse } from '../salon.model';
import { SalonService } from '../salon.service';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
    showDelay: 500,
    hideDelay: 0,
    touchendHideDelay: 1000,
};
@Component({
    selector: 'app-providers-list',
    templateUrl: './providers-list.component.html',
    styleUrls: ['./providers-list.component.scss'],
    providers: [
        { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
    ],
})
export class ProvidersListComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;
    searchTextChanged = new Subject<string>();

    displayedColumns: string[] = ['avatar', 'provider_name', 'email', 'city', 'state', 'status', 'copy', 'edit'];
    skeletonHead: string[] = ['', 'Provider Name', 'Email', 'City', 'State', 'Status', '', ''];
    skeletonColumn: string[] = ['provider-name', 'provider-email', 'provider-city', 'w-70', '', '', 'w-40'];
    providersDataSource: ProvidersDataSource;
    providersResponse: ProvidersResponse;
    providers: Provider[];
    metaData: MetaData;
    salonId: number;
    isLoadingAPI: boolean;
    isProvidersEmpty: boolean;
    searchString = "";
    state = "";
    status = "";
    currentPage = 1;
    offset = 10;
    requestObject;
    totalPageCount = null;
    emptyProviderSub: Subscription
    dataSourceSub: Subscription;
    loaderSub: Subscription;
    constructor(
        private titleService: Title,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private salonService: SalonService,
        private router: Router

    ) { }

    ngOnInit() {
        this.salonService.copyProviderDetails.next('');

        this.titleService.setTitle(Constants.skinForYou + Constants.providers);
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.salonService.providerFilterDetails.subscribe((details) => {
            if (details) {
                this.requestObject = details;
                this.searchString = details.searchString;
                this.state = details.state;
                this.status = details.status;
            }
        })
        this.getProvidersData();
        this.subscribeData();
    }

    getProvidersData() {
        if (this.salonService.listCurrentPage != -1) {
            this.currentPage = this.salonService.listCurrentPage
        }
        this.providersDataSource = new ProvidersDataSource(this.salonService);
        this.providersDataSource.getProviderListService(this.salonId, this.offset, this.currentPage, this.searchString, this.status, this.state);
    }

    subscribeData() {
        this.dataSourceSub = this.providersDataSource.observeProvidersResponse.subscribe(usersListData => {
            this.providersResponse = usersListData;

            this.providers = this.providersResponse.providers;
            this.metaData = this.providersResponse.meta_data;
            this.totalPageCount = this.metaData && this.metaData.total;
        });

        this.loaderSub = this.providersDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.emptyProviderSub = this.providersDataSource.observeProvidersEmpty.subscribe(isListEmpty => {
            this.isProvidersEmpty = isListEmpty;
        });
    }

    ngOnDestroy() {
        if (!!this.loaderSub) this.loaderSub.unsubscribe();
        if (!!this.dataSourceSub) this.dataSourceSub.unsubscribe();
        if (!!this.emptyProviderSub) this.emptyProviderSub.unsubscribe();
    }

    searchSalon(searchString) {

        this.searchString = searchString;
        this.currentPage = 1;
        this.providersDataSource.getProviderListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.status,
            this.state
        );

    }
    clearSearch() {
        this.searchString = "";

        this.providersDataSource.getProviderListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.status,
            this.state
        );
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.providersDataSource.getProviderListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.status,
            this.state
        );

        this.persistanceData();
    }

    persistanceData() {
        localStorage.setItem("a_page_index", "" + this.currentPage);
    }

    navigateToInfo(element) {
        localStorage.setItem('btnTitle', 'EDIT');
        localStorage.setItem('providerTitle', element.provider_name);
        localStorage.setItem('isFromDetails', 'true');
        this.navigationDetails()
    }

    openEditMenu() {
        localStorage.setItem('btnTitle', 'SAVE');
        localStorage.setItem('providerTitle', 'Edit');
        localStorage.setItem('isFromDetails', 'false');
        this.navigationDetails()
    }

    onClickCopyProviderId(element, event) {
        event.stopPropagation();
        console.log(element);
        this.salonService.copyProviderDetails.next(element);
    }

    navigationDetails() {
        this.requestObject = {
            status: this.status,
            state: this.state,
            searchString: this.searchString
        }
        this.salonService.providerFilterDetails.next(this.requestObject)
    }

    openSalonProviderFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let providerDialogref = this.dialog.open(ProvidersFilterComponent, {
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
        providerDialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.state = response.state.trim();
                this.status = response.status;
                this.searchString = response.searchString;
                this.currentPage = 1;
                this.providersDataSource.getProviderListService(this.salonId, this.offset, this.currentPage, this.searchString, this.status, this.state)
            }
        })
    }

    activeList(value): boolean {
        return value === 'Active' ? false : true
    }

}

export class ProvidersDataSource extends DataSource<Provider> {
    private observeProviders = new BehaviorSubject<Provider[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeProvidersEmpty = new BehaviorSubject<boolean>(false);
    public observeProvidersResponse = new Subject<ProvidersResponse>();

    constructor(public salonService: SalonService) {
        super();
    }

    getProviderListService(salonId: number, offset: number, page: number, search: string, status: string, state: string) {
        if (search) {
            search = search.replace('+', '%2B');
        }
        this.observeLoader.next(true);
        this.salonService.providerListService(salonId, offset, page, search, status, state, (status, response) => {
            this.observeLoader.next(false);
            if (status === ServiceResponse.success) {
                this.observeProvidersEmpty.next(false);
                this.observeProvidersResponse.next(response);
                this.observeProviders.next(response.providers);
            } else if (status === ServiceResponse.emptyList) {
                this.observeProvidersResponse.next(new ProvidersResponse());
                this.observeProviders.next(new Array<Provider>());
                this.observeProvidersEmpty.next(true);
            } else {
                this.observeProvidersEmpty.next(true);
            }
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Provider[]> {
        return this.observeProviders.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}