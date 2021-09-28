import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
    {
        path: '', component: AuthenticationComponent,

        children: [
            { path: '', redirectTo: 'login', canActivate: [AuthGuardService] },
            { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
            { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuardService] },
            { path: 'reset-password/:token', component: ResetPasswordComponent, canActivate: [AuthGuardService] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
