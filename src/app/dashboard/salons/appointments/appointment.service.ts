import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import {
    appointmentDetails,
    AppointmentResponse,
    CalendarListResponse,
    DefaultResponse, GetAppointmentDetailsResponse, ServicesResponse
} from './appointment.model';

@Injectable({
    providedIn: "root",
})

export class AppointmentService {

    public appointmentFilteredDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public appointmentDetailsResponse: GetAppointmentDetailsResponse
    public calendarListResponse: CalendarListResponse;
    public appointmentResponse: AppointmentResponse;
    public servicesResponse: ServicesResponse;
    public defaultResponse: DefaultResponse;
    public listCurrentPage = -1

    constructor(protected httpClient: HttpClient, private route: Router) { }

    appointmentsProductsList(salonId: number, search: string, callback) {
        let searchString
        if (search) {
            searchString = "?search=" + search
        } else {
            searchString = ""
        }

        const url = environment.api_end_point + Constants.salon + salonId + Constants.appointmentProducts + searchString;

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

    appointmentDiscountProductsList(request, salonId: number, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.appointmentProducts;
        this.httpClient.post(url, request).subscribe(data => {
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

    createAppointmentService(salonID: number, request: appointmentDetails, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.appointmentCreate;

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
    // un register clients 
    createUnregisterAppointmentService(salonID: number, request: appointmentDetails, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.unregisterAppointmentCreate;

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

    appointmentListService(salonId: number, offset: number, page: number, search: string, serviceId: number, statusType: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const service = serviceId !== null && serviceId !== undefined ? '&service=' + serviceId : "";
        const status = statusType !== null && statusType !== undefined ? '&status=' + statusType : "";

        const url = environment.api_end_point + Constants.salon + salonId + Constants.appointmentList + '?' + searchString + '&page=' + page + '&page_size=' + offset
            + service + status;

        this.httpClient.get(url).subscribe(data => {
            const response = data as AppointmentResponse;
            this.appointmentResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.appointmentResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.appointmentResponse);
            }
            else {
                callback(ServiceResponse.error, this.appointmentResponse.message);
            }
        });
    }

    // Un Register appointment List
    unRegisterUsersAppointmentListService(salonId: number, offset: number, page: number, search: string, serviceId: number, statusType: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const service = serviceId !== null && serviceId !== undefined ? '&service=' + serviceId : "";
        const status = statusType !== null && statusType !== undefined ? '&status=' + statusType : "";

        const url = environment.api_end_point + Constants.salon + salonId + Constants.unRegisterAppointmentList + '?' + searchString + '&page=' + page + '&page_size=' + offset
            + service + status;

        this.httpClient.get(url).subscribe(data => {
            const response = data as AppointmentResponse;
            this.appointmentResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.appointmentResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.appointmentResponse);
            }
            else {
                callback(ServiceResponse.error, this.appointmentResponse.message);
            }
        });
    }

    getAppointmentDetailsService(salonId: number, appointmentId: number, callback) {

        const url = environment.api_end_point + Constants.salon + salonId + Constants.appointment + '/' + appointmentId;

        this.httpClient.get(url).subscribe(data => {
            const response = data as GetAppointmentDetailsResponse;
            this.appointmentDetailsResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.appointmentDetailsResponse);
            }
            else {
                callback(ServiceResponse.error, this.appointmentDetailsResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }
    // unregister appointment details 
    getUnregisterAppointmentDetailsService(salonId: number, appointmentId: number, callback) {

        const url = environment.api_end_point + Constants.salon + salonId + Constants.appointment + '/unregister/' + appointmentId;

        this.httpClient.get(url).subscribe(data => {
            const response = data as GetAppointmentDetailsResponse;
            this.appointmentDetailsResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.appointmentDetailsResponse);
            }
            else {
                callback(ServiceResponse.error, this.appointmentDetailsResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    calendarListService(salonId: number, date: string, serviceId: number, statusType: string, callback) {
        const service = serviceId !== null && serviceId !== undefined ? '&service=' + serviceId : "";
        const status = statusType !== null && statusType !== '' ? '&status=' + statusType : "";

        const url = environment.api_end_point + Constants.salon + salonId + Constants.appointmentCalendarList + '?date=' + date
            + service + status;

        this.httpClient.get(url).subscribe(data => {
            const response = data as CalendarListResponse;
            this.calendarListResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.calendarListResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.calendarListResponse);
            }
            else {
                callback(ServiceResponse.error, this.calendarListResponse.message);
            }
        });
    }

    updateAppointmentService(salonID: number, appointmentId: number, request: appointmentDetails, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.appointment + '/' + appointmentId;

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
    // unregister appointment update 
    updateUnregisterAppointmentService(salonID: number, appointmentId: number, request: appointmentDetails, callback) {
        const url = environment.api_end_point + Constants.salon + salonID + Constants.appointment + '/unregister/' + appointmentId;

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

    salonActiveServicesAPI(salonId: number, search: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const url = environment.api_end_point + Constants.salon + salonId + '/' + Constants.salonActiveService + searchString;

        this.httpClient.get(url).subscribe((data: DefaultResponse) => {
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

    appointmentActiveServices(salonId: number, search: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const url = environment.api_end_point + Constants.salon + salonId + Constants.appointment + Constants.serviceList + searchString;
        this.httpClient.get(url).subscribe((data: DefaultResponse) => {
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

    appointmentDiscountActiveServices(request, salonId: number, callback) {
        const url = environment.api_end_point + Constants.salon + salonId + Constants.appointment + Constants.serviceList;
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
}