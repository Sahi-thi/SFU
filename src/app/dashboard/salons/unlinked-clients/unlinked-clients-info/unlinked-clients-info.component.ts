import { Component, OnInit } from '@angular/core';
import { ClientInfoResponse, ClientInformation, QuestionAnswer, QuestionOptions } from 'src/app/dashboard/clients/client.model';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/utils/constants';
import { DashboardService } from '../../../dashboard.service';
import { ServiceResponse } from '../../../../../utils/enums';
import { PhoneNumberFormatPipe } from '../../../../shared/phonenumber.pipe';
import { UnlinkedClientService } from '../unlinked-client.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unlinked-clients-info',
  templateUrl: './unlinked-clients-info.component.html',
  styleUrls: ['./unlinked-clients-info.component.scss']
})
export class UnlinkedClientsInfoComponent implements OnInit {

  public clientInfoResponse: ClientInfoResponse;
  public clientInformation: ClientInformation;
  public questionAnswer: QuestionAnswer[];
  public questionOptions: QuestionOptions[];
  clientId: number;
  salonId: number;
  isDetailsLoading: boolean;
  colorStatus: boolean;
  formate:any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private unLinkedClientService: UnlinkedClientService,
      private titleService: Title,
      public phoneFormate: PhoneNumberFormatPipe,
      public location:Location
  ) { }

  ngOnInit() {
      this.formate = this.phoneFormate;
      this.titleService.setTitle(Constants.skinForYou + Constants.clientsInfo);
      this.activatedRoute.params.subscribe((params) => {
          if (params['salon_id'] != undefined) {
              this.salonId = params['salon_id'];
              this.clientId =params['client_id']
          } else {
              this.salonId = +localStorage.getItem('salon_id')
          }
      });
      this.getClientInfo()
  }
  onClickGoBack(){
      this.location.back();
  }
  getClientInfo() {
      this.isDetailsLoading = true;
      this.unLinkedClientService.unLinkedClientsInfoService(this.salonId, this.clientId, (status, response) => {
          this.isDetailsLoading = false;
          if (status === ServiceResponse.success) {
              this.clientInfoResponse = response;
              this.clientInformation = this.clientInfoResponse.information;
              this.colorStatus = this.clientInformation.status === 'Active' ? true : false
              this.questionAnswer = this.clientInfoResponse.information.question_answer;
          }
      })
  }

}
