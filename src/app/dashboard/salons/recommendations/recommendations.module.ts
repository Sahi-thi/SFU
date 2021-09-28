import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommendationsRoutingModule } from './recommendations-routing.module';
import { RecommendationListComponent } from './recommendation-list/recommendation-list.component';
import { RecommendationAddComponent } from './recommendation-add/recommendation-add.component';
import { RecommendationFilterComponent } from './recommendation-filter/recommendation-filter.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedLoadingModule } from '../../../shared-loading/shared-loading.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../../../shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { ServiceRecommendationComponent } from './service-recommendation/service-recommendation.component';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    declarations: [
        RecommendationListComponent,
        RecommendationAddComponent,
        RecommendationFilterComponent,
        ServiceRecommendationComponent
    ],
    imports: [
        CommonModule,
        RecommendationsRoutingModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,

        MatDialogModule,
        MatRippleModule,
        MatCheckboxModule,

        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        SharedLoadingModule,
        SharedModule,
        InlineSVGModule.forRoot()
    ],
    entryComponents: [
        RecommendationFilterComponent,
    ]
})
export class RecommendationsModule { }
