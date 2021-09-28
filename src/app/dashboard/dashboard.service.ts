import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { environment } from "src/environments/environment";
import { Constants } from '../../utils/constants';
import { ServiceResponse } from '../../utils/enums';
import { QBconfig } from '../QBconfig';
import {
    BrandListResponse,
    ClientInfoResponse, ClientsResponse, DefaultResponse, ProductDropDownsResponse, ProductLineDropDownsResponse,
    ProductsResponse,
    RitualOverViewRequest, RitualOVerViewResponse, RoutineDetailsRequest,
    ServiceDropdownResponse,
    ServicesResponse, StatesResponse
} from './dashboard.model';
declare var QB: any;

@Injectable({
    providedIn: "root",
})

export class DashboardService {
    public defaultResponse: DefaultResponse;
    public statesResponse: StatesResponse;
    public clientsResponse: ClientsResponse;
    public ServiceDropdownResponse: ServiceDropdownResponse;
    public clientInfoResponse: ClientInfoResponse;
    public ritualOVerViewResponse: RitualOVerViewResponse;
    public servicesResponse: ServicesResponse;
    public productLineListResponse: BrandListResponse;
    public productLineDropDownsResponse: ProductLineDropDownsResponse;
    public productDropDownsResponse: ProductDropDownsResponse;
    public productsResponse: ProductsResponse;

    public isSalonClickedBySuperAdmin = new BehaviorSubject<boolean>(null);
    public clientFilterDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public productLineFilteredDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public productsFilteredDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public salonHeaderTitle: BehaviorSubject<any> = new BehaviorSubject(null);
    public listCurrentPage = -1

    constructor(protected httpClient: HttpClient, private route: Router) { }

    initialiseQuickBlox() {
        QB.init(
            QBconfig.credentials.appId,
            QBconfig.credentials.authKey,
            QBconfig.credentials.authSecret,
            QBconfig.credentials.accountKey,
            QBconfig.appConfig
        );
    }

    logoutService(callback) {
        const url = environment.api_end_point + Constants.logout;
        this.httpClient.get(url).subscribe((defaultResponse: DefaultResponse) => {
            if (defaultResponse.statusCode === 200) {
                localStorage.clear();
                this.route.navigate(["/login"]);
                callback(ServiceResponse.success, defaultResponse);
            } else if (defaultResponse.statusCode === 206) {
                callback(ServiceResponse.newUser, defaultResponse);
            } else {
                callback(ServiceResponse.error, defaultResponse.message);
            }
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

    clientsInfoService(salonId: number, clientId: number, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.client + clientId + Constants.info

        this.httpClient.get(url).subscribe(data => {
            const response = data as ClientInfoResponse;
            this.clientInfoResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.clientInfoResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.clientInfoResponse);
            }
            else {
                callback(ServiceResponse.error, this.clientInfoResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    serviceTypeDropdown(callback) {
        const url = environment.api_end_point + Constants.salon + Constants.serviceTypeDropdown;

        this.httpClient.get(url).subscribe(data => {
            const response = data as ServiceDropdownResponse;
            this.ServiceDropdownResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.ServiceDropdownResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.ServiceDropdownResponse);
            }
            else {
                callback(ServiceResponse.error, this.ServiceDropdownResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    salonActiveServicesAPI(salonId: number, search: string, callback) {
        const searchString = search !== undefined && search !== "" ? '?search=' + search : "";
        const url = environment.api_end_point + Constants.salon + salonId + '/' + Constants.salonActiveService + searchString;

        this.httpClient.get(url).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
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

    routineOverviewService(salonID: number, clientId: number, request: RitualOverViewRequest, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.client + clientId + Constants.clientRoutine;

        this.httpClient.post(url, request).subscribe((data: RitualOVerViewResponse) => {
            this.ritualOVerViewResponse = data;

            if (this.ritualOVerViewResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.ritualOVerViewResponse);
            } else {
                callback(ServiceResponse.error, this.ritualOVerViewResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    routineDetailService(salonID: number, clientId: number, request: RoutineDetailsRequest, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.client + clientId + Constants.clientRoutineDetails;

        this.httpClient.post(url, request).subscribe((data: DefaultResponse) => {
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

    brandListService(offset: number, page: number, search: string, typeId: number, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const productType = typeId !== null && typeId !== undefined ? '&product_type_id=' + typeId : "";

        const url = environment.api_end_point + Constants.brandList + '?page_size=' + offset + '&page=' + page
            + searchString + productType;

        this.httpClient.get(url).subscribe((data: BrandListResponse) => {
            const response = data as BrandListResponse;
            this.productLineListResponse = response;
            if (this.productLineListResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productLineListResponse);
            } else if (this.productLineListResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.productLineListResponse);
            } else {
                callback(ServiceResponse.error, this.productLineListResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    salonBrandsListService(salonId: number, offset: number, page: number, search: string, typeId: number, callback) {
        const searchString = search !== undefined && search !== "" ? 'search=' + search + '&' : "";
        const productType = typeId !== null && typeId !== undefined ? '&product_type_id=' + typeId : "";

        const url = environment.api_end_point + Constants.salon + salonId + '/' + Constants.brandList + '?' + searchString + 'page_size=' + offset + '&page=' + page
            + productType;

        this.httpClient.get(url).subscribe((data: BrandListResponse) => {
            const response = data as BrandListResponse;
            this.productLineListResponse = response;
            if (this.productLineListResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productLineListResponse);
            }
            else if (this.productLineListResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.productLineListResponse);
            } else {
                callback(ServiceResponse.error, this.productLineListResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    brandsDropdownService(callback) {
        const url = environment.api_end_point + Constants.brandsDropdown;
        this.httpClient.get(url).subscribe(data => {
            const response = data as ProductLineDropDownsResponse;
            this.productLineDropDownsResponse = response;

            if (this.productLineDropDownsResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productLineDropDownsResponse);
            } else {
                callback(ServiceResponse.error, this.productLineDropDownsResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    ProductLineDetailsService(brandId: number, callback) {
        const url = environment.api_end_point + Constants.brand + '/' + brandId;

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

    salonServicesDeleteAPI(salonId: number, serviceId: number, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.service + serviceId;
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

    productsDropdownService(brandId: number, callback) {
        const url = environment.api_end_point + Constants.brand + '/' + brandId + Constants.productsDropdown;
        this.httpClient.get(url).subscribe(data => {
            const response = data as ProductDropDownsResponse;
            this.productDropDownsResponse = response;

            if (this.productDropDownsResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productDropDownsResponse);
            } else {
                callback(ServiceResponse.error, this.productDropDownsResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    productListService(brandId: number, page: number, pageSize: number, searchString: string, callback) {
        const search = searchString !== '' ? 'search=' + searchString + '&' : '';
        const url = environment.api_end_point + 'brand/' + brandId + '/products?' + search + 'page=' + page + '&page_size=' + pageSize;;
        this.httpClient.get(url).subscribe(data => {
            const response = data as ProductsResponse;
            this.productsResponse = response;
            if (this.productsResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productsResponse);
            } else if (this.productsResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.productsResponse);
            } {
                callback(ServiceResponse.error, this.productsResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    salonProductListService(salonId: number, brandId: number, page: number, pageSize: number, searchString: string, callback) {
        const search = searchString !== '' ? 'search=' + searchString + '&' : '';
        const url = environment.api_end_point + 'salon/' + salonId + '/brand/' + brandId + '/products?' + search + 'page=' + page + '&page_size=' + pageSize;
        this.httpClient.get(url).subscribe(data => {
            const response = data as ProductsResponse;
            this.productsResponse = response;
            if (this.productsResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productsResponse);
            } else if (this.productsResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.productsResponse);
            } {
                callback(ServiceResponse.error, this.productsResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    productDetailsService(brandId: number, productId: number, callback) {
        const url = environment.api_end_point + Constants.brand + '/' + brandId + '/product/' + productId;
        this.httpClient.get(url).subscribe(data => {
            const response = data as ProductsResponse;
            this.productsResponse = response;

            if (this.productsResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productsResponse);
            } else {
                callback(ServiceResponse.error, this.productsResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    deleteProductService(brandId: number, productId: number, callback) {

        const url = environment.api_end_point + Constants.brand + '/' + brandId + '/' + Constants.products + '/' + productId;

        this.httpClient.delete(url).subscribe((data: DefaultResponse) => {
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

    manageBrandsService(salonId: number, offset: number, page: number, search: string, callback) {

        const searchString = search !== undefined && search !== "" ? 'search=' + search + '&' : "";
        const url = environment.api_end_point + Constants.salon + salonId + '/' + Constants.brandManage + '?' + searchString + 'page_size=' + offset + '&page=' + page;

        this.httpClient.get(url).subscribe((data: BrandListResponse) => {
            const response = data as BrandListResponse;
            this.productLineListResponse = response;
            if (this.productLineListResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productLineListResponse);
            } else {
                callback(ServiceResponse.error, this.productLineListResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    updateSalonBrandsService(request, salonId: number, callback) {

        const url = environment.api_end_point + Constants.salon + salonId + '/' + Constants.brandManageUpdate

        this.httpClient.put(url, request).subscribe((data: BrandListResponse) => {
            const response = data as BrandListResponse;
            this.productLineListResponse = response;
            if (this.productLineListResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productLineListResponse);
            } else {
                callback(ServiceResponse.error, this.productLineListResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    manageProductService(salonId: number, brandId: number, page: number, offset: number, search: string, callback) {

        const searchString = search !== undefined && search !== "" ? 'search=' + search + '&' : "";
        const url = environment.api_end_point + Constants.salon + salonId + '/' + Constants.brand + '/' + brandId + Constants.productsManage + '?' + searchString + 'page_size=' + offset + '&page=' + page;

        this.httpClient.get(url).subscribe((data: ProductsResponse) => {
            const response = data as ProductsResponse;
            this.productsResponse = response;
            if (this.productsResponse.statusCode === 200) {
                callback(ServiceResponse.success, this.productsResponse);
            } else if (this.productsResponse.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.productsResponse);
            } else {
                callback(ServiceResponse.error, this.productsResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    updateManageProductService(salonId: number, brandId: number, request, callback) {

        const url = environment.api_end_point + Constants.salon + salonId + '/' + Constants.brand + '/' + brandId + Constants.productsManageUpdate
        this.httpClient.put(url, request).subscribe((data: DefaultResponse) => {
            const response = data as DefaultResponse;
            this.defaultResponse = response;
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

    deleteRecommendationService(salonId: number, recommendationId: number, callback) {

        const url = environment.api_end_point + Constants.salon + salonId + Constants.recommendation + '/' + recommendationId;

        this.httpClient.delete(url).subscribe((data: DefaultResponse) => {
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

    deleteRewardservice(salonId: number, rewardId: number, callback) {

        const url = environment.api_end_point + Constants.salon + salonId + Constants.reward + '/' + rewardId;

        this.httpClient.delete(url).subscribe((data: DefaultResponse) => {
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

    deleteQuoteservice(quoteId: number, callback) {

        const url = environment.api_end_point + Constants.editQuote + quoteId;

        this.httpClient.delete(url).subscribe((data: DefaultResponse) => {
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

    clientFormsListService(salonId: number, clientId: number, callback) {

        const url = environment.api_end_point + 'salon/' + salonId + '/client/' + clientId + '/form/list';

        this.httpClient.get(url).subscribe((data) => {
            if (data['statusCode'] === 200) {
                callback(ServiceResponse.success, data);
            } else if (data['statusCode'] === 204) {
                callback(ServiceResponse.emptyList, data);
            } else {
                callback(ServiceResponse.error, data);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }
}