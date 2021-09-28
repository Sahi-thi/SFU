import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { DefaultResponse, GetRewardDetailsResponse, RewardDetails, RewardResponse } from './reward.model';
@Injectable({
  providedIn: 'root'
})
export class RewardService {
  public rewardResponse: RewardResponse;
  public rewardFilterDetails: BehaviorSubject<any> = new BehaviorSubject(null);
  public rewardDetailsResponse: GetRewardDetailsResponse;

  public defaultResponse: DefaultResponse;
  public listCurrentPage = -1
  constructor(protected httpClient: HttpClient,) { }


  createRewardService(salonID: number, request: RewardDetails, callback) {
    const url = environment.api_end_point + Constants.salon + salonID + Constants.createReward;

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
  RewardListService(salonId: number,  search: string, page: number,offset: number,startDate:string,endDate:string,statusType:string, callback) {

    const searchString = search !== undefined && search !== "" ? '&search=' + search : "";
    const stDate = startDate !== "" && startDate !== undefined ? '&start_date=' + startDate : "";
    const edDate = endDate !== "" && endDate !== undefined ? '&end_date=' + endDate : "";
    const status = statusType !== "" && statusType !== undefined ? '&status=' + statusType : "";

    const url = environment.api_end_point + Constants.salon + salonId + Constants.rewardList + '?' + searchString + '&page=' + page + '&page_size=' + offset
      +stDate + edDate +status;

    this.httpClient.get(url).subscribe(data => {
      const response = data as RewardResponse;
      this.rewardResponse = response;

      if (response.statusCode === 200) {
        callback(ServiceResponse.success, this.rewardResponse);
      } else if (response.statusCode === 204) {
        callback(ServiceResponse.emptyList, this.rewardResponse);
      }
      else {
        callback(ServiceResponse.error, this.rewardResponse.message);
      }
    });
  }

  getRewardDetailsService(salonId: number, rewardId: number, callback) {

      const url = environment.api_end_point + Constants.salon + salonId + '/reward/' + rewardId;

      this.httpClient.get(url).subscribe(data => {
          const response = data as GetRewardDetailsResponse;
          this.rewardDetailsResponse = response;

          if (response.statusCode === 200) {
              callback(ServiceResponse.success, this.rewardDetailsResponse);
          } else if (response.statusCode === 204) {
              callback(ServiceResponse.emptyList, this.rewardDetailsResponse);
          }
          else {
              callback(ServiceResponse.error, this.rewardDetailsResponse.message);
          }
      },
          (error: HttpErrorResponse) => {
              callback(ServiceResponse.error, error.error);
          });
  }
  updateRewardService(salonID: number, rewardId: number, request: RewardDetails, callback) {
    const url = environment.api_end_point + Constants.salon + salonID + Constants.reward + '/' + rewardId;

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

}
