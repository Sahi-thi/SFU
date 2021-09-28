import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedProductLineModule } from '../../shared-product-line/shared-product-line.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SalonProductLinesRoutingModule } from './salon-product-lines-routing.module';

@NgModule({
    declarations: [
        ProductDetailsComponent
    ],
    imports: [
        CommonModule,
        SharedProductLineModule,
        SalonProductLinesRoutingModule
    ],
    entryComponents: [
    ]
})
export class SalonProductLinesModule { }
