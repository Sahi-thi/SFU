import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductLineListComponent } from '../../shared-product-line/product-line-list/product-line-list.component';
import { ProductLineProductsComponent } from '../../shared-product-line/product-line-products/product-line-products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
    { path: '', component: ProductLineListComponent },
    { path: ':brand_id/products', component: ProductLineProductsComponent },
    { path: ':brand_id/products/:product_id/details', component: ProductDetailsComponent }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalonProductLinesRoutingModule { }
