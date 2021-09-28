import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ForgotResponse } from '../auth.model';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceResponse } from '../../../utils/enums';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    forgotForm: FormGroup;
    isSubmitted: boolean = false;
    showSuccess: boolean = false;
    forgotData: ForgotResponse;
    responseMessage: string = "";
    email: string = "";

    constructor(
        public location: Location,
        private titleService: Title,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) { }

    ngOnInit() {

        this.titleService.setTitle("Forgot-password");
        const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        this.forgotForm = this.formBuilder.group({
            email: new FormControl("", [Validators.required, Validators.pattern(emailPattern)]),
        })

    }

    emptyResponseMessage() {
        this.responseMessage = "";
    }

    onSubmit() {

        if (this.forgotForm.valid) {
            this.isSubmitted = true;

            this.authService.forgotPasswordService(this.forgotForm.value, (status, response) => {
                this.isSubmitted = false;
                if (status === ServiceResponse.success) {
                    this.forgotData = response;
                    this.showSuccess = true;
                    this.email = response.email;
                } else {
                    this.responseMessage = response;
                }
            });
        }
    }

}
