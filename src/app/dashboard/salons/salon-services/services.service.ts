import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { ServicesResponse, DefaultResponse, ServiceDetailsForm } from './services.model';

@Injectable({
    providedIn: "root",
})

export class ServicesService {

    public servicesFilteredDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public defaultResponse: DefaultResponse;
    public servicesResponse: ServicesResponse;
    public listCurrentPage = -1

    constructor(protected httpClient: HttpClient, private route: Router) { }

    salonServicesAPI(salonId: number, offset: number, page: number, search: string, serviceType: string, price: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const selectedType = serviceType !== undefined && serviceType !== "" ? '&type=' + serviceType : "";
        const selectedPrice = price !== undefined && price !== "" && price !== null ? '&price=' + price : "";

        const url = environment.api_end_point + Constants.salon + salonId + Constants.serviceList + '?page_size=' + offset + '&page=' + page
            + searchString + selectedType + selectedPrice;

        this.httpClient.get(url).subscribe((data: ServicesResponse) => {
            this.servicesResponse = data;
            if (this.servicesResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.servicesResponse);
            } else if (this.servicesResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.servicesResponse);
            }
            else {
                callback(ServiceResponse.error, this.servicesResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    salonServicesAddAPI(salonId: number, request: ServiceDetailsForm, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.serviceAdd;

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

    salonServicesUpdateAPI(salonId: number, serviceId: number, request: ServiceDetailsForm, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.service + serviceId;

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

    salonServicesDetailsAPI(salonId: number, serviceId: number, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.service + serviceId;

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