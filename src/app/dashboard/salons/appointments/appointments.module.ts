import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppointmentCreateComponent } from './appointment-create/appointment-create.component';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { TableViewComponent } from './table-view/table-view.component';
import { AppointmentFilterComponent } from './appointment-filter/appointment-filter.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { AddServiceProductDialogComponent } from './add-service-product-dialog/add-service-product-dialog.component';
import { DeleteServiceProductDialogComponent } from './delete-service-product-dialog/delete-service-product-dialog.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';

import { SharedLoadingModule } from '../../../shared-loading/shared-loading.module';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { UnregisteredClientsAppointmentListComponent } from './unregistered-clients-appointment-list/unregistered-clients-appointment-list.component';



@NgModule({
    declarations: [
        TableViewComponent,
        CalendarViewComponent,
        AppointmentCreateComponent,
        AppointmentFilterComponent,
        AppointmentDetailsComponent,
        AddServiceProductDialogComponent,
        DeleteServiceProductDialogComponent,
        UnregisteredClientsAppointmentListComponent,
    ],
    imports: [
        CommonModule,
        AppointmentsRoutingModule,

        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatCheckboxModule,
        MatExpansionModule, 
        MatRadioModule,
        SharedLoadingModule,
        SharedModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgbModalModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule, 
        InlineSVGModule.forRoot()
    ],
    entryComponents: [
        AddServiceProductDialogComponent,
        AppointmentFilterComponent,
        DeleteServiceProductDialogComponent
    ],
    providers: [
        DatePipe,
    ]
})
export class AppointmentsModule { }
