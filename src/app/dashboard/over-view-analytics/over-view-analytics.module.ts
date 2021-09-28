import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { InlineSVGModule } from 'ng-inline-svg';
import { SharedAnalyticsModule } from '../shared-analytics/shared-analytics.module';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AppointmentAnalyticsComponent } from './appointment-analytics/appointment-analytics.component';
import { OverViewAnalyticsRoutingModule } from './over-view-analytics-routing.module';

@NgModule({
    declarations: [
        AnalyticsComponent,
        AppointmentAnalyticsComponent,
    ],
    imports: [
        CommonModule,
        OverViewAnalyticsRoutingModule,
        SharedAnalyticsModule,
        InlineSVGModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgbModalModule
    ]
})
export class OverViewAnalyticsModule { }
