import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { ServiceResponse } from 'src/utils/enums';
import { ImageCropperComponent } from '../../../shared/image-cropper/image-cropper.component';
import { AmazonService } from '../../amazon.service';
import { ProductDetails, ProductsDropDownData, ProductTypesDropDown } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';
import { MatAutoSearchComponent } from '../mat-auto-search/mat-auto-search.component';
import { IngredientsDropDown } from '../product-lines.model';
import { BrandsService } from '../product-lines.service';

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss'],

})

export class ProductAddComponent implements OnInit {
    @ViewChild('inputLogo', { static: false }) InputVar: ElementRef;
    @ViewChild('myTextarea', { static: false }) public myTextarea: MatButton;

    productTypesDropDown: ProductTypesDropDown
    public productFormGroup: FormGroup;
    productsDropDownData: ProductsDropDownData;
    ingredientsData: IngredientsDropDown[];
    ingredientsOptions: Observable<IngredientsDropDown[]>;
    products: ProductDetails;
    requestObject: ProductDetails = null;
    selectedLogoFile: File;
    resourceFileName = '';
    fileName = "";
    searchString = "";
    isCallingProductAPI: boolean;
    isLoadingAPI: boolean;
    isDropdownAPI: boolean;
    isFromDetails: boolean;
    isUploading: boolean;
    brandId: number;
    productId: number;
    btnTitle = 'ADD';
    productTitle = 'Add Product';
    responseMessage = '';
    imgURL = null;
    filterDetails: any;
    productType = '';
    isSearchListEmpty: boolean;
    searching: boolean;
    totalIngredients = [];
    sliceData
    page = 1;
    pageSize = 10260;
    selectedIngredient = '';
    getSelectedIngredientMap = new Map();
    getSelectionValues = [];

    constructor(
        public location: Location,
        private amazonService: AmazonService,
        private activatedRoute: ActivatedRoute,
        private dashboardService: DashboardService,
        private brandService: BrandsService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {

        this.addProductData();
        this.getBrandTypes();

        this.activatedRoute.params.subscribe((params) => {
            if (params['brand_id']) {
                this.brandId = params['brand_id'];
                this.productId = params['product_id'];
            }
        });

        this.getProductsDropDown();
        this.searchIngredientsList('');
        if (this.productId) {
            this.btnTitle = localStorage.getItem('btnTitle');
            this.productTitle = localStorage.getItem('productTitle');
            this.isFromDetails = JSON.parse(localStorage.getItem('isFromDetails'));
            this.getProductsDetails();
        }

        this.dashboardService.productsFilteredDetails.subscribe((details) => {
            if (details) {
                this.filterDetails = details;
            }
        })
    }

    openIngredientDialog() {

        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.myTextarea._elementRef.nativeElement.getBoundingClientRect();
        const left = elemRect.left - bodyRect.left;
        const top = elemRect.top - bodyRect.top;
        let dialogref = this.dialog.open(MatAutoSearchComponent, {
            width: "560px",
            panelClass: ['serviceProduct-dialog', 'card-shadow', 'product-ingredient-dialog'],
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            position: { left: left + 'px', top: top + 'px' },
            data: {
                selectedIngredientMap: this.getSelectedIngredientMap,
                searchString: this.searchString,
                selectionValue: this.getSelectionValues
            },
        });
        dialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.getSelectedIngredientMap = new Map();

                this.getSelectedIngredientMap = response.selectedIngredientMap

                this.searchString = response.searchString
                this.productFormGroup.controls.ingredient_ids.setValue(Array.from(this.getSelectedIngredientMap.values()));

            }
        });

    }

    async searchIngredientsList(searchString): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.brandService.IngredientBySearch(searchString, this.page, this.pageSize, (status, data) => {

                if (status === 1) {
                    const response = data.ingredients;
                    this.totalIngredients = response;
                    this.sliceData = this.totalIngredients.slice()
                    this.isSearchListEmpty = response.length === 0 ? true : false;
                    return resolve(response);
                } else {
                    this.isSearchListEmpty = true;
                    return resolve([]);
                }
            }
            );
        });

    }

    validate(evt) {
        if ((evt.keyCode > 47 && evt.keyCode < 58) || (evt.keyCode > 36 && evt.keyCode < 41) || evt.keyCode == 8) return true;
        else return false;
    }

    addProductData() {
        this.productFormGroup = new FormGroup({
            product_name: new FormControl("", [Validators.required]),
            price: new FormControl("", [Validators.required]),
            skin_type_ids: new FormControl("", [Validators.required]),
            skin_concern_ids: new FormControl("", [Validators.required]),
            product_not_to_use_on_skin: new FormControl(""),
            ingredient_ids: new FormControl("", [Validators.required]),
            notes: new FormControl("", [Validators.maxLength(150)]),
            expires_in: new FormControl('', [Validators.required, Validators.min(1)]),
            product_type_id: new FormControl("", [Validators.required])
        });
    }

    getProductsDetails() {
        this.isLoadingAPI = true;
        this.dashboardService.productDetailsService(this.brandId, this.productId, (status: ServiceResponse, response: { product: ProductDetails; }) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.products = response.product;
                this.setProductFormData();
            }
        });
    }

    setProductFormData() {
        this.btnTitle === 'EDIT' ? this.productFormGroup.disable() : this.productFormGroup.enable();

        const product = this.products;
        this.imgURL = product.product_pic_thumb_url;
        const newSkinConcerns = [];
        const newSkinTypes = [];
        const newIngredients = [];
        const newAllergies = [];
        if (product.skin_concerns.length > 0) {
            product.skin_concerns.map(item => {
                newSkinConcerns.push(item.skin_concern_id)
            });
        }

        if (product.ingredients.length > 0) {
            product.ingredients.map(item => {
                newIngredients.push(item.ingredient);
                this.getSelectedIngredientMap.set(item.ingredient_id, item.ingredient);

            });
        }
        if (product.skin_types.length > 0) {
            product.skin_types.map(item => {
                newSkinTypes.push(item.skin_type_id)
            });
        }
        if (product.product_not_to_use_on_skin.length > 0) {
            product.product_not_to_use_on_skin.map(item => {
                newAllergies.push(item.concern_id)
            });
        }

        this.productFormGroup.setValue({
            product_name: product.product_name,
            price: Math.trunc(+product.price),
            skin_type_ids: newSkinTypes,
            skin_concern_ids: newSkinConcerns,
            ingredient_ids: newIngredients,
            product_not_to_use_on_skin: newAllergies,
            notes: product.notes,
            product_type_id: product.product_type_id,
            expires_in: product.expires_in
        })
    }

    submitProductForm(btnTitle: string) {

        if (btnTitle === 'EDIT') {
            this.enableEditMode();
        } else {
            if (this.productFormGroup.valid) {
                if (this.selectedLogoFile) {
                    this.uploadImagesToS3();
                } else {
                    this.requestDetails()
                    btnTitle === 'ADD' ? this.callCreateProduct() : this.callEditProduct();
                }
            }
        }
    }

    cancelProductForm(btnTitle: string) {
        if (btnTitle === 'SAVE' && this.isFromDetails) {
            const product = this.products;
            this.productFormGroup.controls.product_name.setValue(product.product_name);
            this.productFormGroup.controls.skin_type_ids.setValue(product.skin_type_ids);
            this.productFormGroup.controls.price.setValue(product.price);
            this.productFormGroup.controls.skin_concern_ids.setValue(product.skin_concern_ids);
            this.productFormGroup.controls.ingredient_ids.setValue(product.ingredient_ids);
            this.productFormGroup.controls.product_type_id.setValue(product.product_type_id);
            this.productFormGroup.controls.expires_in.setValue(product.expires_in);
            const newSkinConcerns = [];
            const newSkinTypes = [];
            const newIngredients = [];
            if (product.skin_concerns.length > 0) {
                product.skin_concerns.map(item => {
                    newSkinConcerns.push(item.skin_concern_id)
                });
            }
            if (product.ingredients.length > 0) {
                product.ingredients.map(item => {
                    newIngredients.push(item.ingredient)
                });
            }
            if (product.skin_types.length > 0) {
                product.skin_types.map(item => {
                    newSkinTypes.push(item.skin_type_id)
                });
            }
            this.productFormGroup.controls.skin_type_ids.setValue(newSkinTypes);
            this.productFormGroup.controls.skin_concern_ids.setValue(newSkinConcerns);
            this.productFormGroup.controls.ingredient_ids.setValue(newIngredients);
            this.disableEditMode();
        } else {
            this.location.back();
        }
        this.dashboardService.productsFilteredDetails.next(this.filterDetails)
    }

    enableEditMode() {
        this.btnTitle = "SAVE";
        this.productTitle = "Edit";
        this.productFormGroup.enable();
        this.productFormGroup.controls.expires_in.setValue(this.products.expires_in);
    }

    disableEditMode() {
        this.responseMessage = "";
        this.btnTitle = "EDIT";
        if (this.requestObject) {
            this.productTitle = this.requestObject.product_name
        } else {
            this.productTitle = localStorage.getItem('productTitle');

        }

        this.productFormGroup.disable();
    }

    callCreateProduct() {
        this.isCallingProductAPI = true;
        this.brandService.createProductService(this.brandId, this.requestObject, (status: ServiceResponse, response: { message: string; }) => {
            this.isCallingProductAPI = false;
            if (status === ServiceResponse.success) {
                this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    callEditProduct() {
        this.isCallingProductAPI = true;
        this.brandService.updateProductService(this.brandId, this.productId, this.requestObject, (status: ServiceResponse, response: { message: string; }) => {
            this.isCallingProductAPI = false;
            if (status === ServiceResponse.success) {
                this.productTitle = this.requestObject.product_name;
                this.btnTitle === 'SAVE' && this.isFromDetails ? this.disableEditMode() : this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    requestDetails() {
        const newIngredients = [];
        const newSkinTypes = [];
        const newSkinConcerns = [];
        const newAllergies = [];
        const productForm = this.productFormGroup.value;
        const ingredient_keys = Array.from(this.getSelectedIngredientMap.keys());

        if (productForm.skin_concern_ids.length > 0) {
            productForm.skin_concern_ids.map((item: any) => {
                newSkinConcerns.push({ skin_concern_id: item })
            });
        }
        if (ingredient_keys.length > 0) {
            ingredient_keys.map((item: any) => {

                newIngredients.push({ ingredient_id: item })
            });
        }
        if (productForm.skin_type_ids.length > 0) {
            productForm.skin_type_ids.map((item: any) => {
                newSkinTypes.push({ skin_type_id: item })
            });
        }
        if (productForm.product_not_to_use_on_skin.length > 0) {
            productForm.product_not_to_use_on_skin.map((item: any) => {
                newAllergies.push({ concern_id: item })
            });
        }

        this.requestObject = {
            ...productForm
        }
        this.requestObject.ingredient_ids = newIngredients;
        this.requestObject.skin_type_ids = newSkinTypes;
        this.requestObject.skin_concern_ids = newSkinConcerns;
        this.requestObject.product_not_to_use_on_skin = newAllergies;
        this.requestObject.product_img_s3_key_id = this.resourceFileName;
        const request = this.requestObject;
        for (let item in request) {
            if (request[item] === "" || request[item] === null || request[item] === undefined) {
                delete request[item];
            }
        }

        // console.log(this.requestObject);

    }

    onClickUploadLogo(event: { target: { files: FileList; }; }) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.selectedLogoFile = fileList[0];
            this.fileName = this.selectedLogoFile.name;
            var reader = new FileReader();
            reader.readAsDataURL(this.selectedLogoFile);
            reader.onload = (_event) => {
                let dialogref = this.dialog.open(ImageCropperComponent, {
                    disableClose: true,
                    data: {
                        base64: this.imgURL,
                        event: event
                    },
                });
                dialogref.afterClosed().subscribe((response) => {
                    if (response) {
                        this.imgURL = response;
                        this.InputVar.nativeElement.value = "";
                    } else {
                        this.imgURL = this.products ? this.products.product_pic_thumb_url : null;
                        this.selectedLogoFile = null;
                        this.fileName = "";
                        this.InputVar.nativeElement.value = "";

                    }

                });

            };

        }
    }

    async uploadImagesToS3() {
        const item = this.selectedLogoFile
        this.isUploading = true;
        this.isCallingProductAPI = true;
        return new Promise((resolve) => {
            const fName = item.name;
            const extensionName = fName.substring(fName.lastIndexOf('.'));
            const milliseconds = new Date().getTime();
            this.resourceFileName = 'product-' + milliseconds + extensionName;
            this.amazonService.uploadImagesToS3(item, this.resourceFileName, extensionName, (status: number, response: any) => {
                this.isUploading = false;
                this.isCallingProductAPI = true;
                if (status === 1) {
                    this.requestDetails();
                    this.btnTitle === 'ADD' ? this.callCreateProduct() : this.callEditProduct();
                    resolve({ status: true, data: item });
                } else {
                    resolve({ status: false, data: null });
                }
            });
        });
    }

    getProductsDropDown() {
        this.isDropdownAPI = true;
        this.dashboardService.productsDropdownService(this.brandId, (status: ServiceResponse, response: { data: ProductsDropDownData; }) => {
            if (status === ServiceResponse.success) {

                this.isDropdownAPI = false;
                this.productsDropDownData = response.data;
                this.ingredientsData = this.productsDropDownData.ingredients;
                this.sliceData = this.totalIngredients.slice()
                console.log(this.productsDropDownData.products_not_to_use_on_skin);
            }
        });
    }

    getBrandTypes() {
        this.isLoadingAPI = true;
        this.dashboardService.brandsDropdownService((status, response) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.productTypesDropDown = response.data.product_types
            }
        });
    }

}
