import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProductDetails } from 'src/app/dashboard/dashboard.model';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ServiceResponse } from 'src/utils/enums';
import { ActivatedRoute } from '@angular/router';
import { IngredientsDropDown, SkinConcernsDropDown, SkinTypesDropDown } from '../../../dashboard.model';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

    products: ProductDetails;
    ingredients: IngredientsDropDown[];
    skinConcerns: SkinConcernsDropDown[];
    skinTypes: SkinTypesDropDown[];
    productLogo = '';
    isLoadingAPI = false;
    productId = null;
    productLineId = null;

    constructor(private location: Location,
        private dashboardService: DashboardService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            console.log(params);
            this.productId = params['product_id'];
            this.productLineId = params['product_line_id'];
        });

        this.getProductsDetails();
    }

    getProductsDetails() {
        this.isLoadingAPI = true;
        this.dashboardService.productDetailsService(this.productLineId, this.productId, (status: ServiceResponse, response: { product: ProductDetails; }) => {
            // console.log({ response });
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.products = response.product;
                this.skinConcerns = this.products.skin_concerns;
                this.skinTypes = this.products.skin_types;
                this.ingredients = this.products.ingredients;
                console.log(this.skinTypes);
            }
        });
    }

    onClickGoBack() {
        this.location.back();
    }

}
