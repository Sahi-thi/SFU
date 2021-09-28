import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { SharedProductLineModule } from '../shared-product-line/shared-product-line.module';
import { MatAutoSearchComponent } from './mat-auto-search/mat-auto-search.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductLineAddComponent } from './product-line-add/product-line-add.component';
import { ProductLinesRoutingModule } from './product-lines-routing.module';

@NgModule({
    declarations: [ProductAddComponent, ProductLineAddComponent, MatAutoSearchComponent],
    imports: [
        CommonModule,
        SharedProductLineModule,
        ProductLinesRoutingModule,

        MatProgressSpinnerModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        SharedModule,
        MatListModule
    ],
    entryComponents: [
        ProductLineAddComponent,
        MatAutoSearchComponent
    ]

})
export class ProductLinesModule { }
