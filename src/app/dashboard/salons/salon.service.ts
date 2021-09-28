import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { environment } from "src/environments/environment";
import { ServiceResponse } from 'src/utils/enums';
import { Constants } from '../../../utils/constants';
import { StatesResponse } from '../dashboard.model';

import {
    DefaultResponse,
    FrequenciesResponse,
    InviteClientListResponse,
    ProviderDetails, ProviderDetailsResponse, ProvidersResponse, SalonDetailsResponse, SalonsListResponse
} from './salon.model';

@Injectable({
    providedIn: "root",
})

export class SalonService {
    public observeFilterDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public providerFilterDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public copyProviderDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public defaultResponse: DefaultResponse;
    public salonsListResponse: SalonsListResponse;
    public salonsDetailResponse: SalonDetailsResponse;
    public statesResponse: StatesResponse;
    public providersResponse: ProvidersResponse;
    public frequenciesResponse: FrequenciesResponse;
    public providerDetails: ProviderDetails;
    public providerDetailsResponse: ProviderDetailsResponse;
    public inviteClientListResponse: InviteClientListResponse;
    public listCurrentPage = -1

    constructor(protected httpClient: HttpClient, private route: Router) { }

    satesService(search: string, callback) {
        let searchState
        if (search) {
            searchState = "?search=" + search
        } else {
            searchState = ""
        }
        const url = environment.api_end_point + Constants.statesList + searchState;
        this.httpClient.get(url).subscribe(data => {
            const response = this.statesResponse = data as StatesResponse
            if (response.statusCode === 200) {
                callback(ServiceResponse.success, response);
            }
        })
    }

    salonsListService(offset: number, page: number, search: string, state: string, status: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const selectedState = !state !== undefined && state !== "" ? '&state=' + state : "";
        const selectedStatus = !status !== undefined && status !== "" ? '&status=' + status : "";

        const url = environment.api_end_point + Constants.salonsList + 'list?page_size=' + offset + '&page=' + page
            + searchString + selectedState + selectedStatus;

        this.httpClient.get(url).subscribe(data => {
            const response = data as SalonsListResponse;
            this.salonsListResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.salonsListResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.salonsListResponse);
            }
            else {
                callback(ServiceResponse.error, this.salonsListResponse.message);
            }
        });
    }

    salonsDetailsService(id, callback) {

        const url = environment.api_end_point + Constants.salonsList + id;

        this.httpClient.get(url).subscribe(data => {
            const response = data as SalonDetailsResponse;
            this.salonsDetailResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.salonsDetailResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.salonsDetailResponse);
            }
            else {
                callback(ServiceResponse.error, this.salonsDetailResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error.message);
            });;
    }

    deleteSalon(id: number, callback) {
        const url = environment.api_end_point + Constants.salonsList + id;
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

    createSalonService(request, callback) {
        const url = environment.api_end_point + Constants.addSalon;

        this.httpClient.post(url, request).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else if (this.defaultResponse.statusCode === 201) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    editSalonService(id, request, callback) {
        const url = environment.api_end_point + Constants.salon + id;

        this.httpClient.put(url, request).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else if (this.defaultResponse.statusCode === 201) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    providerListService(salonId: number, offset: number, page: number, search: string, status: string, state: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const stateString = state !== undefined && state !== "" ? '&state=' + state : "";
        const selectedStatus = !status !== undefined && status !== "" ? '&status=' + status : "";
        const url = environment.api_end_point + Constants.salon + salonId + Constants.providerList + '?page_size=' + offset + '&page=' + page
            + searchString + selectedStatus + stateString;

        this.httpClient.get(url).subscribe(data => {
            const response = data as ProvidersResponse;
            this.providersResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.providersResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.providersResponse);
            }
            else {
                callback(ServiceResponse.error, this.providersResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    providerDetailsService(salonId: number, providerId: number, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.provider + providerId;

        this.httpClient.get(url).subscribe(data => {
            const response = data as ProviderDetailsResponse;
            this.providerDetailsResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.providerDetailsResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.providerDetailsResponse);
            }
            else {
                callback(ServiceResponse.error, this.providerDetailsResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    createProviderService(salonID: number, request: ProviderDetails, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.providerCreate;

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

    updateProviderService(salonID: number, providerId: number, request: ProviderDetails, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.provider + providerId;

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

    // Invite users APIs 

    InviteUsersListService(salonId: number, searchRequest, offset: number, page: number, callback) {
        // const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const url = environment.api_end_point + Constants.salon + salonId + '/invite/client/list' + '?page_size=' + offset + '&page=' + page

        this.httpClient.post(url, searchRequest).subscribe(data => {
            const response = data as InviteClientListResponse;
            this.inviteClientListResponse = response

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.inviteClientListResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.inviteClientListResponse);
            }
            else {
                callback(ServiceResponse.error, this.inviteClientListResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    CreateInviteUserService(salonId: number, request, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + '/invite/client/add';

        this.httpClient.post(url, request).subscribe(data => {
            const response = data as InviteClientListResponse;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, response);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, response);
            }
            else {
                callback(ServiceResponse.error, response);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

}