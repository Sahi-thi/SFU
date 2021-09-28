import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceResponse } from 'src/utils/enums';
import { StatesResponse, States } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { SalonService } from '../salons/salon.service';

interface Status {
    value: string;
    id: string;
}

@Component({
    selector: 'app-salons-filter',
    templateUrl: './salons-filter.component.html',
    styleUrls: ['./salons-filter.component.scss']
})
export class SalonsFilterComponent implements OnInit {

    statesResponse: StatesResponse;
    states: States[];
    statuses: Status[] = [
        { value: 'Active', id: 'Active' },
        { value: 'Inactive', id: 'Inactive' }
    ];
    selectedStatus = "";
    selectedState = "";

    constructor(
        private dashboardService: DashboardService,
        private salonService: SalonService,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<SalonsFilterComponent>,
    ) { }

    ngOnInit() {
        this.getStates("");
        this.selectedState = this.data.selectedState;
        this.selectedStatus = this.data.selectedStatus;
    }

    onSelectionChanged(e) {
        this.selectedState = e.option.value.trim()
    }

    applyFilter() {
        this.dialogRef.close(
            {
                state: this.selectedState.trim(),
                status: this.selectedStatus,
                searchString: this.data.searchString
            }
        )
    }
    removeFilterData() {
        this.dialogRef.close(
            {
                state: "",
                status: "",
                searchString: this.data.searchString
            }
        )
    }

    getStates(search) {
        this.salonService.satesService(search, (status, response) => {
            if (status === ServiceResponse.success) {
                this.statesResponse = response;
                this.states = this.statesResponse.states;
            }
        })
    }
    searchState(searchState) {
        this.getStates(searchState.trim());
    }

}
