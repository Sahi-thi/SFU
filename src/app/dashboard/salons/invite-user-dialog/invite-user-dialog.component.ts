import { Component, Inject, OnInit } from '@angular/core';
import { SalonService } from '../salon.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServiceResponse } from '../../../../utils/enums';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-invite-user-dialog',
    templateUrl: './invite-user-dialog.component.html',
    styleUrls: ['./invite-user-dialog.component.scss']
})
export class InviteUserDialogComponent implements OnInit {

    inviteFormGroup: FormGroup;
    isApiCalling = false;
    responseMessage = '';
    salonId = null;

    constructor(
        private salonService: SalonService,
        private dialogRef: MatDialogRef<InviteUserDialogComponent>,
        private activatedRoute: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data,
    ) { }

    ngOnInit() {
        this.salonId = this.data.salonId;
        this.addInviteFormData();
    }

    addInviteFormData() {
        const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this.inviteFormGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)]),
        });
    }

    onClickInvite() {
        if (this.inviteFormGroup.valid) {
            this.responseMessage = '';
            this.isApiCalling = true;
            const requestObj = {
                'emails': [this.inviteFormGroup.value.email]
            }
            this.salonService.CreateInviteUserService(this.salonId, requestObj, (status, response) => {

                this.isApiCalling = false;
                if (status === ServiceResponse.success) {
                    this.dialogRef.close('Save')
                } else {
                    this.responseMessage = response.message;
                }
            })
        }
    }

}
