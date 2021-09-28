import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
    
    import {RitualOverViewRequest,RitualOVerViewResponse, ClientInfoResponse, ClientsResponse, DefaultResponse, RoutineDetailsRequest, ServiceDropdownResponse } from './client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public clientFilterDetails: BehaviorSubject<any> = new BehaviorSubject(null);
  public listCurrentPage = -1
  public clientInfoResponse: ClientInfoResponse;
  public ServiceDropdownResponse: ServiceDropdownResponse;
  public defaultResponse: DefaultResponse;
  public ritualOVerViewResponse: RitualOVerViewResponse;

  public clientsResponse: ClientsResponse;

  constructor(protected httpClient: HttpClient, private route: Router) { }

  clientsListService(offset: number, page: number, search: string, status: string, callback) {
    const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
    const selectedStatus = !status !== undefined && status !== "" ? '&status=' + status : "";

        const url = environment.api_end_point + 'client/list'  +  '?page_size=' + offset + '&page=' + page
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

clientsInfoService( clientId: number, callback) {
  const url = environment.api_end_point +'client/' + clientId + Constants.info

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


routineOverviewService(clientId: number, request: RitualOverViewRequest, callback) {
  const url = environment.api_end_point  + 'client/' + clientId + Constants.clientRoutine;

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

routineDetailService(clientId: number, request: RoutineDetailsRequest, callback) {
  const url = environment.api_end_point + 'client/' + clientId + Constants.clientRoutineDetails;

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


clientFormsListService(clientId: number, callback) {

    const url = environment.api_end_point  + 'client/' + clientId + '/form/list';

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

clientsalonsLinkedService(clientId: number,  page: number,offset: number,callback) {

    const url = environment.api_end_point  + 'client/' + clientId + '/salon/list'  + '?page=' + page +    '&page_size=' + offset;

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

updateClientStatusService(request, clientId: number, callback) {

    const url = environment.api_end_point  + 'client/' + clientId;

    this.httpClient.put(url, request).subscribe((data: ClientsResponse) => {
        const response = data as ClientsResponse;
        this.clientsResponse = response;
        if (this.clientsResponse.statusCode === 200) {
            callback(ServiceResponse.success, this.clientsResponse);
        } else {
            callback(ServiceResponse.error, this.clientsResponse);
        }
    },
        (error: HttpErrorResponse) => {
            callback(ServiceResponse.error, error.error);
        });
}
}
