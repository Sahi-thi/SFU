import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from '../../../../../utils/enums';
import { MoreRitualInfo, RitualDetails, RitualDetailsResponse, RitualOverViewRequest, RitualOVerViewResponse, RitualProducts, RitualsDetails, RoutineDetailsRequest, SelfieUrls } from '../../../dashboard.model';
import { DashboardService } from '../../../dashboard.service';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-routine',
    templateUrl: './routine.component.html',
    styleUrls: ['./routine.component.scss'],
})
export class RoutineComponent implements OnInit {

    overViewRequest: RitualOverViewRequest;
    routineDetailsRequest: RoutineDetailsRequest;
    ritualOVerViewResponse: RitualOVerViewResponse;
    ritualDetailsResponse: RitualDetailsResponse;
    ritualDetails: RitualDetails;
    ritualProducts: RitualProducts[];
    moreRitualInfo: MoreRitualInfo[];
    selfieUrls: SelfieUrls[];
    rituals: RitualsDetails[];
    isSelfies: boolean;
    isProducts: boolean;
    isRitualInfo: boolean;
    panelOpenState = false;
    isOverViewCalling: boolean;
    isRitualDataLoading: boolean;
    responseMessage: string;
    clientId: number;
    salonId: number;
    clientJoiningDate = new Date();
    maxDate;
    updatedDate;
    date = new FormControl(moment());
    constructor(
        private titleService: Title,
        private activatedRoute: ActivatedRoute,
        private dashboardService: DashboardService
    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + Constants.routine);
        this.activatedRoute.params.subscribe((params) => {
            this.clientId = params['client_id'];
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id');
            }
        });
        this.clientJoiningDate = new Date(localStorage.getItem('date'));
        this.clientJoiningDate.setMinutes(this.clientJoiningDate.getMinutes() + this.clientJoiningDate.getTimezoneOffset());
        this.maxDateValue();
        this.salonId && this.clientId && this.getRitualOverView();
        console.log("callRitualDetail");

    }

    updateDate(e) {

        var date = new Date(e),
            month = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        this.updatedDate = [date.getFullYear(), month, day].join("-");

        this.getRitualOverView();

    }

    maxDateValue() {
        let localDate = new Date();
        this.maxDate = localDate;
        this.maxDate.setMinutes(this.maxDate.getMinutes());
        this.updatedDate = this.maxDate;
    }

    getRitualOverView() {
        this.isOverViewCalling = true;
        console.log(this.updatedDate);

        this.overViewRequest = {
            date: formatDate(this.updatedDate, 'yyyy-MM-dd', 'en-us')

        }
        this.dashboardService.routineOverviewService(this.salonId, this.clientId, this.overViewRequest, (status, response) => {
            this.isOverViewCalling = false;
            if (status === ServiceResponse.success) {
                this.ritualOVerViewResponse = response;
                this.rituals = this.ritualOVerViewResponse.data.rituals;
            } else {
                this.responseMessage = response.message;
            }
        });
    }

    callRitualDetail(type) {
        this.isRitualDataLoading = true;
        console.log(this.updatedDate);
        this.routineDetailsRequest = {
            date: formatDate(this.updatedDate, 'yyyy-MM-dd', 'en-us'),
            ritual_type: type
        }

        this.dashboardService.routineDetailService(this.salonId, this.clientId, this.routineDetailsRequest, (status, response) => {
            this.isRitualDataLoading = false;

            if (status === ServiceResponse.success) {
                this.ritualDetailsResponse = response;
                this.ritualDetails = this.ritualDetailsResponse.data;
                this.ritualProducts = this.ritualDetails.ritual_products;
                this.selfieUrls = this.ritualDetails.selfie_urls;
                this.moreRitualInfo = this.ritualDetails.more_ritual_info;
                this.isSelfies = this.selfieUrls.length !== 0 ? true : false;
                this.isProducts = this.ritualProducts.length !== 0 ? true : false;
                this.isRitualInfo = this.moreRitualInfo.length !== 0 ? true : false;

            } else {
                this.responseMessage = response.message;
            }
        })

    }

}
