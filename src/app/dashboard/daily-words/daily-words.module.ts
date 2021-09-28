import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyWordsRoutingModule } from './daily-words-routing.module';
import { DailyWordsListComponent } from './daily-words-list/daily-words-list.component';
import { DailyWordsAddComponent } from './daily-words-add/daily-words-add.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedLoadingModule } from 'src/app/shared-loading/shared-loading.module';

@NgModule({
  declarations: [
    DailyWordsListComponent,
    DailyWordsAddComponent
  ],
  imports: [
    CommonModule,
    DailyWordsRoutingModule,
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

  ]
})
export class DailyWordsModule { }
