import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-clients-dashboard',
  templateUrl: './clients-dashboard.component.html',
  styleUrls: ['./clients-dashboard.component.scss']
})
export class ClientsDashboardComponent implements OnInit {

  public clientId: number;
  public salonId: number;
  public clientName: string;
  public requestObject
  constructor(
      private activatedRoute: ActivatedRoute,
      public clientService:ClientService
  ) { }

  ngOnInit() {
      this.clientId = + localStorage.getItem("client_id");
      this.salonId = + localStorage.getItem("salon_id");
      this.clientName = localStorage.getItem("client_name");
      this.clientService.clientFilterDetails.subscribe((details) => {
          if (details) {
              this.requestObject = details;
          }
      })
  }
  backToClients() {
      this.clientService.clientFilterDetails.next(this.requestObject)
  }
}
