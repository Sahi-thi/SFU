import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { DefaultResponse, ProductDetails, addBrandFormData, ServiceDetailsForm } from './product-lines.model';

@Injectable({
    providedIn: "root",
})

export class BrandsService {

    public defaultResponse: DefaultResponse;
    public listCurrentPage = -1

    constructor(protected httpClient: HttpClient, private route: Router) { }

    createProductService(brandId: number, request: ProductDetails, callback) {
        const url = environment.api_end_point + Constants.brand + '/' + brandId + Constants.createProduct;

        this.httpClient.post(url, request).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 201) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    updateProductService(brandId: number, productId: number, request: ProductDetails, callback) {
        const url = environment.api_end_point + Constants.brand + '/' + brandId + '/' + Constants.products + '/' + productId;

        this.httpClient.put(url, request).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 201) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else if (this.defaultResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.defaultResponse);

            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    BrandDeleteService(brandId: number, callback) {
        const url = environment.api_end_point + Constants.brand + '/' + brandId;
        this.httpClient.delete(url).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error.message);
            });
    }

    addBrandService(request: addBrandFormData, callback) {
        const url = environment.api_end_point + Constants.createBrand;

        this.httpClient.post(url, request).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 201) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    BrandUpdateService(brandId: number, request: ServiceDetailsForm, callback) {
        const url = environment.api_end_point + Constants.brand + '/' + brandId;
        this.httpClient.put(url, request).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    IngredientBySearch(search: string, page: number, pageSize: number, callback) {
        const searchString = search !== undefined && search !== "" ? 'search=' + search + '&' : "";
        const url = environment.api_end_point + 'ingredient/getIngredientsBySearch?' + searchString + 'page=' + page + '&page_size=' + pageSize;

        this.httpClient.get(url).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

}