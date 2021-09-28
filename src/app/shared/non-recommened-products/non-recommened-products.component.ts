import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-non-recommened-products',
    templateUrl: './non-recommened-products.component.html',
    styleUrls: ['./non-recommened-products.component.scss']
})
export class NonRecommenedProductsComponent implements OnInit {
    product
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
    ) { }

    ngOnInit() {
        this.product = this.data.product
        console.log(this.product);
    }

}
