import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { UnLinkedClientInfoResponse, UnlinkedClientsResponse } from './unlinked-clients.model';

@Injectable({
    providedIn: 'root'
})
export class UnlinkedClientService {
    public listCurrentPage = -1
    public unlinkedClientsResponse: UnlinkedClientsResponse;
    public unLinkedClientsResponse: UnLinkedClientInfoResponse;


    constructor(protected httpClient: HttpClient,) { }

    unLinkedClientList(offset: number, page: number, search: string, status: string, callback) {
        const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
        const selectedStatus = !status !== undefined && status !== "" ? '&status=' + status : "";

        const url = environment.api_end_point + Constants.unLinkedClientsList + '?page=' + page + '&page_size=' + offset + searchString
            + selectedStatus;

        this.httpClient.get(url).subscribe(data => {
            const response = data as UnlinkedClientsResponse;
            this.unlinkedClientsResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.unlinkedClientsResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.unlinkedClientsResponse);
            }
            else {
                callback(ServiceResponse.error, this.unlinkedClientsResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }
    unLinkedClientsInfoService(salonId: number, clientId: number, callback) {
        const url = environment.api_end_point + Constants.unLinkedClientInfo + clientId + Constants.info

        this.httpClient.get(url).subscribe(data => {
            const response = data as UnLinkedClientInfoResponse;
            this.unLinkedClientsResponse = response;

            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.unLinkedClientsResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.unLinkedClientsResponse);
            }
            else {
                callback(ServiceResponse.error, this.unLinkedClientsResponse.message);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }
}
