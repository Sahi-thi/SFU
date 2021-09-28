import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InlineSVGModule } from 'ng-inline-svg';
import { SharedLoadingModule } from '../shared-loading/shared-loading.module';
import { ConformationDialogComponent } from './conformation-dialog/conformation-dialog.component';
import { DashBoardGuardService } from './dashboard-guard.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeadersComponent } from './headers/headers.component';
import { SalonsFilterComponent } from './salons-filter/salons-filter.component';
import { SalonsListComponent } from './salons-list/salons-list.component';
import { VideoCallListenerService } from './videoCallListeners.service';
import { SharedSalonModule } from './shared-salon/shared-salon.module';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { NonRecommenedProductsComponent } from '../shared/non-recommened-products/non-recommened-products.component';

@NgModule({
    imports: [
        SharedSalonModule,
        SharedLoadingModule,
        DashboardRoutingModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        InlineSVGModule.forRoot(),

    ],
    declarations: [
        DashboardComponent,
        HeadersComponent,
        SalonsListComponent,
        SalonsFilterComponent,
        VideoDialogComponent,
        ConformationDialogComponent
    ],
    providers: [
        DashBoardGuardService,
        DashboardService,
        VideoCallListenerService,
    ],
    entryComponents: [
        SalonsFilterComponent,
        VideoDialogComponent,
        ConformationDialogComponent,
        NonRecommenedProductsComponent
    ],

})
export class DashboardModule { }
