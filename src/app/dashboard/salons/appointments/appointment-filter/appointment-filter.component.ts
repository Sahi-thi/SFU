import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { appointmentStatus, Services } from '../appointment.model';
import { AppointmentService } from '../appointment.service';

@Component({
    selector: 'app-appointment-filter',
    templateUrl: './appointment-filter.component.html',
    styleUrls: ['./appointment-filter.component.scss']
})
export class AppointmentFilterComponent implements OnInit {

    isApiLoading: boolean;
    isServiceListEmpty: boolean;
    salonId: number;
    currentPage: number = 1;
    offset = 10;
    searchString: string = "";
    type = "";
    price = "";
    services: Services[];
    service: number;
    status: string
    appointmentStatus: appointmentStatus[] = Constants.appointmentStatus;
    clickedDate;
    serviceId: number

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<AppointmentFilterComponent>,
        public appointmentService: AppointmentService,

    ) { }

    ngOnInit() {
        this.salonId = this.data.salonId;
        this.service = this.data.service;
        this.status = this.data.status
        this.getServiceListData();
    }

    getServiceListData() {
        this.isApiLoading = true;
        this.appointmentService.salonServicesAPI(this.salonId, this.offset, this.currentPage, this.searchString, this.type, this.price, (status, response) => {
            this.isApiLoading = false;
            if (status === ServiceResponse.success) {
                this.services = response.services;
            } else if (status === ServiceResponse.emptyList) {
                this.isServiceListEmpty = true
            }
        });
    }

    getCalendarListData() {
        this.isApiLoading = true;
        this.appointmentService.calendarListService(this.salonId, this.clickedDate, this.serviceId, this.status, (status, response) => {
            this.isApiLoading = false;
            if (status === ServiceResponse.success) {
                this.services = response.services;
            } else if (status === ServiceResponse.emptyList) { }
        });
    }

    removeFilterData() {
        this.dialogRef.close(
            {
                service: null,
                status: null
            }
        )
    }

    applyFilter() {
        this.dialogRef.close(
            {
                service: this.service,
                status: this.status,
            }
        )
    }
}
