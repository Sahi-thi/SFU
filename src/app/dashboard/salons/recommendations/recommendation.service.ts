import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DefaultResponse } from 'src/app/auth/auth.model';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { ActiveServicesResponse, ClientsResponse, FrequenciesResponse, GetRecommendationDetailsResponse, RecommendationDropDownsResponse, RecommendationFilterResponse, RecommendationProductDetails, RecommendationResponse, ServiceTypesResponse } from './recommendation.model';

@Injectable({
    providedIn: 'root',
})

export class RecommendationService {
    public defaultResponse: DefaultResponse;
    public clientsResponse: ClientsResponse;
    public recommendationFilterResponse: RecommendationFilterResponse;
    public recommendationResponse: RecommendationResponse;
    public recommendationDropdownResponse: RecommendationDropDownsResponse;
    public recommendationDetailsResponse: GetRecommendationDetailsResponse;
    public activeServicesResponse: ActiveServicesResponse;
    public frequenciesResponse: FrequenciesResponse
    public serviceTypesResponse: ServiceTypesResponse
    public recommendationFilteredDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public serviceSearchDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public productSearchDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public listCurrentPage = -1;
    public recommendationTypeSubject: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor(
        protected httpClient: HttpClient
    ) { }

    RecommendationDetailsService(salonId: number, search: string, callback) {
        let searchState
        if (search) {
            searchState = "?search=" + search
        } else {
            searchState = ""
        }
        const url = environment.api_end_point + Constants.salon + salonId + Constants.recommendationDropdownDetails + searchState;

        this.httpClient.get(url).subscribe((data: RecommendationDropDownsResponse) => {
            this.recommendationDropdownResponse = data;
            if (this.recommendationDropdownResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.recommendationDropdownResponse);
            } else if (this.recommendationDropdownResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.recommendationDropdownResponse);
            }
            else {
                callback(ServiceResponse.error, this.recommendationDropdownResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    createRecommendationService(salonID: number, request: RecommendationProductDetails, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.recommendationCreate;

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

    updateRecommendationService(salonID: number, recommendationId: number, request, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.recommendation + '/' + recommendationId;

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

    RecommendationListService(salonId: number, offset: number, page: number, search: string, typeId: number, callback) {

        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const productType = typeId !== null && typeId !== undefined ? '&product_id=' + typeId : "";

        const url = environment.api_end_point + Constants.salon + salonId + Constants.recommendationList + '?' + searchString + '&page=' + page + '&page_size=' + offset
            + productType;

        this.httpClient.get(url).subscribe(data => {
            const response = data as RecommendationResponse;
            this.recommendationResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.recommendationResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.recommendationResponse);
            }
            else {
                callback(ServiceResponse.error, this.recommendationResponse.message);
            }
        });
    }

    ServiceRecommendationListService(salonId: number, offset: number, page: number, search: string, typeId: number, callback) {

        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const serviceType = typeId !== null && typeId !== undefined ? '&service_id=' + typeId : "";

        const url = environment.api_end_point + Constants.salon + salonId + Constants.recommendationServiceList + '?' + searchString + '&page=' + page + '&page_size=' + offset
            + serviceType;

        this.httpClient.get(url).subscribe(data => {
            const response = data as RecommendationResponse;
            this.recommendationResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.recommendationResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.recommendationResponse);
            }
            else {
                callback(ServiceResponse.error, this.recommendationResponse.message);
            }
        });
    }

    recommendationFilterService(salonId: number, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.recommendationFilter;

        this.httpClient.get(url).subscribe(data => {
            const response = data as RecommendationFilterResponse;
            this.recommendationFilterResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.recommendationFilterResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.recommendationFilterResponse);
            }
            else {
                callback(ServiceResponse.error, this.recommendationFilterResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    getRecommendationDetailsService(salonId: number, recommendationId: number, callback) {

        const url = environment.api_end_point + Constants.salon + salonId + '/recommendation/' + recommendationId;

        this.httpClient.get(url).subscribe(data => {
            const response = data as GetRecommendationDetailsResponse;
            this.recommendationDetailsResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.recommendationDetailsResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.recommendationDetailsResponse);
            }
            else {
                callback(ServiceResponse.error, this.recommendationDetailsResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    productsListService(salonId: number, masterproductId: number, page: number, offset: number, search: string, callback) {
        const searchString = search !== undefined && search !== "" ? 'search=' + search + '&' : "";
        const url = environment.api_end_point + Constants.salon + salonId + '/' + Constants.brand + '/' + masterproductId + Constants.recommendationProducts +
            '?' + searchString + '&page=' + page + '&page_size=' + offset;
        this.httpClient.get(url).subscribe(data => {
            const response = data as DefaultResponse;
            this.defaultResponse = response;

            if (this.defaultResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else if (this.defaultResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    clientsListService(salonId: number, offset: number, page: number, search: string, status: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const selectedStatus = !status !== undefined && status !== "" ? '&status=' + status : "";

        const url = environment.api_end_point + Constants.salon + salonId + Constants.clientList + '?page_size=' + offset + '&page=' + page
            + searchString + selectedStatus;

        this.httpClient.get(url).subscribe(data => {
            const response = data as ClientsResponse;
            this.clientsResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.clientsResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.clientsResponse);
            }
            else {
                callback(ServiceResponse.error, this.clientsResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    SalonActiveServicesList(salonId: number, search: string, callback) {
        const searchString = search !== undefined && search !== "" ? '?search=' + search : "";
        const url = environment.api_end_point + Constants.salon + salonId + Constants.activeServiceList + searchString;

        this.httpClient.get(url).subscribe(data => {
            const response = data as ActiveServicesResponse;
            this.activeServicesResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.activeServicesResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.activeServicesResponse);
            }
            else {
                callback(ServiceResponse.error, this.activeServicesResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    ProductFrequencies(callback) {
        const url = environment.api_end_point + 'brand/getFrequencies';
        this.httpClient.get(url).subscribe(data => {
            const response = data as FrequenciesResponse;
            this.frequenciesResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.frequenciesResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.frequenciesResponse);
            }
            else {
                callback(ServiceResponse.error, this.frequenciesResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    SalonServiceTypes(callback) {
        const url = environment.api_end_point + 'salon/service/types';
        this.httpClient.get(url).subscribe(data => {
            const response = data as ServiceTypesResponse;
            this.serviceTypesResponse = response;
            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.serviceTypesResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.serviceTypesResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

}