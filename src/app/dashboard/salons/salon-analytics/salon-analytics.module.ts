import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SharedAnalyticsModule } from '../../shared-analytics/shared-analytics.module';
import { SalonAnalyticsDashboardComponent } from './salon-analytics-dashboard/salon-analytics-dashboard.component';
import { SalonAnalyticsRoutingModule } from './salon-analytics-routing.module';

@NgModule({

    declarations: [
        SalonAnalyticsDashboardComponent,
    ],

    imports: [
        CommonModule,
        SharedAnalyticsModule,
        SalonAnalyticsRoutingModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        NgbModalModule
    ]

})
export class SalonAnalyticsModule { }
