import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalonAnalyticsDashboardComponent } from './salon-analytics-dashboard/salon-analytics-dashboard.component';

const routes: Routes = [
    { path: '', component: SalonAnalyticsDashboardComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalonAnalyticsRoutingModule { }
