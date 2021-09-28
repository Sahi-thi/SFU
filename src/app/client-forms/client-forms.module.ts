import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SharedModule } from '../shared/shared.module';
import { ClientConsentComponent } from './client-consent/client-consent.component';
import { ClientFormsRoutingModule } from './client-forms-routing.module';
import { FacialConsentComponent } from './facial-consent/facial-consent.component';
import { FormsGuardService } from './forms-guard.service';

@NgModule({
    declarations: [
        FacialConsentComponent,
        ClientConsentComponent
    ],
    imports: [
        CommonModule,
        ClientFormsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatRadioModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatDatepickerModule,
        SignaturePadModule,
        MatNativeDateModule,
        SharedModule
    ],
    providers: [
        FormsGuardService,
        DatePipe
    ]

})
export class ClientFormsModule { }
