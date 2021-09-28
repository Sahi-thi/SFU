import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientConsentComponent } from './client-consent/client-consent.component';
import { FacialConsentComponent } from './facial-consent/facial-consent.component';

const routes: Routes = [
    { path: '', component: FacialConsentComponent },
    { path: 'waxing', component: ClientConsentComponent },
    { path: 'intake', component: FacialConsentComponent },
    { path: 'facial', component: FacialConsentComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientFormsRoutingModule { }
