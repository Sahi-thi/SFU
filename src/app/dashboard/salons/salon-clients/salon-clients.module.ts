import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { InlineSVGModule } from 'ng-inline-svg';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedLoadingModule } from '../../../shared-loading/shared-loading.module';
import { AddNoteComponent } from './add-note/add-note.component';
import { DeleteNoteComponent } from './delete-note/delete-note.component';
import { DetailsDashboardComponent } from './details-dashboard/details-dashboard.component';
import { FormViewDialogComponent } from './form-view-dialog/form-view-dialog.component';
import { FormsListComponent } from './forms-list/forms-list.component';
import { NotesComponent } from './notes/notes.component';
import { RoutineComponent } from './routine/routine.component';
import { SalonClientsFilterComponent } from './salon-clients-filter/salon-clients-filter.component';
import { SalonClientsInfoComponent } from './salon-clients-info/salon-clients-info.component';
import { SalonClientsListComponent } from './salon-clients-list/salon-clients-list.component';
import { SalonClientsRoutingModule } from './salon-clients-routing.module';

@NgModule({
    declarations: [
        SalonClientsListComponent,
        SalonClientsFilterComponent,
        SalonClientsInfoComponent,
        FormsListComponent,
        RoutineComponent,
        DetailsDashboardComponent,
        FormViewDialogComponent,
        NotesComponent,
        AddNoteComponent,
        DeleteNoteComponent,

    ],
    imports: [
        CommonModule,
        SalonClientsRoutingModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSelectModule,
        MatCardModule,
        MatExpansionModule,
        MatListModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,

        HttpClientModule,
        SharedLoadingModule,
        PdfViewerModule,
        InlineSVGModule.forRoot()
    ],
    // providers: [
    //     {
    //         provide: DateAdapter,
    //         useClass: MomentDateAdapter,
    //         deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    //     },
    //     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // ],
    entryComponents: [
        SalonClientsFilterComponent,
        FormViewDialogComponent,
        DeleteNoteComponent
    ]
})
export class SalonClientsModule { }
