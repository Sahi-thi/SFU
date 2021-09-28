import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NonRecommenedProductsComponent } from 'src/app/shared/non-recommened-products/non-recommened-products.component';
import { PhoneNumberFormatPipe } from 'src/app/shared/phonenumber.pipe';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { ClientInfoResponse, ClientInformation, QuestionAnswer, QuestionOptions } from '../client.model';
import { ClientService } from '../client.service';

@Component({
    selector: 'app-clients-info',
    templateUrl: './clients-info.component.html',
    styleUrls: ['./clients-info.component.scss']
})
export class ClientsInfoComponent implements OnInit {
    @ViewChild(MatButton, { static: false }) button: MatButton;

    public clientInfoResponse: ClientInfoResponse;
    public clientInformation: ClientInformation;
    public questionAnswer: QuestionAnswer[];
    public questionOptions: QuestionOptions[];
    clientId: number;
    isDetailsLoading: boolean;
    colorStatus: boolean;
    formate: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private clientService: ClientService,
        private titleService: Title,
        public phoneFormate: PhoneNumberFormatPipe,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.formate = this.phoneFormate;
        this.activatedRoute.params.subscribe((params) => {
            this.clientId = params['client_id'];
        });
        this.titleService.setTitle(Constants.skinForYou + Constants.clientsInfo);
        this.getClientInfo()
    }

    getClientInfo() {
        this.isDetailsLoading = true;
        this.clientService.clientsInfoService(this.clientId, (status, response) => {
            this.isDetailsLoading = false;
            if (status === ServiceResponse.success) {
                this.clientInfoResponse = response;
                this.clientInformation = this.clientInfoResponse.information;
                this.colorStatus = this.clientInformation.status === 'Active' ? true : false
                this.questionAnswer = this.clientInfoResponse.information.question_answer;
            }
        })
    }

    navigateToNotToUseProduct(product) {

        console.log("product", product);
        this.dialog.open(NonRecommenedProductsComponent, {
            width: "636px",
            // position: { right: right + 'px', top: top + 'px' },
            panelClass: "filter-client-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                product: product
            },
        });
    }

}
