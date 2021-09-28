import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductLineListComponent } from '../shared-product-line/product-line-list/product-line-list.component';
import { ProductLineProductsComponent } from '../shared-product-line/product-line-products/product-line-products.component';
import { ProductAddComponent } from './product-add/product-add.component';

const routes: Routes = [
    {
        path: '', component: ProductLineListComponent,

    },
    { path: ':brand_id/products', component: ProductLineProductsComponent },
    { path: ':brand_id/products/add', component: ProductAddComponent },
    { path: ':brand_id/products/add/:product_id', component: ProductAddComponent },
    { path: ':brand_id/products/:product_id/edit', component: ProductAddComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductLinesRoutingModule { }
