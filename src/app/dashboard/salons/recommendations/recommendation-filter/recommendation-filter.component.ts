import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductList } from 'src/app/dashboard/dashboard.model';
import { ServiceResponse } from 'src/utils/enums';
import { RecommendationService } from '../recommendation.service';
import { ServiceTypesResponse } from '../recommendation.model';

@Component({
    selector: 'app-recommendation-filter',
    templateUrl: './recommendation-filter.component.html',
    styleUrls: ['./recommendation-filter.component.scss']
})
export class RecommendationFilterComponent implements OnInit {
    productsResponse: ProductList;
    serviceTypesResponse: ServiceTypesResponse;
    salon_id: number;
    product: number;
    serviceTypeId: number;
    isLoadingAPI: boolean;
    isProduct: boolean;

    constructor(
        private dialogRef: MatDialogRef<RecommendationFilterComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        public recommendationService: RecommendationService) { }

    ngOnInit() {
        this.salon_id = this.data.salonId;
        this.product = this.data.product;
        this.isProduct = this.data.isProduct;
        this.serviceTypeId = this.data.serviceTypeId;
        this.isProduct ?
            this.getFilterProducts() :
            this.getFilterServiceTypes();
    }

    getFilterProducts() {
        this.isLoadingAPI = true;
        this.recommendationService.recommendationFilterService(this.salon_id, (status, response) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.productsResponse = response.products;
            }
        })
    }

    getFilterServiceTypes() {
        this.isLoadingAPI = true;
        this.recommendationService.SalonServiceTypes((status, response) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.serviceTypesResponse = response;
            }
        });
    }

    removeFilterData() {
        this.dialogRef.close(
        {
            product: null,
            serviceTypeId: null
        })
    }

    applyFilter() {
        this.dialogRef.close(
        {
            product: this.product,
            serviceTypeId: this.serviceTypeId
        });
    }
}
