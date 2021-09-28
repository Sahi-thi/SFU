import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { AnalyticResponse } from './shared-analytic.model';
@Injectable({
    providedIn: 'root'
})
export class SharedAnalyticService {
    public analyticResponse: AnalyticResponse;

    public listCurrentPage = -1

    constructor(protected httpClient: HttpClient, private route: Router) { }

    userAnalyticsList(salonId: number, startDate: string, endDate: string, headerTab: string, callback) {
        if (headerTab === 'Over View Analytics') {
            var url = environment.api_end_point + Constants.overallUserAnalytic + '?start_date=' + startDate + '&end_date=' + endDate;
        }
        else {
            var url = environment.api_end_point + Constants.salon + salonId + Constants.userAnalytic + '?start_date=' + startDate + '&end_date=' + endDate;
        }
        this.httpClient.get(url).subscribe(data => {
            const response = data as AnalyticResponse;
            this.analyticResponse = response;

            if (this.analyticResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.analyticResponse);
            } else if (this.analyticResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.analyticResponse);
            } else {
                callback(ServiceResponse.error, this.analyticResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });

    }



    productAnalyticsList(salonId: number, startDate: string, endDate: string, headerTab: string, callback) {
        if (headerTab === 'Over View Analytics') {
            var url = environment.api_end_point + Constants.overallProductAnalytic + '?start_date=' + startDate + '&end_date=' + endDate;
        }
        else {

            var url = environment.api_end_point + Constants.salon + salonId + Constants.productAnalytic + '?start_date=' + startDate + '&end_date=' + endDate;
        }

        this.httpClient.get(url).subscribe(data => {
            const response = data as AnalyticResponse;
            this.analyticResponse = response;

            if (this.analyticResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.analyticResponse);
            } else if (this.analyticResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.analyticResponse);
            } else {
                callback(ServiceResponse.error, this.analyticResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });

    }

    serviceAnalyticsList(salonId: number, startDate: string, endDate: string, headerTab: string, callback) {
        if (headerTab === 'Over View Analytics') {
            var url = environment.api_end_point + Constants.overallServiceAnalytic + '?start_date=' + startDate + '&end_date=' + endDate;
        }
        else {
            var url = environment.api_end_point + Constants.salon + salonId + Constants.serviceAnalytic + '?start_date=' + startDate + '&end_date=' + endDate;

        }
        this.httpClient.get(url).subscribe(data => {
            const response = data as AnalyticResponse;
            this.analyticResponse = response;

            if (this.analyticResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.analyticResponse);
            } else if (this.analyticResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.analyticResponse);
            } else {
                callback(ServiceResponse.error, this.analyticResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });

    }



    overallAppointmentAnalyticsList(startDate: string, endDate: string, callback) {

        const url = environment.api_end_point + Constants.overallAppointmentAnalytic + '?start_date=' + startDate + '&end_date=' + endDate;

        this.httpClient.get(url).subscribe(data => {
            const response = data as AnalyticResponse;
            this.analyticResponse = response;

            if (this.analyticResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.analyticResponse);
            } else if (this.analyticResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.analyticResponse);
            } else {
                callback(ServiceResponse.error, this.analyticResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });

    }

}
