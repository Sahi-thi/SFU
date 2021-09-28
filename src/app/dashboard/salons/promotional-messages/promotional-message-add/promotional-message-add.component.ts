import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServiceResponse } from 'src/utils/enums';
import { PromotionalMessageDetails } from '../promotional-message.model';
import { PromotionalMessageService } from '../promotional-message.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-promotional-message-add',
    templateUrl: './promotional-message-add.component.html',
    styleUrls: ['./promotional-message-add.component.scss']
})
export class PromotionalMessageAddComponent implements OnInit {
    salonId: number;
    promotionalMessageFormGroup: FormGroup;
    requestObject: PromotionalMessageDetails;
    responseMessage: string
    isLoadingAPI
    isCallingQuote

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private promotionalMessageService: PromotionalMessageService,
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id']
            }
        });
        this.addMessageData();
    }
    addMessageData() {
        this.promotionalMessageFormGroup = new FormGroup({
            title: new FormControl('', [Validators.required]),
            message: new FormControl('', [Validators.required]),
        });
    }
    async submitPromotionalMessageForm() {
        if (this.promotionalMessageFormGroup.valid) {
            await this.requestDetails();
            this.callCreatePromotionalMessage();
        }
    }
    async requestDetails() {
        this.requestObject = {
            ...this.promotionalMessageFormGroup.value,
        }
        this.requestObject.sent_time = Math.floor((new Date()).getTime() / 1000)
    }
    onClickGoBack() {
        this.location.back();
    }
    callCreatePromotionalMessage() {
        this.isCallingQuote = true;
        this.promotionalMessageService.createMessageService(this.salonId, this.requestObject, (status, response) => {
            this.isCallingQuote = false;
            if (status === ServiceResponse.success) {
                this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }
}
