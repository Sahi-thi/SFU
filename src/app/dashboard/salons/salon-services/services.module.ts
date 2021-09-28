import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesAddComponent } from './services-add/services-add.component';
import { ServicesListComponent } from './services-list/services-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from "@angular/material/input";
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { ServicesFilterComponent } from './services-filter/services-filter.component';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedLoadingModule } from '../../../shared-loading/shared-loading.module';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [ 
    ServicesAddComponent,
    ServicesListComponent,
    ServicesFilterComponent
  ],
  imports: [
    ServicesRoutingModule,
    CommonModule,

    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,

    FormsModule,
    ReactiveFormsModule,

    SharedLoadingModule,
    InlineSVGModule.forRoot()
  ],
  entryComponents: [
    ServicesFilterComponent,
  ]
})
export class ServicesModule { }
