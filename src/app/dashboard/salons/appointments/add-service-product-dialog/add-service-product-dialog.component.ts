import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ServiceResponse } from 'src/utils/enums';
import { AppointmentService } from '../appointment.service';
import { AppointmentActiveServices } from '../appointment.model';

@Component({
    selector: 'app-add-service-product-dialog',
    templateUrl: './add-service-product-dialog.component.html',
    styleUrls: ['./add-service-product-dialog.component.scss'],
})
export class AddServiceProductDialogComponent implements OnInit {

    searchString: string = "";
    currentPage: number = 1;
    salonId: number;
    offset = 10;
    type = "";
    price = "";
    isAddType = '';
    servicesList: AppointmentActiveServices[];
    providerServicesMap = new Map();
    servicesMap = new Map();
    // servicesList: Array<any>;
    productsList: Array<any>;
    checkedServicesData = [];
    isListEmpty: boolean = false;
    pageArray = [];
    mixedArray = [];
    addIdsArray = [];
    selectedServices = [];
    selectedProducts = [];
    isApiLoading: boolean;
    selectedValue
    isMoreBtnClicked: boolean;
    isServiceChecked: boolean = false;
    isProviderChecked: boolean = false;
    panelOpenState = false;
    requestDate = {};

    constructor(
        public appointmentService: AppointmentService,
        public activatedRoute: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<AddServiceProductDialogComponent>,
    ) { }

    ngOnInit() {
        this.addIdsArray = this.data.addIdsArray;
        const serviceData = this.data.selectedServices,
            productData = this.data.selectedProducts
        serviceData && serviceData.map(item => {
            this.selectedServices.push(item);
        })
        productData && productData.map(item => {
            this.selectedProducts.push(item);
        })
        this.requestDate = {
            'date': this.data.selectedDate
        }

        this.salonId = this.data.salonId;
        this.isAddType = this.data.type;
        if (this.data.type === 'Service') this.getServiceListData();
        if (this.data.type === 'Product') this.getProductsListData();

    }

    radioChange(service, provider, serviceTypeIndex, serviceIndex, providerIndx) {

        this.providerServicesMap.set(service.service_id, service.provider_services);
        this.setServiceTypesInMap(service, provider, serviceTypeIndex, serviceIndex, providerIndx);
        if (this.checkedServicesData && this.checkedServicesData.length > 0) {
            let checkedServiceIndex = this.checkedServicesData.findIndex(item => item.service_id === service.service_id);
            if (checkedServiceIndex > -1) {
                this.checkedServicesData.splice(checkedServiceIndex, 1);
                this.checkedServicesData.push({
                    'service_id': service.service_id,
                    'service': service.service_name,
                    'provider_id': provider.provider_id,
                    'provider_name': provider.provider_name,
                    'price': provider.price,
                    ...this.getRewardIds(service.rewards, provider.price)

                });
            } else {
                this.checkedServicesData.push({
                    'service_id': service.service_id,
                    'service': service.service_name,
                    'provider_id': provider.provider_id,
                    'provider_name': provider.provider_name,
                    'price': provider.price,
                    ...this.getRewardIds(service.rewards, provider.price)
                });
            }

        } else {
            this.checkedServicesData.push({
                'service_id': service.service_id,
                'service': service.service_name,
                'provider_id': provider.provider_id,
                'provider_name': provider.provider_name,
                'price': provider.price,
                ...this.getRewardIds(service.rewards, provider.price)
            });
        }

        this.selectedServices = [...this.checkedServicesData]

    }

    setServiceTypesInMap(service, provider, serviceTypeIndex, serviceIndex, providerIndx) {

        for (let entry of this.providerServicesMap.entries()) {

            if (entry[0] === service.service_id) {
                this.servicesList[serviceTypeIndex].salon_services[serviceIndex].isServiceChecked = true;
                entry[1].map(item => {
                    if (item.provider_id === provider.provider_id) {
                        this.servicesList[serviceTypeIndex].salon_services[serviceIndex].provider_services[providerIndx]['isChecked'] = true;
                    } else {
                        item.isChecked = false;
                    }
                })
            }
        }
    }

    getRewardIds(rewardItem, price) {
        if (rewardItem && rewardItem.length > 0) {
            return {
                'reward_id': rewardItem[0].reward_id,
                'discount': rewardItem[0].discount,
                'discount_price': (price - (price * rewardItem[0].discount / 100)).toFixed(2)

            }
        } else {
            return { 'discount_price': price }

        }
    }
    onChangeServiceCheck(serviceTypeIndex, serviceIndex) {

        this.servicesList[serviceTypeIndex].salon_services[serviceIndex].isServiceChecked = false;
        this.servicesList[serviceTypeIndex].salon_services[serviceIndex].provider_services.map(item => item.isChecked = false);
        let index = this.checkedServicesData.findIndex(item => item.service_id);

        if (index > -1) {
            this.checkedServicesData.splice(index, 1);
        }
        this.selectedServices = [...this.checkedServicesData]

    }

    getServiceListData() {
        this.isApiLoading = true;
        this.appointmentService.appointmentDiscountActiveServices(this.requestDate, this.salonId, (status, response) => {
            this.isApiLoading = false;
            if (status === ServiceResponse.success) {

                this.isListEmpty = false;
                this.servicesList = response.services;

                this.servicesList.map(data => {

                    this.servicesMap.set(data.service_type, data.salon_services);
                    this.selectedServices.map(selectedValue => {
                        data.salon_services.map((serviceItem, serviceIndex) => {
                            this.providerServicesMap.set(serviceItem.service_id, serviceItem.provider_services);

                            if (selectedValue.service_id === serviceItem.service_id) {
                                data.salon_services[serviceIndex].isServiceChecked = true;
                                serviceItem.provider_services.map((providerItem) => {

                                    if (selectedValue.provider_id === providerItem.provider_id) {
                                        providerItem['isChecked'] = true;
                                        this.checkedServicesData.push(
                                            {
                                                'service_id': serviceItem.service_id,
                                                'service': serviceItem.service_name,
                                                'provider_id': providerItem.provider_id,
                                                'provider_name': providerItem.provider_name,
                                                'price': providerItem.price,
                                                ...this.getRewardIds(serviceItem.rewards, providerItem.price)
                                            });
                                    } else {
                                        providerItem['isChecked'] = false;
                                    }

                                });

                            }
                        });

                    });
                    data.salon_services.map((serviceItem) => {
                        this.providerServicesMap.set(serviceItem.service_id, serviceItem.provider_services);
                        if (serviceItem.max_price == '0.00') {

                            const max = serviceItem.provider_services.reduce((acc, val) => {

                                return Math.trunc(+acc.price) > Math.trunc(+val.price) ? acc : val;
                            });
                            return serviceItem['provider_max_price'] = max.price;
                        }
                    })
                });

            } else if (status === ServiceResponse.emptyList) {
                this.isListEmpty = true;
            }

        });

    }

    getProductsListData() {
        this.isApiLoading = true;
        this.appointmentService.appointmentDiscountProductsList(this.requestDate, this.salonId, (status, response) => {
            this.isApiLoading = false;
            if (status === ServiceResponse.success) {
                this.productsList = response.product_types;
                this.productsList.map((productData, productListIndex) => {
                    productData.products.map((product, productIndex) => {
                        this.selectedProducts.map(item => {
                            if (item.id === product.id) {
                                this.productsList[productListIndex].products[productIndex]['isChecked'] = true;
                            }

                        })
                    })

                })
                // this.addCheckedProducts();
            } else if (status === ServiceResponse.emptyList) {

                this.isListEmpty = true;
            }
        });
    }

    addCheckedProducts() {
        if (this.data.addIdsArray.length > 0) {
            this.mixedArray = [];
            this.mixedArray = this.data.addIdsArray;
            if (this.productsList && this.productsList.length > 0) {
                for (let i = 0; i <= this.productsList.length - 1; i++) {
                    for (let j = 0; j <= this.data.addIdsArray.length - 1; j++) {
                        for (let k = 0; k <= this.productsList[i].products.length - 1; k++) {
                            this.productsList[i].products.filter(x => {
                                if (this.productsList[i].products[k].id == this.data.addIdsArray[j].id) {
                                    this.productsList[i].products[k].isChecked = true;
                                    return this.productsList[i].products[k];
                                }

                            });
                        }
                    }
                }

            } else { }
        } else { }
    }

    onClickCheckBox(id, row) {
        const isProductFound = this.selectedProducts.findIndex(item => item.id === id);
        if (isProductFound !== -1) {
            this.selectedProducts.splice(isProductFound, 1)
        } else {
            if (row.rewards.length > 0) {
                row['reward_id'] = row.rewards[0].reward_id;
                row['discount'] = row.rewards[0].discount;
                row['discount_price'] = (row.price - (row.price * row.rewards[0].discount / 100)).toFixed(2);
            } else {
                row['discount_price'] = row.price;

            }
            this.selectedProducts.push(row);
        }

        this.selectedProducts = [...new Set(this.selectedProducts)]
    }

    onClickAddServices() {
        this.dialogRef.close(
            {
                addIdsArray: this.checkedServicesData,
                selectedServices: this.selectedServices,
                type: this.data.type
            });
    }

    applyFilter() {
        this.dialogRef.close(
            {
                addIdsArray: this.mixedArray,
                selectedProducts: this.selectedProducts,
                type: this.data.type
            });
    }

    showRadioGroup() {
        this.isMoreBtnClicked = !this.isMoreBtnClicked
    }

}
