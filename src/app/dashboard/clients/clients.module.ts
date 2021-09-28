import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { InlineSVGModule } from 'ng-inline-svg';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedLoadingModule } from '../../shared-loading/shared-loading.module';
import { ClientsDashboardComponent } from './clients-dashboard/clients-dashboard.component';
import { ClientsFilterComponent } from './clients-filter/clients-filter.component';
import { ClientsFormsListComponent } from './clients-forms-list/clients-forms-list.component';
import { ClientsInfoComponent } from './clients-info/clients-info.component';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { ClientsRoutineComponent } from './clients-routine/clients-routine.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsSalonsLinkedComponent } from './clients-salons-linked/clients-salons-linked.component';

@NgModule({
    declarations: [
        ClientsListComponent,
        ClientsDashboardComponent,
        ClientsRoutineComponent,
        ClientsFormsListComponent,

        ClientsFilterComponent, ClientsSalonsLinkedComponent,
        ClientsInfoComponent,
    ],
    imports: [
        CommonModule,
        ClientsRoutingModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,

        MatProgressSpinnerModule,
        MatButtonModule,
        InlineSVGModule.forRoot(),
        MatNativeDateModule,

        SharedLoadingModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatListModule,
        MatCardModule,
        MatDatepickerModule,
        MatExpansionModule,
        PdfViewerModule
    ]
})
export class ClientsModule { }
