import { DecimalPipe, formatDate, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Status } from 'src/app/dashboard/dashboard.model';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { RewardServiceProductDialogComponent } from '../reward-service-product-dialog/reward-service-product-dialog.component';
import { GetRewardDetails, GetRewardDetailsResponse, RewardDetails } from '../reward.model';
import { RewardService } from '../reward.service';

interface Reward {
    id: string;
    value: string;
}

@Component({
    selector: 'app-reward-create',
    templateUrl: './reward-create.component.html',
    styleUrls: ['./reward-create.component.scss']
})
export class RewardCreateComponent implements OnInit {
    isSalonAPI: boolean;
    public rewardFormGroup: FormGroup;
    salonId: number;
    rewardType: string;
    rewardSelected: string = ''
    currentDate;
    minDate;
    statuses: Status[] = Constants.Statuses;
    requestObject: RewardDetails;
    rewardDetailResponse: GetRewardDetailsResponse;
    rewardDetails: GetRewardDetails

    buttonTitle = "ADD";
    rewardTitle = 'Add Reward'
    selectedID: any;
    product_ids: Array<any> = [];
    service_ids: Array<any> = [];
    rewardId: number;
    isFromDetails = false;
    public isLoadingAPI: boolean;
    isCallingReward: boolean;
    responseMessage;

    rewards: Reward[] = [
        { id: 'Service', value: 'Services' },
        { id: 'Product', value: 'Products' }
    ];

    constructor(
        private location: Location,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private decimalPipe: DecimalPipe,
        private rewardService: RewardService,
        public titleService: Title

    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
                this.rewardId = params['reward_id']
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        if (this.rewardId) {

            this.buttonTitle = localStorage.getItem('buttonTitle');
            this.rewardTitle = localStorage.getItem('rewardTitle');
            this.isFromDetails = JSON.parse(localStorage.getItem('isFromDetails'));
            this.callRewardDetail();

        } else this.titleService.setTitle(Constants.skinForYou + 'Add Reward');
        this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-us')
        this.addRewardData();
    }

    cancelRewardForm(buttonTitle: string) {
        this.responseMessage = '';

        this.titleService.setTitle(Constants.skinForYou + 'Reward-Details');
        if (buttonTitle === 'SAVE' && this.isFromDetails) {
            this.disableEditMode();
            const reward = this.rewardDetails;
            this.rewardSelected = (reward.services.length > 0) ? reward.services[0].service :
                (reward.products.length > 0) ? reward.products[0].product_name : '';

            this.rewardFormGroup.setValue({
                title: reward.title,
                start_date: reward.start_date,
                end_date: reward.end_date,
                percentage: this.decimalPipe.transform(reward.percentage, '1.0-0'),
                status: reward.status,
                reward_for: reward.reward_for,
                select_reward: this.rewardSelected
            });
            this.rewardType = reward.reward_for
            this.minDate = reward.start_date

        } else {
            this.location.back()
        }
    }

    onDateSlect(date) {
        this.minDate = formatDate(date, 'yyyy-MM-dd', 'en-us')
    }
    onClickGoBack() {
        this.location.back();
    }
    addRewardData() {
        this.rewardFormGroup = new FormGroup({
            title: new FormControl('', [Validators.required]),
            start_date: new FormControl('', [Validators.required]),
            end_date: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
            reward_for: new FormControl('', [Validators.required]),
            select_reward: new FormControl(''),
            // required_points: new FormControl('', [Validators.required, Validators.min(0),]),
            percentage: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.max(100), Validators.min(1), Validators.maxLength(3)]),
        });
        this.rewardFormGroup.get('select_reward').disable();

    }
    onSelectionRewardChange(e) {
        this.rewardSelected = ''
        this.rewardFormGroup.controls['select_reward'].setValue('');
        this.rewardType = e.value
        this.rewardFormGroup.get('select_reward').enable();
    }
    openDialog(type) {
        let dialogref = this.dialog.open(RewardServiceProductDialogComponent, {
            width: "640px",
            panelClass: ['serviceProduct-dialog', 'card-shadow'],
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                type: this.rewardType,
                salonId: this.salonId,
                rewardSelected: this.rewardSelected

            },
        });
        dialogref.afterClosed().subscribe((response) => {
            console.log({ response });

            if (response !== undefined) {
                this.rewardSelected = response.name;
                this.selectedID = response;
            }
        });
    }

    validate(evt) {
        if ((evt.keyCode > 47 && evt.keyCode < 58) || (evt.keyCode > 36 && evt.keyCode < 41) || evt.keyCode == 8 || evt.keyCode == 190) return true;
        else return false;
    }

    callRewardDetail() {
        this.isLoadingAPI = true;
        this.rewardService.getRewardDetailsService(this.salonId, this.rewardId, (status, response) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.rewardDetailResponse = response;
                this.rewardDetails = this.rewardDetailResponse.reward;
                this.setRewardData();
            } else {
                this.isLoadingAPI = false;
                this.responseMessage = response.message;
            }
        });
    }
    setRewardData() {
        if (this.buttonTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Reward-Details');
            this.rewardFormGroup.disable()

        } else {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Reward');
            this.rewardFormGroup.enable()
        }
        const reward = this.rewardDetails;
        this.rewardFormGroup.setValue({
            title: reward.title,
            start_date: reward.start_date,
            end_date: reward.end_date,
            // required_points: reward.required_point,
            percentage: this.decimalPipe.transform(reward.percentage, '1.0-0'),
            status: reward.status,
            reward_for: reward.reward_for,
            select_reward: ''
        });
        this.rewardType = reward.reward_for
        this.minDate = reward.start_date

        this.rewardSelected = (reward.services.length > 0) ? reward.services[0].service :
            (reward.products.length > 0) ? reward.products[0].product_name : '';

    }
    async submitRewardForm(buttonTitle: string) {
        if (buttonTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Reward');
            this.enableEditMode();
        } else {
            if (this.rewardFormGroup.valid) {
                await this.requestDetails();
                this.buttonTitle === 'ADD' ? this.callCreateReward() : this.callEditReward();
            }
        }
    }
    async requestDetails() {
        this.requestObject = {
            ...this.rewardFormGroup.value,
        }

        const request = this.requestObject
        for (let item in request) {
            if (request[item] === "" || request[item] === null || request[item] === undefined) {
                delete request[item];
            }
        }

        let obj: any = {};
        if (this.buttonTitle === "ADD") {
            obj.percentage = Number(this.decimalPipe.transform(this.requestObject.percentage, '1.2-2'));
        }
        if (this.buttonTitle === "SAVE") {
            obj.percentage = this.decimalPipe.transform(this.requestObject.percentage, '1.2-2');

        }

        obj.title = this.requestObject.title;
        obj.start_date = formatDate(this.requestObject.start_date, 'yyyy-MM-dd', 'en-us');
        obj.end_date = formatDate(this.requestObject.end_date, 'yyyy-MM-dd', 'en-us');
        obj.status = this.requestObject.status;
        obj.reward_for = this.requestObject.reward_for;
        obj.status = this.requestObject.status;
        obj.required_points = 0;
        // obj.required_points = this.requestObject.required_points;
        this.service_ids = [];
        this.product_ids = [];

        if (this.rewardDetails !== undefined && this.buttonTitle === "SAVE") {
            if (this.rewardDetails.services.length > 0) {
                this.service_ids.push(this.rewardDetails.services[0].service_id);
                obj.service_ids = this.service_ids;
                obj.product_ids = [];
            }
        }
        if (this.rewardDetails !== undefined && this.buttonTitle === "SAVE") {
            if (this.rewardDetails.products.length > 0) {
                this.product_ids.push(this.rewardDetails.products[0].id);
                obj.product_ids = this.product_ids
                obj.service_ids = [];
            }
        }

        if (this.selectedID !== undefined && this.selectedID.type === 'Product') {
            this.product_ids = [];
            this.product_ids.push(this.selectedID.id)
            obj.product_ids = this.product_ids;
            obj.service_ids = [];
        }
        if (this.selectedID !== undefined && this.selectedID.type === 'Service') {
            this.service_ids = [];
            this.service_ids.push(this.selectedID.id);
            obj.service_ids = this.service_ids;
            obj.product_ids = [];
        }
        this.requestObject = obj;
        console.log({ obj });

    }
    callEditReward() {
        this.isCallingReward = true;
        this.rewardService.updateRewardService(this.salonId, this.rewardId, this.requestObject, (status, response) => {
            this.isCallingReward = false;
            if (status === ServiceResponse.success) {
                this.buttonTitle === 'SAVE' && this.isFromDetails ? this.disableEditMode() : this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }
    disableEditMode() {
        this.buttonTitle = "EDIT";
        this.rewardTitle = localStorage.getItem('rewardTitle');;
        this.rewardFormGroup.disable();
    }
    enableEditMode() {
        this.buttonTitle = "SAVE";
        this.rewardTitle = "Edit";
        this.rewardFormGroup.enable();
    }
    callCreateReward() {
        this.isCallingReward = true;
        this.rewardService.createRewardService(this.salonId, this.requestObject, (status, response) => {
            this.isCallingReward = false;
            if (status === ServiceResponse.success) {
                this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }
    // changePercentPost() {
    //     let perc = document.getElementById("percent-value").parentElement;
    //     perc.style.left = '43px';
    // }

}
