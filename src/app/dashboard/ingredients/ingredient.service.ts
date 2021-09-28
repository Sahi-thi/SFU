import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { DefaultResponse, IngredientListResponse } from './ingredient.model';

@Injectable({
    providedIn: 'root'
})
export class IngredientService {
    defaultResponse: DefaultResponse;
    ingredientListResponse: IngredientListResponse;
    public listCurrentPage = -1
    constructor(private httpClient: HttpClient) { }

    ingredientListService(search: string, page: number, offset: number, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";

        const url = environment.api_end_point + Constants.ingredientList + '?' + searchString + '&page=' + page + '&page_size=' + offset;

        this.httpClient.get(url).subscribe((data: IngredientListResponse) => {
            this.ingredientListResponse = data;
            if (this.ingredientListResponse.statusCode === 200) {
                this.listCurrentPage = this.ingredientListResponse.meta_data.page;
                callback(ServiceResponse.success, this.ingredientListResponse);
            } else {
                callback(ServiceResponse.error, this.ingredientListResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    createIngredientService(createRequest, callback) {

        const url = environment.api_end_point + Constants.createIngredient;

        this.httpClient.post(url, createRequest).subscribe((data: DefaultResponse) => {
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

    updateIngredientService(id: number, editRequest, callback) {

        const url = environment.api_end_point + Constants.ingredient + id;

        this.httpClient.put(url, editRequest).subscribe((data: DefaultResponse) => {
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

    deleteIngredientService(id: number, callback) {

        const url = environment.api_end_point + Constants.ingredient + id;

        this.httpClient.delete(url).subscribe((data: DefaultResponse) => {
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