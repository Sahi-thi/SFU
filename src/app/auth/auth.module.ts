import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InlineSVGModule } from 'ng-inline-svg';
import { AuthGuardService } from './auth-guard.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
    declarations: [AuthenticationComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        InlineSVGModule.forRoot(),
    ],
    providers: [
        AuthService,
        AuthGuardService
    ]

})
export class AuthModule { }
