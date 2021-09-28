import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
    selector: 'app-delete-salon',
    templateUrl: './delete-salon.component.html',
    styleUrls: ['./delete-salon.component.scss']
})
export class DeleteSalonComponent implements OnInit {

    isApiLoading: boolean;
    isDeleted: boolean;
    salonId: number;
    listId: number;
    listType: string;
    responseMessage: string;
    brandId: number;

    constructor(
        private dashboardService: DashboardService,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<DeleteSalonComponent>,
    ) { }

    ngOnInit() {
        console.log(this.data);

        this.listId = this.data.listId;
        this.salonId = this.data.salonId;
        this.listType = this.data.listType;
        this.brandId = this.data.brandId;
    }

    deleteListItem() {
        this.isApiLoading = true;

        if (this.listType === 'brand') {
            this.callBrand();
        }
        if (this.listType === 'service') {
            this.callServices()
        }
        if (this.listType === 'product') {
            this.callProduct()
        }
        if (this.listType === 'recommendation') {
            this.callRecommendation()
        }
        if (this.listType === 'reward') {
            this.callReward();
        }
        if (this.listType === 'this Quote') {
            this.callDeleteQuote();
        }

    }

    callServices() {
        this.dashboardService.salonServicesDeleteAPI(this.salonId, this.listId, (status, response) => {
            this.isApiLoading = false;
            if (status === 1) {
                this.isDeleted = true;
            } else {
                this.responseMessage = response
            }
        });
    }

    callBrand() {
        this.dashboardService.BrandDeleteService(this.listId, (status, response) => {
            this.isApiLoading = false;
            if (status === 1) {
                this.isDeleted = true;
            } else {
                this.responseMessage = response
            }
        });
    }
    callProduct() {
        this.dashboardService.deleteProductService(this.brandId, this.listId, (status, response) => {
            this.isApiLoading = false;
            if (status === 1) {
                this.isDeleted = true;
            } else {
                this.responseMessage = response
            }
        });
    }
    callRecommendation() {
        this.dashboardService.deleteRecommendationService(this.salonId, this.listId, (status, response) => {
            this.isApiLoading = false;
            if (status === 1) {
                this.isDeleted = true;
            } else {
                this.responseMessage = response
            }
        });
    }
    callReward() {
        this.dashboardService.deleteRewardservice(this.salonId, this.listId, (status, response) => {
            this.isApiLoading = false;
            if (status === 1) {
                this.isDeleted = true;
            } else {
                this.responseMessage = response
            }
        });

    }
    callDeleteQuote() {
        this.dashboardService.deleteQuoteservice(this.listId, (status, response) => {
            this.isApiLoading = false;
            if (status === 1) {
                this.isDeleted = true;
            } else {
                this.responseMessage = response
            }
        });
    }

}
