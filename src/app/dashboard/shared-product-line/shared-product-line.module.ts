import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { InlineSVGModule } from 'ng-inline-svg';
import { SharedLoadingModule } from '../../shared-loading/shared-loading.module';
import { ProductLineDeleteComponent } from './product-line-delete/product-line-delete.component';
import { ProductLineFilterComponent } from './product-line-filter/product-line-filter.component';
import { ProductLineListComponent } from './product-line-list/product-line-list.component';
import { ProductLineProductsComponent } from './product-line-products/product-line-products.component';
import { SharedProductLineRoutingModule } from './shared-product-line-routing.module';

const MaterialImports = [
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
]

@NgModule({
    declarations: [
        ProductLineListComponent,
        ProductLineDeleteComponent,
        ProductLineProductsComponent,
        ProductLineFilterComponent],
    imports: [
        CommonModule,
        SharedProductLineRoutingModule,
        SharedLoadingModule,
        ...MaterialImports,
        InlineSVGModule.forRoot()
    ],
    exports: [
        ProductLineListComponent,
        ProductLineDeleteComponent,
        ProductLineProductsComponent,
        ...MaterialImports
    ],
    entryComponents: [ProductLineFilterComponent]
})
export class SharedProductLineModule {

}
