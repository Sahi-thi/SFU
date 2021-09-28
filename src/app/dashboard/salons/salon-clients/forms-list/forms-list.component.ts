import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/utils/constants';
import { DashboardService } from '../../../dashboard.service';
import { FormViewDialogComponent } from '../form-view-dialog/form-view-dialog.component';
import { ServiceResponse } from '../../../../../utils/enums';
import { FormsDetails } from '../../../dashboard.model';

@Component({
    selector: 'app-forms-list',
    templateUrl: './forms-list.component.html',
    styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit {

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
        private dashboardService: DashboardService
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
        if (this.salonId && this.clientId) {
            this.getFormListApi();
        }
    }

    getFormListApi() {
        this.isFormsListLoader = true;
        this.dashboardService.clientFormsListService(this.salonId, this.clientId, (status, response) => {
            this.isFormsListLoader = false;
            if (status === ServiceResponse.success) {
                this.formList = response.forms;
            } else if (status === ServiceResponse.emptyList) {
                this.isEmptyFormList = true;
            }
        })
    }

    openPdf(src) {
        this.dialog.open(FormViewDialogComponent, {
            width: "1250px",
            panelClass: ['formList-dialog', 'card-shadow'],
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                src: src,
            },
        });
    }
    showPdfView(file) {
        if (file) {
            this.isPdfView = !this.isPdfView;
            this.pdfUrl = file.pdf_url;
            this.fileName = file.form_name;
            this.appointmentId = file.appointment_id
        }
    }
    closeForm() {
        this.isPdfView = !this.isPdfView;
    }
}
