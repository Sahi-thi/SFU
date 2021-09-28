import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { DailyWordsDetails, DailyWordsDetailsResponse, DailyWordsResponse, DefaultResponse, uploadQuotes } from './daily-words.model';

@Injectable({
  providedIn: 'root'
})
export class DailyWordsService {
  public dailyWordsService: DailyWordsResponse;
  defaultResponse: DefaultResponse;
  quoteDetailsResponse: DailyWordsDetailsResponse;
  constructor(private httpClient: HttpClient) { }


  getDailyWordsWisdomList(offset: number, page: number, callback) {

    const url = environment.api_end_point + Constants.dailyWordsWisdomList + '?page=' + offset + '&page_size=' + page;


    this.httpClient.get(url).subscribe(data => {
      const response = data as DailyWordsResponse;
      this.dailyWordsService = response;

      if (this.dailyWordsService.statusCode === 200) {
        callback(ServiceResponse.success, this.dailyWordsService);
      } else if (this.dailyWordsService.statusCode === 204) {
        callback(ServiceResponse.emptyList, this.dailyWordsService);
      } else {
        callback(ServiceResponse.error, this.dailyWordsService);
      }
    },
      (error: HttpErrorResponse) => {
        callback(ServiceResponse.error, error.error);
      });


  }

  createQuoteService(request: DailyWordsDetails, callback) {
    const url = environment.api_end_point + Constants.createQuote;

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
  updateQuoteService(quoteId: number, request: DailyWordsDetails, callback) {
    const url = environment.api_end_point + Constants.editQuote + quoteId;

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
  getQuoteDetailsService(quoteId: number, callback) {

    const url = environment.api_end_point + Constants.quoteDetailsById + quoteId;

    this.httpClient.get(url).subscribe(data => {
      const response = data as DailyWordsDetailsResponse;
      this.quoteDetailsResponse = response;

      if (response.statusCode === 200) {
        callback(ServiceResponse.success, this.quoteDetailsResponse);
      } else if (response.statusCode === 204) {
        callback(ServiceResponse.emptyList, this.quoteDetailsResponse);
      }
      else { }
    },
      (error: HttpErrorResponse) => {
        callback(ServiceResponse.error, error.error);
      });
  }
  uploadQuoteService(request: Array<any>, callback) {
    const url = environment.api_end_point + Constants.createQuote + '/bulkUpload';

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
