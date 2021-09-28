import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { Brands, BrandListResponse } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';

export class ProductLineDataSource extends DataSource<Brands> {

    private observeProductLine = new BehaviorSubject<Brands[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeProductLineEmpty = new BehaviorSubject<boolean>(false);
    public observeProductLineResponse = new Subject<BrandListResponse>();

    headerTab = '';
    tabtitle
    constructor(public dashboardService: DashboardService,
        public titleService: Title) {
        super();
        this.headerTab = localStorage.getItem('headerTab');

        if (this.headerTab === "Studios") this.tabtitle = " Manage Brands"
        if (this.headerTab === "Brands") this.tabtitle = "Brands"
    }

    getProductLines(salonId: number, offset: number, page: number, search: string, typeId: number) {
        this.titleService.setTitle(Constants.skinForYou + this.tabtitle);

        const finalSearch = search.replace('+', '%2B');
        this.observeLoader.next(true);
        this.headerTab === 'Studios' ?
            this.salonBrandsList(salonId, offset, page, finalSearch, typeId) :
            this.brandList(salonId, offset, page, finalSearch, typeId);
    }

    brandList(salonId: number, offset: number, page: number, finalSearch: string, typeId: number) {
        this.dashboardService.brandListService(offset, page, finalSearch, typeId, (status, response) => {
            this.observeLoader.next(false);
            if (status === ServiceResponse.success) {
                this.observeProductLineEmpty.next(false);
                this.observeProductLineResponse.next(response);
                this.observeProductLine.next(response.brands);
            } else if (status === ServiceResponse.emptyList) {
                this.observeProductLineResponse.next(new BrandListResponse());
                this.observeProductLine.next(new Array<Brands>());
                this.observeProductLineEmpty.next(true);
            } else {
                this.observeProductLineEmpty.next(true);
            }
        });
    }

    salonBrandsList(salonId: number, offset: number, page: number, finalSearch: string, typeId: number) {
        this.dashboardService.salonBrandsListService(salonId, offset, page, finalSearch, typeId, (status, response) => {
            this.observeLoader.next(false);

            if (status === ServiceResponse.success) {
                this.observeProductLineEmpty.next(false);
                this.observeProductLineResponse.next(response);
                this.observeProductLine.next(response.brands);
            } else if (status === ServiceResponse.emptyList) {
                this.observeProductLineResponse.next(new BrandListResponse());
                this.observeProductLine.next(new Array<Brands>());
                this.observeProductLineEmpty.next(true);
            } else {
                this.observeProductLineEmpty.next(true);
            }
        });
    }

    getManageProductLines(salonId: number, offset: number, page: number, search: string) {
        const finalSearch = search.replace('+', '%2B');
        this.observeLoader.next(true);
        this.dashboardService.manageBrandsService(salonId, offset, page, finalSearch, (status, response) => {
            this.observeLoader.next(false);

            if (status === ServiceResponse.success) {
                this.observeProductLineEmpty.next(false);
                this.observeProductLineResponse.next(response);
                this.observeProductLine.next(response.brands);
            } else if (status === ServiceResponse.emptyList) {
                this.observeProductLineResponse.next(new BrandListResponse());
                this.observeProductLine.next(new Array<Brands>());
                this.observeProductLineEmpty.next(true);
            } else {
                this.observeProductLineEmpty.next(true);
            }
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Brands[]> {
        return this.observeProductLine.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        // this.observeParticipantsList.complete();
        // this.observeLoader.complete();
    }
}