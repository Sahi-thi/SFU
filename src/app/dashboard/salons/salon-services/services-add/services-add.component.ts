import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ServiceDropdownResponse, ServiceTypes } from 'src/app/dashboard/dashboard.model';
import { Constants } from '../../../../../utils/constants';
import { ServiceResponse } from '../../../../../utils/enums';
import { Services } from '../../../dashboard.model';
import { DashboardService } from '../../../dashboard.service';
import { ServicesService } from '../services.service';

@Component({
    selector: 'app-services-add',
    templateUrl: './services-add.component.html',
    styleUrls: ['./services-add.component.scss']
})
export class ServicesAddComponent implements OnInit {
    serviceDropdownResponse: ServiceDropdownResponse;
    serviceTypes: ServiceTypes[];
    services: Services;
    servicesFormGroup: FormGroup;
    serviceTitle = "Add Service"
    btnTitle = "ADD"
    isServicesTypesLoading: boolean;
    isLoadingAPI: boolean;
    isFormAPICalling: boolean;
    isFromDetails = false;
    salonId: number;
    serviceId: number;
    responseMessage = '';
    validateErrorMessage = '';
    isMaxPrice: boolean = true;
    filteredDetails;
    isWaxingForm;
    isFacialForm;
    facialFormValue;
    waxingFormValue;
    disableCheckBoxes: boolean;
    constructor(
        public location: Location,
        private titleService: Title,
        public activatedRoute: ActivatedRoute,
        public dashboardService: DashboardService,
        public servicesService: ServicesService,

    ) { }

    ngOnInit() {
        this.getServicesTypes();
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id']) {
                this.salonId = params['salon_id'];
                this.serviceId = params['service_id'];
            }
        });
        this.addServiceData();
        if (this.serviceId) {
            this.btnTitle = localStorage.getItem('btnTitle');
            this.serviceTitle = localStorage.getItem('serviceTitle');
            this.isFromDetails = JSON.parse(localStorage.getItem('isFromDetails'));
            this.callDetailsService();
        } else {
            this.disableCheckBoxes = false;
            this.titleService.setTitle(Constants.skinForYou + 'Add Service');
        }

        this.servicesService.servicesFilteredDetails.subscribe((details) => {
            if (details) {
                this.filteredDetails = details;
            }
        })

    }

    validate(evt) {
        this.validateErrorMessage = '';
        if ((evt.keyCode > 47 && evt.keyCode < 58) || (evt.keyCode > 36 && evt.keyCode < 41) || evt.keyCode == 8) return true;
        else return false;
    }

    onChangeFacialForm(event) {
        console.log({ event });
        this.isFacialForm = event.checked;
        this.facialFormValue = event.checked === true ? 2 : '';
        console.log(this.isFacialForm);

    }

    onChangeWaxingForm(event) {
        console.log({ event });
        this.isWaxingForm = event.checked;
        this.waxingFormValue = event.checked === true ? 3 : '';

        console.log(this.isWaxingForm);

    }

    callDetailsService() {
        this.isLoadingAPI = true;
        this.servicesService.salonServicesDetailsAPI(this.salonId, this.serviceId, (status, response) => {
            this.isLoadingAPI = false;
            if (status === ServiceResponse.success) {
                this.services = response.service;
                this.setServiceFormData();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    setServiceFormData() {
        if (this.btnTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Service-Details');
            this.servicesFormGroup.disable()
            this.disableCheckBoxes = true;

        } else {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Service');
            this.servicesFormGroup.enable();
            this.disableCheckBoxes = false;
        }
        const services = this.services;
        this.servicesFormGroup.setValue({
            service_type: services.type_id,
            service: services.service,
            min_price: Math.trunc(+services.min_price),
            max_price: Math.trunc(+services.max_price),
            description: services.description,
        });
        if (services.forms_required) {
            this.isFacialForm = services.forms_required.is_facial ? true : false;
            this.isWaxingForm = services.forms_required.is_waxing ? true : false;
            this.waxingFormValue = services.forms_required.is_waxing;
            this.facialFormValue = services.forms_required.is_facial;
        } else {
            this.isFacialForm = false;
            this.isWaxingForm = false;
        }

        console.log(this.isFacialForm, this.facialFormValue);
        console.log(this.isWaxingForm, this.waxingFormValue);

    }

    addServiceData() {
        this.servicesFormGroup = new FormGroup({
            service_type: new FormControl("", Validators.required),
            service: new FormControl("", [Validators.required]),
            min_price: new FormControl('', [Validators.required]),
            max_price: new FormControl(''),
            description: new FormControl("", [Validators.required, Validators.maxLength(150)]),
        })
    }

    submitServiceForm() {
        this.validateErrorMessage = ''
        if (this.btnTitle === 'EDIT') {
            this.enableEditMode()
        } else {
            this.checkMaxPriceZeroValidation()
        }

    }

    cancelServiceForm(btnTitle: string) {
        this.validateErrorMessage = '';
        this.titleService.setTitle(Constants.skinForYou + 'Service-Details');

        if (btnTitle === 'SAVE' && this.isFromDetails) {
            const services = this.services;
            this.servicesFormGroup.controls.service_type.setValue(services.type_id);
            this.servicesFormGroup.controls.service.setValue(services.service);
            this.servicesFormGroup.controls.max_price.setValue(Math.trunc(+services.max_price));
            this.servicesFormGroup.controls.min_price.setValue(Math.trunc(+services.min_price));
            this.servicesFormGroup.controls.description.setValue(services.description);

            this.disableEditMode();
        } else {
            this.location.back();
        }
        this.servicesService.servicesFilteredDetails.next(this.filteredDetails)

    }

    callAddServices() {

        this.isFormAPICalling = true;
        this.servicesFormGroup.value['forms_required'] = this.addFormsRequest();
        this.servicesService.salonServicesAddAPI(this.salonId, this.servicesFormGroup.value, (status, response) => {
            this.isFormAPICalling = false;
            if (status === ServiceResponse.success) {
                this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })

    }

    checkMaxPriceZeroValidation() {
        if (this.servicesFormGroup.valid) {

            const minValue = +this.servicesFormGroup.controls.min_price.value;
            const maxValue = +this.servicesFormGroup.controls.max_price.value;
            console.log({ minValue });
            console.log({ maxValue });

            if (maxValue == 0) {
                const requestData = this.servicesFormGroup.value
                console.log({ requestData });
                for (var item in requestData) {
                    if (requestData[item] === "" || requestData[item] === null || requestData[item] === 0) {
                        delete requestData[item];
                    }
                }
                console.log({ requestData });
                this.btnTitle === 'ADD' ? this.callAddServices() : this.callEditServices();

            } else if (minValue < maxValue) {
                this.btnTitle === 'ADD' ? this.callAddServices() : this.callEditServices();

            } else {
                this.validateErrorMessage = 'Max price must be greater than min price ';
            }
        }
    }

    callEditServices() {

        this.isFormAPICalling = true;
        this.servicesFormGroup.value['forms_required'] = this.addFormsRequest();
        this.servicesService.salonServicesUpdateAPI(this.salonId, this.serviceId, this.servicesFormGroup.value, (status, response) => {
            this.isFormAPICalling = false;
            if (status === ServiceResponse.success) {
                this.btnTitle === 'SAVE' && this.isFromDetails ? this.disableEditMode() : this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })

    }

    addFormsRequest() {
        let formObj = {};
        if (this.isFacialForm) {
            formObj['is_facial'] = this.facialFormValue;
        }
        if (this.isWaxingForm) {
            formObj['is_waxing'] = this.waxingFormValue;
        }
        if (!this.isFacialForm && !this.isWaxingForm) {
            return {}
        }
        return formObj
    }

    enableEditMode() {
        this.servicesFormGroup.enable();
        this.btnTitle = 'SAVE';
        this.serviceTitle = 'Edit';
        this.disableCheckBoxes = false;
        this.titleService.setTitle(Constants.skinForYou + 'Edit-Service');
    }

    disableEditMode() {
        this.servicesFormGroup.disable();
        this.btnTitle = 'EDIT';
        this.titleService.setTitle(Constants.skinForYou + 'Service Details')
        this.serviceTitle = this.serviceTitle = localStorage.getItem('serviceTitle');
        this.disableCheckBoxes = true;
    }

    onSelectServiceType(e, type) {

        if (e.isUserInput) {
            localStorage.setItem('serviceTitle', type)
        }
    }

    getServicesTypes() {
        this.isLoadingAPI = true;
        this.dashboardService.serviceTypeDropdown((status, response) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.serviceDropdownResponse = response;
                this.serviceTypes = this.serviceDropdownResponse.serviceTypes;

            }
        });
    }

}
