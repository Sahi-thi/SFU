import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceResponse } from '../../../utils/enums';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    isSubmitted: boolean = false;
    showSuccess: boolean = false;
    responseMessage: string = "";
    token: string;
    constructor(
        private titleService: Title,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params) => {
            this.token = params['token']
        });

        this.titleService.setTitle("Reset Password");

        this.resetForm = this.formBuilder.group({
            password: new FormControl("", [Validators.required, Validators.minLength(8)]),
            confirmPassword: new FormControl("", [Validators.required]),
        }, { validator: passwordMatchValidator }
        )

    }
    get password() {
        return this.resetForm.get("password");
    }
    get confirmPassword() {
        return this.resetForm.get("confirmPassword");
    }
    onPasswordInput() {
        if (this.resetForm.hasError("passwordMismatch"))
            this.confirmPassword.setErrors([{ passwordMismatch: true }]);
        else this.confirmPassword.setErrors(null);
    }

    emptyResponseMessage() {
        this.responseMessage = "";
    }
    
    onSubmit() {
        if (this.resetForm.valid) {
            this.isSubmitted = true;
            const request = {
                token: this.token,
                password: this.resetForm.value.password
            }
            
            this.authService.resetPasswordService(request, (status, response) => {
                this.isSubmitted = false;
                if (status === ServiceResponse.success) {
                    this.showSuccess = true
                    this.authService.loginResponse = response;

                } else if (status === ServiceResponse.error) {
                    this.responseMessage = response;
                    alert(response);
                }
            });
        }
    }

    goToLogin() {
        this.router.navigate(["/login"], {
            relativeTo: this.activatedRoute,
        });
    }

}

export const passwordMatchValidator: ValidatorFn = (
    formGroup: FormGroup
): ValidationErrors | null => {
    if (
        formGroup.get("password").value === formGroup.get("confirmPassword").value
    )
        return null;
    else return { passwordMismatch: true };
};
