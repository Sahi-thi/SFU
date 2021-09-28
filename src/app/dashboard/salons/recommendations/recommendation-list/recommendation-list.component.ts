import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RecommendationFilterComponent } from '../recommendation-filter/recommendation-filter.component';
import { ServiceResponse } from 'src/utils/enums';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DeleteSalonComponent } from 'src/app/shared/delete-salon/delete-salon.component';
import { Title } from '@angular/platform-browser';
import { Constants } from 'src/utils/constants';
import { RecommendationResponse, MetaData, Recommendation } from '../recommendation.model';
import { RecommendationService } from '../recommendation.service';

@Component({
    selector: 'app-recommendation-list',
    templateUrl: './recommendation-list.component.html',
    styleUrls: ['./recommendation-list.component.scss']
})

export class RecommendationListComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;
    displayedColumns: string[] = ['client_name', 'email', 'brand', 'product_name', 'edit', 'delete'];
    skeletonHead: string[] = ['Client Name', 'Email', 'Brand', 'Product', '', '']
    servicesColumns: string[] = ['client_name', 'email', 'service_type', 'service', 'edit', 'delete'];
    servicesSkeletonHead: string[] = ['Client Name', 'Email', 'Service Type', 'Service', '', '']
    skeletonColumn: string[] = ['recommend-name', 'recommend-email', 'recommend-comp', '', 'w-40', 'w-40'];
    metaData: MetaData;
    RecommendationDataSource: RecommendationDataSource;
    recommendationsResponse: RecommendationResponse;
    recommendation: Recommendation[];
    isProduct = true;
    searchString = "";
    currentPage: number = 1;
    salonId: number;
    offset = 10;
    isRecommendationEmpty: boolean;
    isLoadingAPI: boolean;
    product = null;
    requestObject;
    recommendationType = 'Product';
    headerTab = '';
    constructor(
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private recommendationService: RecommendationService,
        private titleService: Title,
        private router: Router,
    ) { }

    ngOnInit() {

        this.titleService.setTitle(Constants.skinForYou + Constants.recommendations);
        this.headerTab = localStorage.getItem('headerTab');

        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });

        this.recommendationService.recommendationFilteredDetails.subscribe((details) => {
            if (details) {
                this.product = details.product;
                this.searchString = details.searchString
            }
        });

        this.recommendationService.recommendationTypeSubject.next(this.recommendationType)
        this.getRecommendationsData();
        this.subscribeData();
    }

    onClickRecommendingProduct() {
        if (this.headerTab === 'Studios') {
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/recommendations/products');
        } else {
            this.navigationToScreen('/home/recommendations/products');
        }
    }

    onClickRecommendingService() {
        if (this.headerTab === 'Studios') {
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/recommendations/services');
        } else {
            this.navigationToScreen('/home/recommendations/services');
        }

    }

    navigationToScreen(URL: string) {
        this.router.navigate([URL], {
            relativeTo: this.activatedRoute,
        })
    }

    onClickAddRecommend(isProduct) {
        localStorage.setItem('isProduct', isProduct)
    }

    getRecommendationsData() {
        if (this.recommendationService.listCurrentPage != -1) {
            this.currentPage = this.recommendationService.listCurrentPage
        }

        this.RecommendationDataSource = new RecommendationDataSource(this.recommendationService);
        this.RecommendationDataSource.getRecommendationListService(this.salonId, this.offset, this.currentPage, this.searchString, this.product);
    }

    subscribeData() {
        this.RecommendationDataSource.observeRecommendationResponse.subscribe(usersListData => {
            this.recommendationsResponse = usersListData;
            this.recommendation = this.recommendationsResponse.recommendations;
            this.metaData = this.recommendationsResponse.meta_data;
        });

        this.RecommendationDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.RecommendationDataSource.observeRecommendationEmpty.subscribe(isListEmpty => {
            this.isRecommendationEmpty = isListEmpty;
        });
    }

    ngOnDestroy() {
        this.RecommendationDataSource.observeLoader.unsubscribe();
        this.RecommendationDataSource.observeRecommendationEmpty.unsubscribe();
        this.RecommendationDataSource.observeRecommendationResponse.unsubscribe();
    }

    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.RecommendationDataSource.getRecommendationListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.product

        );
    }

    clearSearch() {

        this.searchString = "";

        this.RecommendationDataSource.getRecommendationListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.product

        );
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.RecommendationDataSource.getRecommendationListService(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.product

        );

        this.persistanceData();
    }

    persistanceData() {
        localStorage.setItem("a_page_index", "" + this.currentPage);
    }

    navigateToInfo(element, event) {
        event.stopPropagation();
        localStorage.setItem('btnTitle', 'EDIT');
        localStorage.setItem('recommendationTitle', element.client_name);
        localStorage.setItem('isFromDetails', 'true');
        localStorage.setItem('isProduct', 'true');
        this.navigationDetails()
    }

    isRecommendationAdded(): boolean {
        if (this.recommendation) {
            return true
        } else {
            return this.searchString === '' || this.searchString === null && this.product === null ? false : true
        }
    }

    openRecommendationsFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;
        let salonID: any = this.salonId;
        localStorage.setItem('salon_id filter', salonID);
        let recommendationDialogref = this.dialog.open(RecommendationFilterComponent, {
            width: "330px",
            position: { right: right + 'px', top: top + 'px' },
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                product: this.product,
                salonId: this.salonId,
                isProduct: this.isProduct,
            },
        });
        recommendationDialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.product = response.product;
                this.currentPage = 1;
                this.RecommendationDataSource.getRecommendationListService(
                    this.salonId,
                    this.offset,
                    this.currentPage,
                    this.searchString,
                    this.product
                )
            }
        })
    }

    openEditMenu(event) {
        event.stopPropagation();
        localStorage.setItem('btnTitle', 'SAVE');
        localStorage.setItem('recommendationTitle', 'Edit');
        localStorage.setItem('isFromDetails', 'false');
        localStorage.setItem('isProduct', 'true');

        this.navigationDetails()
    }
    openDeleteDialog(listId: number, event) {
        event.stopPropagation();
        let dialogref = this.dialog.open(DeleteSalonComponent, {
            width: "330px",
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                listId,
                listType: 'recommendation',
                salonId: Number(this.salonId)
            },
        });

        dialogref.afterClosed().subscribe(response => {
            if (this.recommendation && this.recommendation.length === 1 && this.searchString === '' && this.currentPage !== 1) {
                this.currentPage = this.currentPage - 1;
            } else {
                this.currentPage = this.currentPage;
            }
            response && this.RecommendationDataSource.getRecommendationListService(
                this.salonId,
                this.offset,
                this.currentPage,
                this.searchString,
                this.product,
            );
        })
    }

    navigationDetails() {
        this.requestObject = {
            product: this.product,
            searchString: this.searchString,
        }
        this.recommendationService.recommendationFilteredDetails.next(this.requestObject)
    }
}

export class RecommendationDataSource extends DataSource<Recommendation> {
    private observeRecommendation = new BehaviorSubject<Recommendation[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeRecommendationEmpty = new BehaviorSubject<boolean>(false);
    public observeRecommendationResponse = new Subject<RecommendationResponse>();

    recommendedType = '';
    recommendTypeSub
    constructor(public recommendationService: RecommendationService) {
        super();
    }

    getRecommendationListService(salonId: number, offset: number, page: number, search: string, productId: number) {
        search = search.replace('+', '%2B');
        this.observeLoader.next(true);
        this.recommendationService.RecommendationListService(salonId, offset, page, search, productId, (status, response) => {
            this.observeLoader.next(false);
            if (status === ServiceResponse.success) {
                this.observeRecommendationEmpty.next(false);
                this.observeRecommendationResponse.next(response);
                this.observeRecommendation.next(response.recommendations);
            } else if (status === ServiceResponse.emptyList) {
                this.observeRecommendationResponse.next(new RecommendationResponse());
                this.observeRecommendation.next(new Array<Recommendation>());
                this.observeRecommendationEmpty.next(true);
            } else {
                this.observeRecommendationEmpty.next(true);
            }
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Recommendation[]> {
        return this.observeRecommendation.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

    ngOnDestroy() {
        this.recommendTypeSub.unsubscribe();
    }

}