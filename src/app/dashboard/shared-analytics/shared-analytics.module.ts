import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MobileAppAnalyticsComponent } from './mobile-app-analytics/mobile-app-analytics.component';
import { SalesAnalyticsComponent } from './sales-analytics/sales-analytics.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
    declarations: [MobileAppAnalyticsComponent, SalesAnalyticsComponent],
    imports: [
        CommonModule,
        ChartsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
    ],
    exports: [
        ChartsModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        SalesAnalyticsComponent,
        MobileAppAnalyticsComponent
    ],
    providers: [ThemeService]
})
export class SharedAnalyticsModule { }
