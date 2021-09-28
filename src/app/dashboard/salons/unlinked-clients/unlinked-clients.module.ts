import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnlinkedClientsRoutingModule } from './unlinked-clients-routing.module';
import { UnlinkedClientsListComponent } from './unlinked-clients-list/unlinked-clients-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatDatepickerModule, MatExpansionModule, MatListModule, MatNativeDateModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { SharedLoadingModule } from 'src/app/shared-loading/shared-loading.module';
import { UnlinkedClientsInfoComponent } from './unlinked-clients-info/unlinked-clients-info.component';
import { UnlinkedClientsFilterComponent } from './unlinked-clients-filter/unlinked-clients-filter.component';


@NgModule({
  declarations: [
    UnlinkedClientsListComponent,
    UnlinkedClientsInfoComponent,
    UnlinkedClientsFilterComponent
  ],
  imports: [
    CommonModule,
    UnlinkedClientsRoutingModule,
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
  

  ],
  entryComponents: [
    UnlinkedClientsFilterComponent,
    
]
})
export class UnlinkedClientsModule { }
