import { Component, Inject, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { ServiceResponse } from '../../../../utils/enums';
import { ProductTypesDropDown } from '../../dashboard.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-product-line-filter',
    templateUrl: './product-line-filter.component.html',
    styleUrls: ['./product-line-filter.component.scss']
})
export class ProductLineFilterComponent implements OnInit {
    productTypesDropDown: ProductTypesDropDown
    isLoadingAPI: boolean;
    type: number;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ProductLineFilterComponent>,
        private dashboardService: DashboardService) { }

    ngOnInit() {
        this.getProductLineTypes();
        this.type = this.data.type;
    }

    applyFilter() {
        this.dialogRef.close(
            {
                type: this.type,
                searchString: this.data.searchString
            }
        )
    }
    removeFilterData() {
        this.dialogRef.close(
            {
                type: null,
                searchString: this.data.searchString
            }
        )
    }

    getProductLineTypes() {
        this.isLoadingAPI = true;
        this.dashboardService.brandsDropdownService((status, response) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.productTypesDropDown = response.data.product_types
            }
        });
    }
}
