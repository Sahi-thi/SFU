import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
    selector: 'app-details-dashboard',
    templateUrl: './details-dashboard.component.html',
    styleUrls: ['./details-dashboard.component.scss']
})
export class DetailsDashboardComponent implements OnInit {
    public clientId: number;
    public salonId: number;
    public clientName: string;
    public requestObject
    constructor(
        private activatedRoute: ActivatedRoute,
        public location: Location,
        public dashboardService:DashboardService
    ) { }

    ngOnInit() {
        this.clientId = + localStorage.getItem("client_id");
        this.salonId = + localStorage.getItem("salon_id");
        this.clientName = localStorage.getItem("client_name");
        this.dashboardService.clientFilterDetails.subscribe((details) => {
            if (details) {
                this.requestObject = details;
            }
        })
    }
    backToClients() {
        this.dashboardService.clientFilterDetails.next(this.requestObject)
    }
}
