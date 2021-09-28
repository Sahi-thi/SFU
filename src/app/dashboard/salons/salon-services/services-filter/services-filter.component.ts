import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceDropdownResponse, ServiceTypes } from '../../../dashboard.model';
import { DashboardService } from '../../../dashboard.service';
import { ServiceResponse } from '../../../../../utils/enums';

@Component({
    selector: 'app-services-filter',
    templateUrl: './services-filter.component.html',
    styleUrls: ['./services-filter.component.scss']
})
export class ServicesFilterComponent implements OnInit {

    serviceDropdownResponse: ServiceDropdownResponse;
    serviceTypes: ServiceTypes[];
    isLoadingAPI: boolean;
    type = "";
    price = "";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ServicesFilterComponent>,
        private dashboardService: DashboardService
    ) { }

    ngOnInit() {
        this.getServicesTypes()
        this.price = this.data.price;
        this.type = this.data.type;
    }

    validate(evt) {
        if ((evt.keyCode > 47 && evt.keyCode < 58) || (evt.keyCode > 36 && evt.keyCode < 41) || evt.keyCode == 8) return true;
        else return false;
    }

    applyFilter() {
        this.dialogRef.close(
            {
                type: this.type,
                price: this.price,
                searchString: this.data.searchString
            }
        )
    }
    removeFilterData() {
        this.dialogRef.close(
            {
                price: "",
                type: "",
                searchString: this.data.searchString
            }
        )
    }
    getServicesTypes() {
        this.isLoadingAPI = true;
        this.dashboardService.serviceTypeDropdown((status, response) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.serviceDropdownResponse = response;
                this.serviceTypes = this.serviceDropdownResponse.serviceTypes;
            }
        });
    }
}
