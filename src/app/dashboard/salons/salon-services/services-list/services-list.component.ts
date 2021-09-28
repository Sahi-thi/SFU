import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Services, ServicesResponse } from 'src/app/dashboard/dashboard.model';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { DeleteSalonComponent } from '../../../../shared/delete-salon/delete-salon.component';
import { MetaData } from '../../../dashboard.model';
import { ServicesFilterComponent } from '../services-filter/services-filter.component';
import { ServicesService } from '../services.service';

@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;

    displayedColumns: string[] = ['type', 'service', 'description', 'min-price', 'max-price', 'edit', 'delete'];
    skeletonHead: string[] = ['Type', 'Service', 'Description', 'Min Price', 'Max Price', '', '']
    skeletonColumn: string[] = ['service-type', 'services', 'description', 'min-price', '', 'w-40', 'w-40'];
    servicesDataSource: ServicesDataSource;
    servicesResponse: ServicesResponse;
    servicesLoaderSub: Subscription;
    servicesEmptySub: Subscription;
    servicesDataSub: Subscription;
    services: Services[];
    metaData: MetaData;
    isLoadingAPI: boolean;
    isServicesEmpty: boolean;
    searchString = "";
    type = "";
    price = "";
    currentPage = 1;
    offset = 10;
    salonId: number;
    status: string = "";
    filteredItems

    constructor(
        public dialog: MatDialog,
        public activatedRoute: ActivatedRoute,
        public servicesService: ServicesService,
        private titleService: Title,

    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + Constants.services);

        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.servicesService.servicesFilteredDetails.subscribe((details) => {
            if (details) {
                this.filteredItems = details;
                this.searchString = details.searchString;
                this.price = details.price;
                this.type = details.type;
                this.currentPage = details.page
            }
        })
        this.getServicesData();
        this.subscribeData();

    }

    getServicesData() {
        if (this.servicesService.listCurrentPage != -1) {
            this.currentPage = this.servicesService.listCurrentPage
        }
        this.servicesDataSource = new ServicesDataSource(this.servicesService);

        this.servicesDataSource.getSalonServices(this.salonId, this.offset, this.currentPage, this.searchString, this.type, this.price);
    }

    subscribeData() {
        this.servicesLoaderSub = this.servicesDataSource.observeServicesListResponse.subscribe(servicesData => {
            this.servicesResponse = servicesData;
            this.services = this.servicesResponse.services;
            this.metaData = this.servicesResponse.meta_data;
        });

        this.servicesLoaderSub = this.servicesDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.servicesEmptySub = this.servicesDataSource.observeServicesListEmpty.subscribe(isListEmpty => {
            this.isServicesEmpty = isListEmpty;
        });
    }

    ngOnDestroy(): void {
        if (!!this.servicesEmptySub) this.servicesEmptySub.unsubscribe();
        if (!!this.servicesLoaderSub) this.servicesLoaderSub.unsubscribe();
        if (!!this.servicesLoaderSub) this.servicesLoaderSub.unsubscribe();
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.servicesDataSource.getSalonServices(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.type,
            this.price
        );
    }

    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.servicesDataSource.getSalonServices(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.type,
            this.price
        );
    }

    clearSearch() {
        this.searchString = "";
        this.servicesDataSource.getSalonServices(
            this.salonId,
            this.offset,
            1,
            this.searchString,
            this.type,
            this.price
        );
    }

    openServicesFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let serviceDialogref = this.dialog.open(ServicesFilterComponent, {
            width: "330px",
            position: { right: right + 'px', top: top + 'px' },
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                type: this.type,
                price: this.price,
                searchString: this.searchString,
            },
        });
        serviceDialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.searchString = response.searchString;
                this.type = response.type;
                this.price = response.price;
                this.currentPage = 1;
                this.servicesDataSource.getSalonServices(
                    this.salonId,
                    this.offset,
                    this.currentPage,
                    this.searchString,
                    this.type,
                    this.price
                );
            }
        })
    }

    transformPriceToNum(price) {
        return Math.trunc(price);
    }

    openServiceEdit(event) {
        event.stopPropagation();
        localStorage.setItem('btnTitle', 'SAVE');
        localStorage.setItem('serviceTitle', 'Edit');
        localStorage.setItem('isFromDetails', 'false');
        this.navigationDetails();
    }

    openServiceDetails(element) {
        localStorage.setItem('btnTitle', 'EDIT');
        localStorage.setItem('serviceTitle', element.service_type);
        localStorage.setItem('isFromDetails', 'true');
        this.navigationDetails();
    }

    navigationDetails() {
        this.filteredItems = {
            type: this.type,
            price: this.price,
            searchString: this.searchString,
            page: this.currentPage
        }
        this.servicesService.servicesFilteredDetails.next(this.filteredItems);
    }

    openServiceDeleteDialog(event, listId: number, listTitle: string) {
        event.stopPropagation();
        let dialogref = this.dialog.open(DeleteSalonComponent, {
            width: "330px",
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                salonId: this.salonId,
                listId,
                listType: 'service',
                listTitle
            },
        });

        dialogref.afterClosed().subscribe(response => {
            if (this.services && this.services.length === 1 && this.searchString === '' && this.currentPage !== 1) {
                this.currentPage = this.currentPage - 1;
            } else {
                this.currentPage = this.currentPage;
            }
            response && this.servicesDataSource.getSalonServices(
                this.salonId,
                this.offset,
                this.currentPage,
                this.searchString,
                this.type,
                this.price
            );

        })
        dialogref.backdropClick().subscribe(response => {
            response && this.servicesDataSource.getSalonServices(
                this.salonId,
                this.offset,
                this.currentPage,
                this.searchString,
                this.type,
                this.price
            );
        })
    }

}

export class ServicesDataSource extends DataSource<Services> {
    private observeServicesList = new BehaviorSubject<Services[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeServicesListEmpty = new BehaviorSubject<boolean>(false);
    public observeServicesListResponse = new Subject<ServicesResponse>();

    constructor(public servicesService: ServicesService) {
        super();
    }

    getSalonServices(salonId, offset: number, page: number, search: string, type: string, price: string) {
        const finalSearch = search.replace('+', '%2B');
        this.observeLoader.next(true);
        this.servicesService.salonServicesAPI(salonId, offset, page, finalSearch, type, price, (status, response) => {
            this.observeLoader.next(false);
            if (status === ServiceResponse.success) {
                this.observeServicesListEmpty.next(false);
                this.observeServicesListResponse.next(response);
                this.observeServicesList.next(response.services);
            } else if (status === ServiceResponse.emptyList) {
                this.observeServicesListResponse.next(new ServicesResponse());
                this.observeServicesList.next(new Array<Services>());
                this.observeServicesListEmpty.next(true);
            } else {
                this.observeServicesListEmpty.next(true);
            }

        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Services[]> {
        return this.observeServicesList.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}
