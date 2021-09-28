import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { DefaultResponse, PromotionalMessageDetails, PromotionalMessageResponse } from './promotional-message.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionalMessageService {

  public promotionalMessageService: PromotionalMessageResponse;
  defaultResponse: DefaultResponse;
  constructor(private httpClient: HttpClient) { }

  getPromotionalMessagesList(salonId:number,offset: number, page: number, callback) {

    const url = environment.api_end_point + Constants.salon + salonId+ Constants.promotionalMessageList + '?page=' + offset + '&page_size=' + page;

    this.httpClient.get(url).subscribe(data => {
      const response = data as PromotionalMessageResponse;
      this.promotionalMessageService = response;

      if (this.promotionalMessageService.statusCode === 200) {
        callback(ServiceResponse.success, this.promotionalMessageService);
      } else if (this.promotionalMessageService.statusCode === 204) {
        callback(ServiceResponse.emptyList, this.promotionalMessageService);
      } else {
        callback(ServiceResponse.error, this.promotionalMessageService);
      }
    },
      (error: HttpErrorResponse) => {
        callback(ServiceResponse.error, error.error);
      });


  }
  createMessageService(salonId:number,request: PromotionalMessageDetails, callback) {
    const url = environment.api_end_point +Constants.salon + salonId  +'/notification';

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

}
