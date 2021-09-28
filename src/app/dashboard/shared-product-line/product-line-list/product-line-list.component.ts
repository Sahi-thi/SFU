import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteSalonComponent } from 'src/app/shared/delete-salon/delete-salon.component';
import { ServiceResponse, UserRole } from '../../../../utils/enums';
import { MetaData, BrandListResponse, Brands } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';
import { ProductLineFilterComponent } from '../product-line-filter/product-line-filter.component';
import { ProductLineDataSource } from './product-line-list-datasource';
import { ProductLineAddComponent } from '../../product-lines/product-line-add/product-line-add.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-product-line-list',
    templateUrl: './product-line-list.component.html',
    styleUrls: ['./product-line-list.component.scss']
})
export class ProductLineListComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;
    superAdminColumns: string[] = ['brand', 'edit', 'delete'];
    adminColumns: string[] = ['brand'];
    skeletonHead: string[] = ['Brand'];
    mainSkeletonHead: string[] = ['Brand', '', ''];
    skeletonColumn: string[] = ['Brand'];
    mainSkeletonColumn: string[] = ['', 'w-40', 'w-40'];
    productLineDataSource: ProductLineDataSource;
    productLineResponse: BrandListResponse;
    productLineDataSub: Subscription;
    productLineLoaderSub: Subscription;
    productLineEmptySub: Subscription;
    pageArray = [];
    mixedArray = [];
    brands: Brands[];
    metaData: MetaData;
    isLoadingAPI: boolean;
    isManageClicked = false;
    isManageLoading = false;
    isManageProductLineEmpty = false;
    isProductLinesEmpty: boolean;
    unCheckedIds = [];
    checkedIds = [];
    salonId = null;
    searchString = "";
    manageSearchString = "";
    type = null;
    currentPage = 1;
    headerTab = "";
    isSuperAdmin = false;
    offset = 10;
    status: string = "";
    filteredItems

    constructor(
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private router: Router,
        private dashboardService: DashboardService,
    ) { }

    ngOnInit() {

        this.headerTab = localStorage.getItem('headerTab');
        this.isSuperAdmin = UserRole.superAdmin === localStorage.getItem('userRole');
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            }
        });

        this.dashboardService.productLineFilteredDetails.subscribe((details) => {
            if (details) {
                this.type = details.type,
                    this.searchString = details.searchString,
                    this.currentPage = details.page
            }
        });

        this.getProductLinesData();
        this.subscribeData();
    }

    getProductLinesData() {
        if (this.dashboardService.listCurrentPage != -1) {
            this.currentPage = this.dashboardService.listCurrentPage
        }
        this.productLineDataSource = new ProductLineDataSource(this.dashboardService, this.titleService);
        this.productLineDataSource.getProductLines(this.salonId, this.offset, this.currentPage, this.searchString, this.type);
    }

    subscribeData() {
        this.productLineDataSub = this.productLineDataSource.observeProductLineResponse.subscribe(servicesData => {
            this.productLineResponse = servicesData;
            this.brands = this.finalProductLines(servicesData.brands);
            this.metaData = this.productLineResponse.meta_data;
        });
        this.productLineLoaderSub = this.productLineDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });
        this.productLineEmptySub = this.productLineDataSource.observeProductLineEmpty.subscribe(isListEmpty => {
            this.isProductLinesEmpty = isListEmpty;
        });
    }

    ngOnDestroy() {
        this.searchString = "";
        this.currentPage = 1;
        if (!!this.productLineEmptySub) this.productLineEmptySub.unsubscribe();
        if (!!this.productLineLoaderSub) this.productLineLoaderSub.unsubscribe();
        if (!!this.productLineDataSub) this.productLineDataSub.unsubscribe();

    }

    finalProductLines(productLines) {
        if (this.mixedArray.length) {
            this.mixedArray.map(pl => {
                // productLines
                const elementPos = productLines.map(x => { return x.id; }).indexOf(pl.id);
                const objectFound = productLines[elementPos];
                if (objectFound) {
                    objectFound.is_added = pl.is_added;
                    return productLines
                }
            })
        }
        return productLines
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.isManageClicked !== true ? this.productLineDataSource.getProductLines(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.type
        ) :
            this.productLineDataSource.getManageProductLines(
                this.salonId,
                this.offset,
                this.currentPage,
                this.manageSearchString
            );
    }

    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.productLineDataSource.getProductLines(
            this.salonId,
            this.offset,
            this.currentPage,
            this.searchString,
            this.type
        )
    }

    manageSearchSalon(searchString) {
        this.manageSearchString = searchString
        this.productLineDataSource.getManageProductLines(
            this.salonId,
            this.offset,
            1,
            this.manageSearchString
        );
    }

    clearSearch() {
        if (this.isManageClicked) {
            this.manageSearchString = ''
            this.productLineDataSource.getManageProductLines(
                this.salonId,
                this.offset,
                this.currentPage,
                this.manageSearchString
            );
        } else {

            this.searchString = "";
            this.productLineDataSource.getProductLines(
                this.salonId,
                this.offset,
                this.currentPage,
                this.searchString,
                this.type
            );
        }
    }

    openAddBrandDialog() {
        let dialogref = this.dialog.open(ProductLineAddComponent, {
            width: "365px",
            hasBackdrop: true,
            backdropClass: 'backdropBackground',
            data: {
                operationIs: 'add'
            }
        });
        dialogref.afterClosed().subscribe(response => {
            if (response !== undefined) {
                this.productLineDataSource.getProductLines(
                    this.salonId,
                    this.offset,
                    this.currentPage,
                    this.searchString,
                    this.type
                );
            }
        })
    }

    openEditBrandDialog(event, ele) {
        event.stopPropagation();

        this.navigationDetails();
        let dialogref = this.dialog.open(ProductLineAddComponent, {
            width: "365px",
            hasBackdrop: true,
            backdropClass: 'backdropBackground',
            data: {
                operationIs: 'edit',
                brandName: ele.brand_name,
                brandId: ele.id
            }
        });
        dialogref.afterClosed().subscribe(response => {
            if (response !== undefined) {
                this.productLineDataSource.getProductLines(
                    this.salonId,
                    this.offset,
                    this.currentPage,
                    this.searchString,
                    this.type
                );
            }
        })
    }

    navigateToProducts(element, event) {
        event.stopPropagation();
        localStorage.setItem('brandName', element.brand_name)
        this.navigationDetails();
        this.router.navigate([element.id + '/products'], {
            relativeTo: this.activatedRoute,
        })
    }

    navigateToSalonProducts(row, event) {
        event.stopPropagation();
        if (!this.isManageClicked) {
            localStorage.setItem('productLineRow', JSON.stringify(row));
            localStorage.setItem('brandName', row.brand_name)
            this.router.navigate(['/home/salons/salon/' + this.salonId + '/brands/' + row.id + '/products'], {
                relativeTo: this.activatedRoute,
            })
            this.navigationDetails();
        }
    }

    navigationDetails() {
        this.filteredItems = {
            type: this.type,
            searchString: this.searchString,
            page: this.currentPage
        }
        this.dashboardService.productLineFilteredDetails.next(this.filteredItems);
    }

    openFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;
        let dialogref = this.dialog.open(ProductLineFilterComponent, {
            width: "330px",
            position: { right: right + 'px', top: top + 'px' },
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                type: this.type,
                searchString: this.searchString,
            },
        });
        dialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.type = response.type;
                this.searchString = response.searchString;
                this.currentPage = 1;
                this.productLineDataSource.getProductLines(
                    this.salonId,
                    this.offset,
                    this.currentPage,
                    this.searchString,
                    this.type
                );
            }
        })
    }

    openDeleteDialog(event, listId: number) {
        event.stopPropagation();
        let dialogref = this.dialog.open(DeleteSalonComponent, {
            width: "330px",
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                listId,
                listType: 'brand'
            },
        });
        dialogref.afterClosed().subscribe(response => {
            if (this.brands && this.brands.length === 1 && this.searchString === '' && this.currentPage !== 1) {
                this.currentPage = this.currentPage - 1;
            } else {
                this.currentPage = this.currentPage;
            }
            response && this.productLineDataSource.getProductLines(
                this.salonId,
                this.offset,
                this.currentPage,
                this.searchString,
                this.type,
            );

        })
    }

    // isProductLinesAdded(): boolean {
    //     if (this.brands) {
    //         return true
    //     } else {
    //         return this.searchString === '' && this.type === null ? false : true
    //     }
    // }

    isSalonMenu(): boolean {
        return this.headerTab !== 'Studios' ? true : false;
    }

    manageProductLines() {
        this.isManageClicked = true;
        this.adminColumns =
            ['select', 'brand', 'added_label']
        this.currentPage = 1;
        this.productLineDataSource.getManageProductLines(this.salonId, this.offset, this.currentPage, this.manageSearchString);
    }

    cancelManagedProductLines() {
        this.isManageClicked = false;
        this.adminColumns = ['brand'];
        this.currentPage = 1;
        this.productLineDataSource.getProductLines(this.salonId, this.offset, this.currentPage, this.searchString, this.type);
    }

    onClickCheckBox(e, id, item) {
        this.pageArray = this.brands;
        const checkValue = e.checked === true ? 1 : 0;
        item.is_added = checkValue;
        // Have to check the mixed array id and clicked row Id to remove old Id. 
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

    saveManageProductLine() {
        this.mixedArray.map(item => {
            item.is_added === 1 ? this.checkedIds.push(item.id) : this.unCheckedIds.push(item.id)
        })

        const request = {
            brand_ids: this.checkedIds,
            delete_brand_ids: this.unCheckedIds
        }

        this.isManageLoading = true;

        this.dashboardService.updateSalonBrandsService(request, this.salonId, (status, response) => {
            this.currentPage = 1;
            this.isManageLoading = false;
            if (status === ServiceResponse.success) {
                this.adminColumns =
                    ['brand'];

                this.isManageClicked = !this.isManageClicked;
                this.productLineDataSource.getProductLines(this.salonId, this.offset, this.currentPage, this.searchString, this.type);
                this.mixedArray = [];
                this.checkedIds = [];
                this.unCheckedIds = [];
            }

        })
    }

}
