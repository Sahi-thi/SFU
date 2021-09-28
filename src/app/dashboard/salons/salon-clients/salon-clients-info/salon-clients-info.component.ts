import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/utils/constants';
import { DashboardService } from '../../../dashboard.service';
import { ServiceResponse } from '../../../../../utils/enums';
import { ClientInfoResponse, ClientInformation, QuestionAnswer, QuestionOptions } from '../../../dashboard.model';
import { PhoneNumberFormatPipe } from '../../../../shared/phonenumber.pipe';
import { NonRecommenedProductsComponent } from '../../../../shared/non-recommened-products/non-recommened-products.component';
import { MatButton, MatDialog } from '@angular/material';

@Component({
    selector: 'app-salon-clients-info',
    templateUrl: './salon-clients-info.component.html',
    styleUrls: ['./salon-clients-info.component.scss']
})
export class SalonClientsInfoComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;
    public clientInfoResponse: ClientInfoResponse;
    public clientInformation: ClientInformation;
    public questionAnswer: QuestionAnswer[];
    public questionOptions: QuestionOptions[];
    clientId: number;
    salonId: number;
    isDetailsLoading: boolean;
    colorStatus: boolean;
    formate: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private dashboardService: DashboardService,
        private titleService: Title,
        public phoneFormate: PhoneNumberFormatPipe,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.formate = this.phoneFormate;
        this.titleService.setTitle(Constants.skinForYou + Constants.clientsInfo);
        this.clientId = +localStorage.getItem('client_id')
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.getClientInfo()
    }

    getClientInfo() {
        this.isDetailsLoading = true;
        this.dashboardService.clientsInfoService(this.salonId, this.clientId, (status, response) => {
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
        // const bodyRect = document.body.getBoundingClientRect();
        // const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        // const right = bodyRect.right - elemRect.right;
        // const top = elemRect.top - bodyRect.top;

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
