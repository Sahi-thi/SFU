import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/utils/constants';
import { ProductDetails, MetaData } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';
import { ServiceResponse } from '../../../../utils/enums';
import { DeleteSalonComponent } from '../../../shared/delete-salon/delete-salon.component';
import { MatDialog, MatPaginator } from '@angular/material';

@Component({
    selector: 'app-product-line-products',
    templateUrl: './product-line-products.component.html',
    styleUrls: ['./product-line-products.component.scss']
})
export class ProductLineProductsComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    headerTab = "";
    salonId: number;
    brandId: number;
    isLoadingAPI: boolean;
    isProductsEmpty: boolean;
    isManageClicked: boolean;
    isManageProductsEmpty: boolean;
    isManageLoading: boolean;
    page = 1;
    pageSize = 5;
    searchString = '';
    products: ProductDetails[];
    pageArray = [];
    mixedArray = [];
    checkedIds = [];
    unCheckedIds = [];
    metaData: MetaData;
    btnTitle: string;
    companyTitle: string;
    filteredItems;
    serverErrorMessage = "";

    constructor(
        private activatedRoute: ActivatedRoute,
        private dashboardService: DashboardService,
        private titleService: Title,
        private router: Router,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.headerTab = localStorage.getItem('headerTab');
        this.titleService.setTitle(Constants.skinForYou + 'Products-Salon Product Lines');

        this.activatedRoute.params.subscribe((params) => {
            this.salonId = params['salon_id'];
            this.brandId = params['brand_id'];
        });

        this.dashboardService.productsFilteredDetails.subscribe((details) => {
            if (details) {
                this.searchString = details.searchString;
                this.page = details.page;
            }
        });

        this.callProductService();
        this.btnTitle = localStorage.getItem('productLineTitle');
        this.companyTitle = localStorage.getItem('brandName')
    }

    backToBrands() {
        if (this.headerTab === "Studios") {
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/brands');

        } else {
            this.navigationToScreen('/home/brands');
        }

    }

    navigateToDetails() {
        if (this.headerTab === "Studios") {
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/brands/' + this.brandId + '/details');
        } else {
            this.navigationToScreen('/home/brands/add/' + this.brandId);
        }
    }

    navigateToProductDetails(productId) {
        if (this.headerTab !== "Studios") {
            this.navigationToScreen('/home/brands/' + this.brandId + '/products/' + productId + '/edit')
        }
    }

    navigateToProducts() {
        if (this.headerTab === "Studios") {
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/brands/' + this.brandId + '/products');
        } else {
            this.navigationToScreen('/home/brands/' + this.brandId + '/products');
        }
    }

    productDetails(element) {
        localStorage.setItem('btnTitle', 'EDIT');
        localStorage.setItem('productTitle', element);
        localStorage.setItem('isFromDetails', 'true');
        this.navigationDetails()
    }

    editProduct() {
        localStorage.setItem('btnTitle', 'SAVE');
        localStorage.setItem('productTitle', 'Edit');
        localStorage.setItem('isFromDetails', 'false');
        this.navigationDetails()
    }

    navigationDetails() {
        this.filteredItems = {
            searchString: this.searchString,
            page: this.page
        }
        this.dashboardService.productsFilteredDetails.next(this.filteredItems);
    }

    navigationToScreen(URL: string) {
        this.router.navigate([URL], {
            relativeTo: this.activatedRoute,
        })
    }

    loadNextData(event) {
        this.page = event.pageIndex + 1;
        this.isManageClicked === true ? this.callManageProductService() : this.callProductService();
    }

    searchSalon(searchString) {
        this.searchString = searchString;
        this.page = 1;
        this.callProductService();
    }

    clearSearch() {
        this.searchString = "";
        this.callProductService();
    }

    manageProducts() {
        this.isManageClicked = true;
        this.page = 1;
        this.callManageProductService();
    }

    cancelManageProducts() {
        this.isManageProductsEmpty = false;
        this.isManageClicked = false;
        this.page = 1;
        this.callProductService();
    }

    callProductService() {
        this.isLoadingAPI = true;
        this.isProductsEmpty = false;

        this.headerTab !== 'Studios' ?
            this.dashboardService.productListService(this.brandId, this.page, this.pageSize, this.searchString, (status, response) => {
                this.isLoadingAPI = false;
                if (status === ServiceResponse.success) {
                    this.products = response.products;
                    this.metaData = response.meta_data;
                    this.isProductsEmpty = false;
                } else if (status === ServiceResponse.emptyList) {
                    this.isProductsEmpty = true;
                    this.products = response.products;
                } else {
                    this.serverErrorMessage = response.message;
                }
            }) :

            this.dashboardService.salonProductListService(this.salonId, this.brandId, this.page, this.pageSize, this.searchString, (status, response) => {
                this.isLoadingAPI = false;
                if (status === ServiceResponse.success) {
                    this.products = response.products;
                    this.metaData = response.meta_data;
                    this.isProductsEmpty = false;
                } else if (status === ServiceResponse.emptyList) {
                    this.isProductsEmpty = true;
                    this.products = response.products;
                }
            })
    }

    callManageProductService() {

        this.isLoadingAPI = true;
        this.isProductsEmpty = false;
        this.isManageProductsEmpty = false;
        this.dashboardService.manageProductService(this.salonId, this.brandId, this.page, this.pageSize, this.searchString, (status, response) => {
            this.isLoadingAPI = false;

            if (status === ServiceResponse.success) {
                this.products = this.finalProducts(response.products);
                this.metaData = response.meta_data;
                this.isProductsEmpty = false;
                this.isManageProductsEmpty = false;
            } else if (status === ServiceResponse.emptyList) {
                this.products = response.products;
                this.isProductsEmpty = true;
                this.isManageProductsEmpty = true;
            }
        })
    }

    finalProducts(products) {
        if (this.mixedArray.length) {
            this.mixedArray.map(pl => {
                const elementPos = products.map(x => { return x.id; }).indexOf(pl.id);
                const objectFound = products[elementPos];
                if (objectFound) {
                    objectFound.is_added = pl.is_added;
                    return products
                }
            })
        }
        return products
    }

    OnCheckProducts(e, id, item) {
        this.pageArray = this.products;
        const checkValue = e.checked === true ? 1 : 0;
        item.is_added = checkValue;
        if (this.mixedArray.length > 0) {
            let result = this.isCheckedItem(item, this.mixedArray);
            if (result) {
                this.removeMixedItem(this.mixedArray, id)
            } else {
                this.mixedArray.push(item)
            }
        } else {
            this.mixedArray.push(item)
        }
    }

    removeMixedItem(items, id): void {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                items.splice(i--, 1);
            }
        }
    }

    isCheckedItem(item, mixedArray) {
        const result = mixedArray.map((mixedItem) => { return mixedItem.id; }).indexOf(item.id)
        return result >= 0 ? true : false;
    }

    saveManagedProducts() {

        this.mixedArray.map(item => {
            item.is_added === 1 ? this.checkedIds.push(item.id) : this.unCheckedIds.push(item.id)
        })

        const request = {
            product_ids: this.checkedIds,
            delete_product_ids: this.unCheckedIds
        }

        this.isManageLoading = true;

        this.dashboardService.updateManageProductService(this.salonId, this.brandId, request, (status, response) => {

            this.isManageLoading = false;
            if (status === ServiceResponse.success) {
                this.isManageClicked = false;
                this.page = 1
                this.callProductService();
                this.checkedIds = [];
                this.unCheckedIds = [];
                this.mixedArray = [];

            }

        })
    }

    isProductAdded(): boolean {
        if (this.products && this.products.length > 0) {
            return true
        } else {
            return this.searchString === '' ? false : true
        }
    }

    openDeleteDialog(listId: number, listTitle: string) {
        let dialogref = this.dialog.open(DeleteSalonComponent, {
            width: "330px",
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                listId,
                listType: 'product',
                listTitle,
                brandId: this.brandId
            },
        });
        dialogref.afterClosed().subscribe(response => {
            if (response) {
                this.checkPage();
                this.callProductService();
            }
        });
        dialogref.backdropClick().subscribe(response => {
            if (response) {
                this.checkPage();
                this.callProductService();
            }
        });
    }

    checkPage() {
        if (this.products && this.products.length === 1 && this.page > 1) {
            this.page = this.page - 1;
        }
    }

}
