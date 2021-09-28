import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ServiceResponse } from '../../../../utils/enums';
import { NotesResponse } from './salon-clients.model';

@Injectable({
    providedIn: "root",
})

export class SalonClientsService {

    notesResponse: NotesResponse;
    public listCurrentPage = -1

    constructor(protected httpClient: HttpClient) { }

    NotesListService(salonId: number, clientId: number, offset: number, page: number, callback) {
        const url = environment.api_end_point + 'clientNotes/' + salonId + '/client/' + clientId + '/list?page_size=' + offset + '&page=' + page;
        this.httpClient.get(url).subscribe(data => {
            const response = data as NotesResponse;
            this.notesResponse = response;
            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.notesResponse);
            } else if (response.statusCode === 204) {
                callback(ServiceResponse.emptyList, this.notesResponse);
            }
            else {
                callback(ServiceResponse.error, this.notesResponse.message);
            }
        });
    }

    AddNoteService(notesRequest, callback) {
        const url = environment.api_end_point + 'clientNotes/createNotes';
        this.httpClient.post(url, notesRequest).subscribe(data => {
            const response = data as NotesResponse;
            this.notesResponse = response;
            if (response.statusCode === 201) {
                callback(ServiceResponse.success, this.notesResponse);
            } else {
                callback(ServiceResponse.error, this.notesResponse.message);
            }
        });
    }
    UpdateNoteService(notesRequest, salonId: number, clientId: number, noteId: number, callback) {
        const url = environment.api_end_point + 'clientNotes/' + salonId + '/client/' + clientId + '/' + noteId;
        this.httpClient.put(url, notesRequest).subscribe(data => {
            const response = data as NotesResponse;
            this.notesResponse = response;
            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.notesResponse);
            } else {
                callback(ServiceResponse.error, this.notesResponse.message);
            }
        });
    }

    GetNoteService(salonId: number, clientId: number, noteId: number, callback) {
        const url = environment.api_end_point + 'clientNotes/' + salonId + '/client/' + clientId + '/note/' + noteId;
        this.httpClient.get(url).subscribe(data => {
            const response = data as NotesResponse;
            this.notesResponse = response;
            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.notesResponse);
            }
            else {
                callback(ServiceResponse.error, this.notesResponse.message);
            }
        });
    }

    DeleteNoteService(salonId: number, clientId: number, noteId: number, callback) {
        const url = environment.api_end_point + 'clientNotes/' + salonId + '/client/' + clientId + '/' + noteId;
        this.httpClient.delete(url).subscribe(data => {
            const response = data as NotesResponse;
            this.notesResponse = response;
            if (response.statusCode === 200) {
                callback(ServiceResponse.success, this.notesResponse);
            }
            else {
                callback(ServiceResponse.error, this.notesResponse.message);
            }
        });
    }

}