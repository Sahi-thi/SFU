import { Component, OnInit } from '@angular/core';
import {
    FormBuilder, FormControl, FormGroup,

    Validators
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationsService } from 'src/app/dashboard/salons/conversations/conversations.service';
import { ServiceResponse, UserRole } from '../../../utils/enums';
import { LoginResponse } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isSubmitted: boolean = false;
    loginData: LoginResponse;
    userRole: UserRole;
    salonId: string;
    responseMessage: string = '';

    constructor(
        private titleService: Title,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private conversationService: ConversationsService,
    ) { }

    ngOnInit() {
        this.titleService.setTitle('Login');
        const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.loginForm = this.formBuilder.group({
            email: new FormControl('', [
                Validators.required,
                Validators.pattern(emailPattern),
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
            ]),
        });
    }

    get password() {
        return this.loginForm.get('password');
    }
    get email() {
        return this.loginForm.get('email');
    }

    emptyResponseMessage() {
        this.responseMessage = '';
    }

    onLoginFormSubmit() {
        localStorage.setItem('email', this.loginForm.value.email);
        if (this.loginForm.valid) {
            this.isSubmitted = true;
            this.authService.loginUserService(this.loginForm.value, (status, response) => {

                this.loginData = response;
                if (status === ServiceResponse.success) {
                    this.initializeQuickBlox();
                    this.authService.loginResponse = response;

                } else if (status === ServiceResponse.newUser) {
                    this.loginData = response;
                    this.router.navigate(['/reset-password', this.loginData.token], {
                        relativeTo: this.activatedRoute,
                        queryParams: { token: this.loginData.token },
                    });
                } else if (status === ServiceResponse.error) {
                    this.isSubmitted = false;
                    this.responseMessage = response;
                }
            }
            );
        }
    }

    async adminNavigation() {
        this.salonId = this.loginData.user.salon_id;
        localStorage.setItem('salon_id', this.salonId);
        this.userNavigation('/home/salons/salon/' + this.salonId + '/details');
    }

    async providerNavigation() {
        this.salonId = this.loginData.user.salon_id;
        localStorage.setItem('salon_id', this.salonId);
        this.userNavigation('/home/salons/salon/' + this.salonId + '/clients');

    }

    async userNavigation(URL) {
        this.router.navigate([URL], {
            relativeTo: this.activatedRoute,
        });
    }

    async initializeQuickBlox() {
        this.conversationService.initializeQuickBlox();
        this.setUserToLogin();
    }

    async  setUserToLogin() {
        try {
            await this.conversationService.login({ email: localStorage.getItem('email') });
            const role = this.loginData.user.user_role;
            localStorage.setItem('userRole', role);
            localStorage.setItem('headerTab', 'Studios');
            role === UserRole.superAdmin
                ? this.userNavigation('/home/salons')
                : role === UserRole.admin
                    ? this.adminNavigation()
                    : this.providerNavigation();
        } catch (error) {
            console.log({ error });

        }
    }

}
