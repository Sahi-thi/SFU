import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { FormsDetails } from '../client.model';
import { ClientService } from '../client.service';

@Component({
    selector: 'app-clients-forms-list',
    templateUrl: './clients-forms-list.component.html',
    styleUrls: ['./clients-forms-list.component.scss']
})
export class ClientsFormsListComponent implements OnInit {

    salonId = null;
    clientId = null;
    isEmptyFormList = false;
    isFormsListLoader = false;
    formList: FormsDetails;
    isPdfView = false;
    pdfUrl = '';
    fileName = '';
    appointmentId = null;
    constructor(
        private titleService: Title,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private clientService: ClientService
    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + Constants.signedForms);
        this.activatedRoute.params.subscribe((params) => {
            this.clientId = params['client_id'];
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id');
            }
        });
        if (this.clientId) {

            this.getFormListApi();
        }
    }

    getFormListApi() {
        this.isFormsListLoader = true;
        this.clientService.clientFormsListService(this.clientId, (status, response) => {
            this.isFormsListLoader = false;
            if (status === ServiceResponse.success) {
                this.formList = response.forms;
            } else if (status === ServiceResponse.emptyList) {
                this.isEmptyFormList = true;
            }
        })
    }

    showPdfView(file) {
        if (file) {
            this.isPdfView = !this.isPdfView;
            this.pdfUrl = file.pdf_url;
            this.fileName = file.form_name;
            this.appointmentId = file.appointment_id;
        }
    }

    closeForm() {
        this.isPdfView = !this.isPdfView;
    }

}
