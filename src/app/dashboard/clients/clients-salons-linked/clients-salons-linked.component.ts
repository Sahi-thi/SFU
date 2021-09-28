import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { MetaData, SalonLinkedDetail } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-clients-salons-linked',
  templateUrl: './clients-salons-linked.component.html',
  styleUrls: ['./clients-salons-linked.component.scss']
})
export class ClientsSalonsLinkedComponent implements OnInit {
  clientId: number;
  isSalonLinkedLoader: boolean;
  salonsLinkedList: SalonLinkedDetail;
  isEmptySalonsLinkedList: boolean;
  colorStatus: boolean;
  currentPage: number = 1;
  offset: number = 10;
  metaData: MetaData;

  constructor(private titleService: Title,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit() {

    this.titleService.setTitle(Constants.skinForYou + 'Salons-Linked');
    this.activatedRoute.params.subscribe((params) => {
      this.clientId = params['client_id'];
    });
    if (this.clientId) {
      this.getFormListApi();
    }
  }
  
  getFormListApi() {
    this.isSalonLinkedLoader = true;
    this.clientService.clientsalonsLinkedService(this.clientId, this.currentPage, this.offset, (status, response) => {
      this.isSalonLinkedLoader = false;
      if (status === ServiceResponse.success) {
        this.salonsLinkedList = response.salons;
        this.metaData = response.meta_data
      } else if (status === ServiceResponse.emptyList) {
        this.isEmptySalonsLinkedList = true;
      }
    })
  }

  loadNextData(event) {
    this.currentPage = event.pageIndex + 1;
    this.clientService.clientsalonsLinkedService(
      this.clientId,
      this.currentPage,
      this.offset,
      (status, response) => {
        if (status === ServiceResponse.success) {
          this.salonsLinkedList = response.salons;
          this.metaData = response.meta_data
        } else if (status === ServiceResponse.emptyList) {
          this.isEmptySalonsLinkedList = true;
        }
      }

    );
  }

  onClickSalon(salon) {
    this.onClickNavigationScreen('/home/salons/salon/' + salon.id + "/details");
    localStorage.setItem('salonTitle', salon.name)
  }

  onClickNavigationScreen(URL: string) {
    this.router.navigate([URL], {
      relativeTo: this.activatedRoute,
    })
  }
  
}
