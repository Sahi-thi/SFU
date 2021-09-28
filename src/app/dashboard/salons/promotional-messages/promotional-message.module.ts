import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionalMessageRoutingModule } from './promotional-message-routing.module';
import { PromotionalMessageAddComponent } from './promotional-message-add/promotional-message-add.component';
import { PromotionalMessagesListComponent } from './promotional-messages-list/promotional-messages-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedLoadingModule } from 'src/app/shared-loading/shared-loading.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatAutocompleteModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule } from '@angular/material';

import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [PromotionalMessageAddComponent,
  PromotionalMessagesListComponent],
  imports: [
    CommonModule,
    PromotionalMessageRoutingModule,
    
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    InlineSVGModule.forRoot(),
    SharedModule,
    SharedLoadingModule,
    MatTableModule,
    MatCheckboxModule
  ]
})
export class PromotionalMessageModule { }
