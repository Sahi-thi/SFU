import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ServiceResponse } from 'src/utils/enums';
import { AppointmentService } from '../../appointments/appointment.service';

@Component({
    selector: 'app-reward-service-product-dialog',
    templateUrl: './reward-service-product-dialog.component.html',
    styleUrls: ['./reward-service-product-dialog.component.scss']
})
export class RewardServiceProductDialogComponent implements OnInit {
    isAddType = '';
    salonId: number;
    isApiLoading: boolean;
    isListEmpty: boolean = false;
    servicesList: Array<any>;
    productsList: Array<any>;
    searchString: string = "";
    rewardSelected
    constructor(
        public activatedRoute: ActivatedRoute,
        public appointmentService: AppointmentService,

        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<RewardServiceProductDialogComponent>
    ) { }

    ngOnInit() {
        console.log(this.data);

        if (this.data.rewardSelected !== '') {
            this.rewardSelected = this.data.rewardSelected
        }
        this.salonId = this.data.salonId;
        this.isAddType = this.data.type;
        if (this.data.type === 'Service') this.getServiceListData();
        if (this.data.type === 'Product') this.getProductsListData();
    }

    getServiceListData() {
        this.isApiLoading = true;
        this.appointmentService.salonActiveServicesAPI(this.salonId, this.searchString, (status, response) => {
            this.isApiLoading = false;
            if (status === ServiceResponse.success) {
                this.isListEmpty = false;
                this.servicesList = response.services;
                // this.addCheckedServices();
            } else if (status === ServiceResponse.emptyList) {
                this.isListEmpty = true;
            }

        });

    }

    getProductsListData() {
        this.isApiLoading = true;
        this.appointmentService.appointmentsProductsList(this.salonId, this.searchString, (status, response) => {
            this.isApiLoading = false;

            if (status === ServiceResponse.success) {
                this.productsList = response.product_types;
            } else if (status === ServiceResponse.emptyList) {
                this.isListEmpty = true;
            }

        });

    }

    applyFilter(id, name) {
        this.dialogRef.close(
            {
                id: id,
                name: name,
                type: this.data.type
            });

    }
}
