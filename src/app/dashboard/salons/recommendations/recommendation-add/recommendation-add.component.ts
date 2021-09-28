import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Products } from 'src/app/dashboard/dashboard.model';
import { Constants } from 'src/utils/constants';
import { CustomValidators } from 'src/utils/customValidators';
import { ServiceResponse } from '../../../../../../src/utils/enums';
import { ActiveServicesResponse, FrequenciesResponse, GetRecommendationDetails, GetRecommendationDetailsResponse, RecommendationProductDetails, RecommendTypes, Services, Frequencies, RitualArray } from '../recommendation.model';
import { RecommendationService } from '../recommendation.service';

@Component({
    selector: 'app-recommendation-add',
    templateUrl: './recommendation-add.component.html',
    styleUrls: ['./recommendation-add.component.scss']
})
export class RecommendationAddComponent implements OnInit {
    recommendTypes: RecommendTypes[] = [
        { id: 'Service', value: 'Services' },
        { id: 'Product', value: 'Products' }
    ];
    recommendFormGroup: FormGroup;
    recommendationDetailResponse: GetRecommendationDetailsResponse;
    requestObject: RecommendationProductDetails = null;
    recommendationDetails: GetRecommendationDetails;
    productFrequencies: FrequenciesResponse;
    frequencies: Frequencies[];
    activeServicesResponse: ActiveServicesResponse;

    companiesList: Array<any>;
    clientsList: Array<any>
    productsList: Products[];
    services: Services[];
    preferredRitual = [];
    serviceTypes = [];
    ritualData = [];
    productUsingFrequency = [];
    productUsingFrequencyIds = [];
    isFrequencyDatesChecked = [];
    rituals: RitualArray[] = Constants.ritualData;

    isCallingRecommendation: boolean;
    isDropDownApi: boolean;
    isFromProduct: boolean;
    isLoadingAPI: boolean;
    isEditSalon: boolean;
    isEmptyCompaniesList = false;
    isEmptyClientList = false;
    isEmptyProducts = false;
    isFromDetails = false;
    isMorningRitual = false;
    isEveningRitual = false;
    isDisabled = false;

    recommendationTitle = "Add"
    recommendValue = 'Product';
    buttonTitle = "ADD";
    selectedProducts = "";
    selectedCompany = "";
    responseMessage = '';
    searchString = "";
    phoneNumber = "";
    email = '';

    recommendationId: number;
    masterProductId: number;
    productId: number;
    clientId: number;
    brandId: number;
    salonId: number;
    currentPage = 1;
    offset = 10;

    filterDetails;

    constructor(public recommendationService: RecommendationService, private activatedRoute: ActivatedRoute,
        public location: Location,
        public titleService: Title) { }

    ngOnInit() {
        this.isFromProduct = JSON.parse(localStorage.getItem('isProduct'));
        this.activatedRoute.params.subscribe((params) => {
            this.salonId = params['salon_id'];
            this.recommendationId = params['id'];

        });
        this.rituals.map(item => item.isChecked = false);

        this.getProductFrequencies();
        this.getDropdownDetails("");
        this.getClientsListData("");
        this.getActiveServiceList('');
        this.addRecommendData();

        if (this.recommendationId) {

            this.buttonTitle = localStorage.getItem('btnTitle');
            this.recommendationTitle = localStorage.getItem('recommendationTitle');
            this.isFromDetails = JSON.parse(localStorage.getItem('isFromDetails'));

        } else this.titleService.setTitle(Constants.skinForYou + 'Add Recommendation');

        this.recommendationService.recommendationFilteredDetails.subscribe((details) => {
            if (details) {
                this.filterDetails = details;
            }
        })

    }

    onSelectionChangeRecommendType(e) {
        this.isFromProduct = e.value === 'Product' ? true : false;
        if (this.isFromProduct) {

            this.recommendFormGroup.controls.service_type.setValue('')
            this.recommendFormGroup.controls.service_id.setValue('')
            this.recommendFormGroup.controls.brand_id.enable();
            this.recommendFormGroup.controls.service_type.disable();
            this.recommendFormGroup.controls.service_id.disable();
        } else {

            this.recommendFormGroup.controls.brand_id.setValue('')
            this.recommendFormGroup.controls.product_id.setValue('')
            this.recommendFormGroup.controls.service_type.enable();
            this.recommendFormGroup.controls.brand_id.disable();
            this.recommendFormGroup.controls.product_id.disable();
        }
    }

    getDropdownDetails(search) {
        // console.log("getDropdownDetails");

        this.isDropDownApi = true;
        this.isEmptyCompaniesList = true;
        this.recommendationService.RecommendationDetailsService(this.salonId, search, (status, response) => {
            this.isDropDownApi = false;
            if (status === ServiceResponse.success) {
                this.isEmptyCompaniesList = false;
                this.companiesList = response.brands;
                if (this.isFromProduct && this.recommendationId) {
                    this.callRecommendationDetails()
                } else if (this.recommendationId) {
                    this.callRecommendationDetails()
                }
            } else if (status === ServiceResponse.emptyList) {
                this.isEmptyCompaniesList = true;
                if (this.recommendationId) {
                    this.callRecommendationDetails()
                }
            }
        });
    }

    getCompanyDetails(search) {
        this.recommendationService.RecommendationDetailsService(this.salonId, search, (status, response) => {
            if (status === ServiceResponse.success) {
                this.companiesList = response.brands;
            }
        });
    }

    callRecommendationDetails() {
        // console.log("callRecommendationDetails");

        this.recommendationService.getRecommendationDetailsService(this.salonId, this.recommendationId, (status, response) => {
            if (status === ServiceResponse.success) {
                this.recommendationDetailResponse = response;
                this.recommendationDetails = this.recommendationDetailResponse.recommendation;
                this.setRecommendationData();
            } else {
                this.responseMessage = response.message;
            }
        });
    }

    setRecommendationData() {
        const recommendation = this.recommendationDetails,
            formControl = this.recommendFormGroup.controls

        this.formatePhoneNumber(recommendation.phone_number);

        if (this.buttonTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Recommendation-Details');
            this.recommendFormGroup.disable();
            this.isDisabled = !this.isDisabled;

        } else {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Recommendation');
            this.recommendFormGroup.enable();
            this.isDisabled = false;
        }

        formControl.client_name.setValue(recommendation.client_name);
        formControl.email.setValue(recommendation.email);
        formControl.notes.setValue(recommendation.notes);
        formControl.phone_number.setValue(this.phoneNumber);
        formControl.recommendation_for.setValue(recommendation.recommendation_for);

        if (this.isFromProduct) {
            const productDetails = recommendation.products;
            productDetails.map(item => {
                formControl.brand_id.setValue(item.brand_name);
                formControl.product_id.setValue(item.product_name);
                this.masterProductId = +item.brand_id;
                this.brandId = +item.brand_id;
                this.productId = item.product_id;
                this.preferredRitual = item.preferred_ritual;
                this.productUsingFrequencyIds = item.product_frequency_id;
            });

            this.productUsingFrequencyIds && this.productUsingFrequencyIds.map(item => {
                this.frequencies.map(type => {
                    if (item === type.id) {
                        type.isChecked = true;
                    }
                });
            });

            this.preferredRitual && this.preferredRitual.map(item => {
                this.rituals.map(type => {
                    if (item === type.id) {
                        type.isChecked = true;
                    }
                })
            });

            this.getProductsList('');
            formControl.service_type.disable();
            formControl.service_id.disable();

        } else {
            const serviceDetails = recommendation.services;
            let serviceType;

            serviceDetails.map(item => {
                serviceType = item.service_type;
                formControl.service_type.setValue(item.service_type);
                formControl.service_id.setValue(item.service_id);
            });

            this.activeServicesResponse.services.map(item => {
                if (item.service_type === serviceType) {
                    this.services = [...item.services]
                }
            });
            formControl.product_id.disable();
            formControl.brand_id.disable();
        }

        this.clientId = recommendation.client_id;

        formControl.client_name.disable();
        formControl.email.disable();
        formControl.phone_number.disable();
    }

    addRecommendData() {
        this.recommendValue = this.isFromProduct ? 'Product' : 'Service'

        this.recommendFormGroup = new FormGroup({
            client_name: new FormControl('', [Validators.required]),
            email: new FormControl({ value: "", disabled: this.isEditSalon }, [Validators.required, Validators.pattern(CustomValidators.email), CustomValidators.noWhitespaceValidator]),
            phone_number: new FormControl('', [Validators.required, Validators.minLength(14), Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]),
            recommendation_for: new FormControl('', [Validators.required]),
            notes: new FormControl("", [Validators.maxLength(150)]),

            brand_id: new FormControl({ value: "", disabled: this.isFromProduct ? false : true }, [Validators.required]),
            product_id: new FormControl({ value: "", disabled: true }, [Validators.required, CustomValidators.autocompleteObjectValidator()]),

            service_type: new FormControl({ value: "", disabled: this.isFromProduct ? true : false }, [Validators.required]),
            service_id: new FormControl({ value: "", disabled: true }, [Validators.required]),
        });

        this.recommendFormGroup.get('email').disable();
        this.recommendFormGroup.get('phone_number').disable();
        this.recommendFormGroup.controls.recommendation_for.setValue(this.recommendValue);
    }

    cancelRecommendationForm(buttonTitle: string) {
        this.titleService.setTitle(Constants.skinForYou + 'Recommendation-Details');
        if (buttonTitle === 'SAVE' && this.isFromDetails) {
            const recommendation = this.recommendationDetails;
            this.isFromProduct = JSON.parse(localStorage.getItem('isProduct'));
            this.recommendValue = this.isFromProduct ? 'Product' : 'Service'
            this.recommendFormGroup.controls.recommendation_for.setValue(this.recommendValue);
            this.recommendFormGroup.controls.notes.setValue(recommendation.notes);
            if (this.isFromProduct) {
                recommendation.products.map(item => {
                    this.recommendFormGroup.controls.brand_id.setValue(item.brand_name);
                    this.recommendFormGroup.controls.product_id.setValue(item.product_name);
                    this.preferredRitual = item.preferred_ritual;
                });
                this.preferredRitual && this.preferredRitual.map(item => {
                    this.rituals.map(type => {
                        if (item == type.id) {
                            type.isChecked = true;
                        }
                    });
                });

                this.productUsingFrequencyIds && this.productUsingFrequencyIds.map(item => {
                    this.frequencies.map(type => {
                        if (item === type.id) {
                            type.isChecked = true;
                        }
                    })
                });
            } else {
                recommendation.services.map(item => {
                    this.recommendFormGroup.controls.service_type.setValue(item.service_type);
                    this.recommendFormGroup.controls.service_id.setValue(item.service_id);
                });
            }
            this.disableEditMode();
        } else {
            this.location.back()
        }
        this.recommendationService.recommendationFilteredDetails.next(this.filterDetails)
    }

    onSelectionCompanyChanged(e) {

        const company = e.option.value;
        this.brandId = e.option.id;
        this.recommendFormGroup.controls.product_id.setValue(null);
        this.selectedCompany = company.trim();
        this.companiesList && this.companiesList.map(x => {
            if (this.brandId === x.brand_id) {
                this.masterProductId = x.brand_id
            }
        });
        this.recommendFormGroup.controls.product_id.enable();
        this.getProductsList("");
    }

    onSelectionProductChange(e) {
        this.productId = e.option.id;
        if (e.isUserInput) {
            this.selectedProducts = e.option.value;
        }
    }

    onSelectionClientChange(e) {
        this.email = this.clientsList.find(x => x.client_id === e.option.id).email;
        this.phoneNumber = this.clientsList.find(x => x.client_id === e.option.id).phone_number;
        this.formatePhoneNumber(this.phoneNumber);
        this.recommendFormGroup.controls.email.setValue(this.email);
    }

    onSelectionServiceType(e) {
        if (e.value) {
            this.recommendFormGroup.controls.service_id.setValue(null);
            this.recommendFormGroup.controls.service_id.enable();
            this.activeServicesResponse.services.map(item => {
                if (item.service_type === e.value) {
                    this.services = [...item.services]
                }
            });
        }
    }

    onSelectionService(e) { }

    getActiveServiceList(searchString) {
        this.recommendationService.SalonActiveServicesList(this.salonId, searchString, (status, response) => {
            this.isCallingRecommendation = false;
            if (status === ServiceResponse.success) {
                this.activeServicesResponse = response;
                this.activeServicesResponse.services.map(item => {
                    this.serviceTypes.push({ 'service_type': item.service_type })
                });
                this.isEmptyClientList = false;
            } else if (status === ServiceResponse.emptyList) {
                this.isEmptyClientList = true;
            }
        });
    }

    getProductsList(search) {
        this.recommendationService.productsListService(this.salonId, this.masterProductId, this.currentPage, this.offset, this.searchString, (status, response) => {
            if (status === ServiceResponse.success) {
                this.productsList = response.products;
            } else if (status === ServiceResponse.emptyList) {
                this.isEmptyProducts = true;
            }
        });
    }

    enableEditMode() {
        this.buttonTitle = "SAVE";
        this.recommendationTitle = "Edit";
        this.recommendFormGroup.enable();
        this.isDisabled = !this.isDisabled;
        this.recommendFormGroup.get('email').disable();
        this.recommendFormGroup.get('client_name').disable();
        this.recommendFormGroup.get('phone_number').disable();

        if (this.isFromProduct) {
            this.recommendFormGroup.get('service_type').disable();
            this.recommendFormGroup.get('service_id').disable();
        } else {
            this.recommendFormGroup.get('product_id').disable();
            this.recommendFormGroup.get('brand_id').disable();
        }
    }

    async submitRecommendationForm(buttonTitle: string) {
        if (buttonTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Recommendation');
            this.enableEditMode();
        } else {
            if (this.recommendFormGroup.valid) {
                await this.requestDetails();
                this.buttonTitle === 'ADD' ? this.callCreateRecommendation() : this.callEditRecommendation();
            }
        }
    }

    onClickAddRitual(type, isChecked) {

        if (this.preferredRitual.length > 0) {
            this.ritualData = [...this.preferredRitual];
        }
        if (isChecked) {
            this.ritualData.push(type.id);
        } else {
            const index = this.ritualData.findIndex(item => item == type.id);
            if (index !== -1) {
                this.ritualData.splice(index, 1)
            }
        }
        this.preferredRitual = [...new Set(this.ritualData)];

    }

    onClickFrequencies(type, isChecked) {
        if (this.productUsingFrequencyIds.length > 0) {
            this.productUsingFrequency = [...this.productUsingFrequencyIds]
        }
        this.frequencies.map(item => {
            if (item.id === type.id) {
                item.isChecked = !type.isChecked
            }
        });

        if (isChecked) {
            if (type.day === 'Daily') {
                this.frequencies.map(item => {
                    if (item.id !== type.id) {
                        item.isChecked = false;
                    } else {
                        console.log("Else Cons");

                    }
                });
                this.productUsingFrequency = [];
                this.productUsingFrequency.push(type.id);

            } else {
                this.removeDuplicates(8);
                this.frequencies.map(item => {
                    if (item.id === 8) {
                        item.isChecked = false;
                    } else {
                        console.log("Else Cons");
                    }
                });
                this.productUsingFrequency.push(type.id)
            }
        } else {
            this.removeDuplicates(type.id)
        }

        this.productUsingFrequencyIds = [...new Set(this.productUsingFrequency)];
    }

    removeDuplicates(typeId) {
        const index = this.productUsingFrequency.findIndex(item => item === typeId);
        if (index !== -1) {
            this.productUsingFrequency.splice(index, 1)
        }
    }

    toggleCheckedData(typeId) {
        this.frequencies.map(item => {
            if (item.id === typeId) {
                item.isChecked = false;
            } else {
                console.log("Else Cons");
            }
        });
    }

    async requestDetails() {
        if (this.buttonTitle === 'ADD') {
            this.recommendFormGroup.value.phone_number = "" + this.phoneNumber.replace(/[^0-9]/g, "");
        }
        this.requestObject = {
            ...this.recommendFormGroup.value,
        }
        const request = this.requestObject

        for (let item in request) {
            if (item === 'service_type') {
                delete request[item]
            }
            if (request[item] === "" || request[item] === null || request[item] === undefined) {
                delete request[item];
            }
        }
        const obj = this.requestObject;
        obj.client_name = this.requestObject.client_name;
        obj.email = this.email;
        obj.phone_number = this.requestObject.phone_number;
        obj.notes = this.requestObject.notes;
        if (this.isFromProduct) {
            obj.preferred_ritual = this.preferredRitual;
            obj.brand_id = this.brandId;
            obj.product_id = this.productsList.find(x => x.product_name === this.requestObject.product_id).id;
            obj.product_frequency_id = this.productUsingFrequencyIds;
        } else {
            obj.product_frequency_id = [];
            obj.preferred_ritual = [];
        }
        this.requestObject = obj;
    }

    getClientsListData(searchString) {
        this.offset = 1000;
        this.recommendationService.clientsListService(this.salonId, this.offset, this.currentPage, searchString, status, (status, response) => {
            this.isCallingRecommendation = false;
            if (status === ServiceResponse.success) {
                this.isEmptyClientList = false;
                this.clientsList = response.clients;
            } else if (status === ServiceResponse.emptyList) {
                this.isEmptyClientList = true;
            }
        });
    }

    callCreateRecommendation() {
        this.isCallingRecommendation = true;
        this.recommendationService.createRecommendationService(this.salonId, this.requestObject, (status, response) => {
            this.isCallingRecommendation = false;
            if (status === ServiceResponse.success) {
                this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    callEditRecommendation() {
        const request = this.editRecommendationRequest();

        this.isCallingRecommendation = true;

        this.recommendationService.updateRecommendationService(this.salonId, this.recommendationId, request, (status, response) => {
            this.isCallingRecommendation = false;
            if (status === ServiceResponse.success) {
                this.buttonTitle === 'SAVE' && this.isFromDetails ? this.disableEditMode() : this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    editRecommendationRequest() {

        let requestObject = {};
        requestObject['client_id'] = this.clientId;
        requestObject['recommendation_for'] = this.requestObject.recommendation_for;
        requestObject['notes'] = this.requestObject.notes;

        if (this.isFromProduct) {
            let productId: any = (this.productsList.find(x => x.product_name === this.requestObject.product_id)) ? this.productsList.find(x => x.product_name === this.requestObject.product_id).id : this.requestObject.product_id;
            requestObject['brand_id'] = this.brandId;
            requestObject['product_id'] = productId;
            requestObject['preferred_ritual'] = this.preferredRitual;
            requestObject['product_frequency_id'] = this.productUsingFrequencyIds;

        } else {
            requestObject['service_id'] = this.requestObject.service_id;
            requestObject['preferred_ritual'] = [];
            requestObject['product_frequency_id'] = [];

        }

        return requestObject;

    }

    disableEditMode() {
        this.buttonTitle = "EDIT";
        this.recommendationTitle = localStorage.getItem('recommendationTitle');;
        this.recommendFormGroup.value['phone_number'] = this.recommendationDetails.phone_number;
        this.recommendFormGroup.disable();
        this.isDisabled = !this.isDisabled;
    }

    searchCompany(searchCompany) {
        this.getCompanyDetails(searchCompany.trim());
    }

    searchClient(searchClient) {
        this.getClientsListData(searchClient.trim());
    }

    searchProduct(searchProduct) {
        this.getProductsList(searchProduct.trim());
    }

    formatePhoneNumber(phoneNumber) {
        phoneNumber.toString();
        if (phoneNumber.length <= 3) {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})/, '($1');
        } else if (phoneNumber.length <= 6) {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
        }
        this.phoneNumber = phoneNumber
        this.recommendFormGroup.controls.phone_number.setValue(phoneNumber);
    }

    public displayContactFn(company?): string | undefined {
        return company ? company : undefined
    }

    public displayProductFn(product?): string | undefined {
        return product ? product : undefined
    }

    public displayClientFn(client?): string | undefined {
        return client ? client : undefined
    }

    getProductFrequencies() {
        this.recommendationService.ProductFrequencies((status, response) => {
            if (status === ServiceResponse.success) {
                this.productFrequencies = response;
                this.frequencies = this.productFrequencies.frequencies;
                this.frequencies = this.frequencies.map(obj => ({ ...obj, isChecked: false }))
            }
        });
    }

}
