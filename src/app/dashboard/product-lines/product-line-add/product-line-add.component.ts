import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CustomValidators } from 'src/utils/customValidators';
import { ServiceResponse } from 'src/utils/enums';
import { DashboardService } from '../../dashboard.service';
import { GetProductLineData, ProductDetails, Brands, ProductLinesDropDown, ProductTypesDropDown } from '../../dashboard.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/utils/constants';
import { BrandsService } from '../product-lines.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-product-line-add',
    templateUrl: './product-line-add.component.html',
    styleUrls: ['./product-line-add.component.scss']
})
export class ProductLineAddComponent implements OnInit {

    productFormGroup: FormGroup;
    productTypesDropDown: ProductTypesDropDown;
    productLinesDropDown: ProductLinesDropDown;
    getProductLineData: GetProductLineData;
    brands: Brands;
    products: ProductDetails[];
    isFormAPICalling: boolean;
    isLoadingAPI: boolean;
    isApiCalling: boolean;
    isFromDetails: boolean;
    brandId: number;
    responseMessage: string;
    productLineTitle = 'Add Brand';
    public tabTitle = "Add Brand"
    brandName = ''
    btnTitle = "ADD";
    filteredDetails;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private dashboardService: DashboardService,
        private productLineService: BrandsService,
        private titleService: Title,
        private dialogRef: MatDialogRef<ProductLineAddComponent>,

    ) { }

    ngOnInit() {
        this.dialogRef.disableClose = true;
        this.addaddBrandFormData();

        if (this.data.operationIs === 'add') {
            this.tabTitle = 'Add Brand';
            this.btnTitle = 'ADD'
        } else {
            this.tabTitle = 'Edit Brand';
            this.brandId = this.data.brandId;
            this.productFormGroup.controls.brand_name.setValue(this.data.brandName);
            this.btnTitle = 'SAVE'
        }

        this.dashboardService.productLineFilteredDetails.subscribe((details) => {
            if (details) {
                this.filteredDetails = details;
            }
        })
        this.titleService.setTitle(Constants.skinForYou + this.tabTitle);

    }

    addaddBrandFormData() {
        this.productFormGroup = new FormGroup({
            brand_name: new FormControl('', [Validators.required, CustomValidators.noWhitespaceValidator]),
        });
    }

    submitFormData() {
        this.btnTitle === 'ADD' ? this.callAddBrand() : this.callEditBrand();
    }

    callAddBrand() {
        if (this.productFormGroup.valid) {
            this.isFormAPICalling = true;
            this.productLineService.addBrandService(this.productFormGroup.value, (status, response) => {
                this.isFormAPICalling = false;
                if (status === ServiceResponse.success) {
                    this.goBackToBrandsList();
                } else {
                    this.responseMessage = response.message;
                }
            })
        }
    }

    callEditBrand() {
        if (this.productFormGroup.valid) {
            this.isFormAPICalling = true;
            this.productLineService.BrandUpdateService(this.brandId, this.productFormGroup.value, (status, response) => {
                this.isFormAPICalling = false;
                if (status === ServiceResponse.success) {
                    this.goBackToBrandsList();
                } else {
                    this.responseMessage = response.message;
                }
            })
        }
    }

    goBackToBrandsList() {
        this.dashboardService.productLineFilteredDetails.next(this.filteredDetails)
        this.dialogRef.close('add');
    }

} 