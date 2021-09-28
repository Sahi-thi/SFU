import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { Constants } from '../../utils/constants';
import { ServiceResponse } from '../../utils/enums';
import { DefaultResponse, ForgotResponse, LoginResponse, User } from './auth.model';

@Injectable({
    providedIn: "root",
})

export class AuthService {
    constructor(protected httpClient: HttpClient, private route: Router) { }

    public defaultResponse: DefaultResponse;
    public loginResponse: LoginResponse;
    public forgotResponse: ForgotResponse;
    public user: User;

    isUserAuthenticated() {
        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            return true;
        }
        return false;
    }

    setAccessToken(auth_token: string) {
        localStorage.setItem("access_token", auth_token);
    }

    loginUserService(params, callback) {
        const url = environment.api_end_point + Constants.login;
        this.httpClient
            .post(url, params)
            .subscribe((loginResponse: LoginResponse) => {
                this.loginResponse = loginResponse;

                if (this.loginResponse.statusCode === 200) {
                    callback(ServiceResponse.success, this.loginResponse);
                    this.user = loginResponse.user;
                    this.setAccessToken(this.loginResponse.authorization);

                } else if (this.loginResponse.statusCode === 203 && this.loginResponse.is_password_set === 0) {
                    callback(ServiceResponse.newUser, this.loginResponse)
                } else {
                    callback(ServiceResponse.error, this.loginResponse.message);
                }
            });
    }

    forgotPasswordService(request, callback) {
        const url = environment.api_end_point + Constants.forgotPassword;
        this.httpClient.post(url, request).subscribe((forgotResponse: ForgotResponse) => {
            this.forgotResponse = forgotResponse
            if (forgotResponse.statusCode === 200) {
                callback(ServiceResponse.success, forgotResponse);
            } else {
                callback(ServiceResponse.error, forgotResponse.message);
            }
        });
    }

    resetPasswordService(request, callback) {
        const url = environment.api_end_point + Constants.resetPassword;

        this.httpClient.post(url, request).subscribe((defaultResponse: DefaultResponse) => {
            this.defaultResponse = defaultResponse
            if (defaultResponse.statusCode === 200) {
                callback(ServiceResponse.success, defaultResponse);
            } else {
                callback(ServiceResponse.error, defaultResponse.message);
            }
        });
    }

}