import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomValidators } from 'src/utils/customValidators';
import { Constants } from '../../../../utils/constants';
import { ServiceResponse } from '../../../../utils/enums';
import { ImageCropperComponent } from '../../../shared/image-cropper/image-cropper.component';
import { AmazonService } from '../../amazon.service';
import { ActiveServicesData, DaysStatus, ServiceDataList, ServiceDropdownResponse, ServicesData, ServiceTypes, States, StatesResponse, Status } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';
import { Frequencies, FrequenciesResponse, ProviderDetails, ProviderDetailsResponse } from '../salon.model';
import { SalonService } from '../salon.service';

@Component({
    selector: 'app-add-providers',
    templateUrl: './add-providers.component.html',
    styleUrls: ['./add-providers.component.scss']
})

export class AddProvidersComponent implements OnInit {
    @ViewChild('inputLogo', { static: false }) InputVar: ElementRef;

    officeDays: Frequencies[];
    officeIds = [];
    selectedDays = [];
    inOfficeResponse: FrequenciesResponse;
    statuses: Status[] = Constants.Statuses;
    days: DaysStatus[] = Constants.weekDays;
    statesResponse: StatesResponse;
    providerDetailsResponse: ProviderDetailsResponse;
    providerDetails: ProviderDetails;
    states: States[];
    ServiceDropdownResponse: ServiceDropdownResponse;
    serviceTypes: ServiceTypes[];
    providerFormGroup: FormGroup;
    activeServices: ActiveServicesData;
    servicesData: ServicesData[];
    onlyServicesPriceData: ServiceDataList[] = [];
    serviceListData: ServiceDataList[];
    serviceMapData = new Map();
    selectedOnlyService = new Map();
    serviceTypeMapData = new Map();
    isLoadingAPI: boolean;
    isUploading: boolean;
    isCallingProvider: boolean;
    isServicesListLoading: boolean;
    isDisabled = false;
    isFromDetails = false;
    salonId: number;
    providerId: number;
    selectedLogoFile: File;
    resourceFileName = '';
    requestObject: ProviderDetails = null;
    selectedState = "";
    phoneNumber = "";
    providerTitle = "Add Provider";
    buttonTitle = "ADD";
    responseMessage = "";
    fileName = "";
    imgURL = null;
    filterDetails;
    ownerDetails = null;
    tabTitle = "Add Provider";
    emptyServices = '';
    serviceSearchString = '';
    servicesList = [];
    selectedServices = [];
    isListEmpty = false;
    totalAddedServices = 1;
    serviceIdErrorMessage = '';
    inOfficeTimeError = '';
    servicesListEmptyMessage = '';
    setServiceData;
    priceValidationError = '';
    isPriceValidationError = false;
    copyProviderDetails
    copiedProviderSub: Subscription;
    providerFilterSub: Subscription;
    constructor(
        private dashboardService: DashboardService,
        private salonService: SalonService,
        private activatedRoute: ActivatedRoute,
        private amazonService: AmazonService,
        public location: Location,
        private titleService: Title,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.getInOfficeDays();
        this.servicesListEmptyMessage = "";
        this.ownerDetails = JSON.parse(localStorage.getItem(('ownerDetails')))
        this.addFormData();

        if (this.ownerDetails) {
            this.formatePhoneNumber()
        }

        this.getServices();
        this.getStates("");

        this.activatedRoute.params.subscribe((params) => {
            this.providerId = params['provider_id'];
            this.salonId = params['salon_id'];
        });

        this.copiedProviderSub = this.salonService.copyProviderDetails.subscribe((details) => {
            console.log({ details });
            if (details) {
                this.copyProviderDetails = details
            }
        })

        if (this.providerId) {
            this.buttonTitle = localStorage.getItem('btnTitle');
            this.providerTitle = localStorage.getItem('providerTitle');
            this.isFromDetails = JSON.parse(localStorage.getItem('isFromDetails'));
            this.callProviderDetails("editProvider");
            this.copyProviderDetails = '';
        } else if (this.copyProviderDetails && this.buttonTitle === 'ADD') {
            this.tabTitle = "Add Provider";
            this.titleService.setTitle(Constants.skinForYou + this.tabTitle);
            this.callProviderDetails('copiedProvider');
        } else {
            this.tabTitle = "Add Provider";
            this.titleService.setTitle(Constants.skinForYou + this.tabTitle);
            this.getServiceListData("");
            this.copyProviderDetails = '';
        };

        this.providerFilterSub = this.salonService.providerFilterDetails.subscribe((details) => {
            if (details) {
                this.filterDetails = details;
            }
        });
    }

    ngOnDestroy() {
        if (!!this.copiedProviderSub) this.copiedProviderSub.unsubscribe()
        if (!!this.providerFilterSub) this.providerFilterSub.unsubscribe()
    }

    callProviderDetails(providerFrom) {
        this.isLoadingAPI = true;
        console.log("copyProviderDetails", this.copyProviderDetails);

        if (this.copyProviderDetails && this.buttonTitle === 'ADD') {
            this.providerId = this.copyProviderDetails.provider_id
        }
        this.salonService.providerDetailsService(this.salonId, this.providerId, (status, response) => {
            this.isLoadingAPI = false;
            if (status === ServiceResponse.success) {
                this.providerDetailsResponse = response;
                this.providerDetails = this.providerDetailsResponse.provider;
                this.editServiceListData(providerFrom);
            } else {
                this.responseMessage = response.message;
            }
        });
    }

    editServiceListData(providerFrom) {
        this.serviceSearchString = '';
        this.dashboardService.salonActiveServicesAPI(this.salonId, this.serviceSearchString, (status, response) => {
            if (status === ServiceResponse.success) {
                this.emptyServices = '';
                this.activeServices = response;
                this.servicesData = this.activeServices.services;
                this.servicesData.map(item => this.onlyServicesPriceData.push(...item.services));
                this.isListEmpty = false;
                providerFrom === 'editProvider' ?
                    this.setProviderData() : this.setCopiedProviderData();
            } else if (status === ServiceResponse.emptyList) {
                this.isListEmpty = true;
                this.servicesList = [];
                this.servicesData = [];
                this.emptyServices = "No services Found";
            }
        });
    }

    setServicesToInputs(provider) {

        if (provider.services) {
            this.setServiceData.removeAt(0);
        }

        this.providerDetails.services.forEach((element, index) => {
            this.serviceTypeMapData.set('item_' + index, element.service_type);
        });

        this.servicesData.map((item) => {
            this.serviceMapData.set(item.service_type, item.services);
        });

        this.providerDetails.services.forEach((element) => {
            this.setServiceData.push(this.formBuilder.group({
                service_type: element.service_type,
                service_name: element.service_name,
                price: element.price,
                service_id: element.service_id
            }
            ));
        });

        this.selectedServices = this.providerDetails.services;
        this.totalAddedServices = this.selectedServices.length
    }

    async setCopiedProviderData() {
        this.setServiceData = this.providerFormGroup.get('services') as FormArray;
        const provider = this.providerDetails;

        this.setServicesToInputs(provider);

        const providerFormControl = this.providerFormGroup.controls

        this.imgURL = '';
        providerFormControl.name.setValue('')
        providerFormControl.email.setValue('')
        providerFormControl.status.setValue(provider.status)
        providerFormControl.city.setValue(provider.city)
        providerFormControl.state.setValue(provider.state);
        providerFormControl.phone_number.setValue(this.phoneNumber)
        this.officeIds = [...provider.in_office_timings];
        this.officeIds && this.officeIds.map(item => {
            this.officeDays.map(type => {
                if (item === type.id) {
                    type.isChecked = true;
                }
            });
        });
        this.providerFormGroup.controls.city.disable();
        this.providerFormGroup.controls.state.disable();
        this.providerFormGroup.controls.phone_number.disable();
    }

    async setProviderData() {
        this.setServiceData = this.providerFormGroup.get('services') as FormArray;
        const provider = this.providerDetails;

        this.setServicesToInputs(provider);
        this.imgURL = provider.provider_pic_thumb_url;
        if (this.buttonTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Provider-Details');
            this.providerFormGroup.disable();
            this.setServiceData.disable();
            this.isDisabled = !this.isDisabled;
        } else {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Provider');
            this.providerFormGroup.enable();
            this.isDisabled = false;
            this.disableServices();
        };
        const providerFormControl = this.providerFormGroup.controls

        this.imgURL = provider.provider_pic_thumb_url
        providerFormControl.name.setValue(provider.name)
        providerFormControl.email.setValue(provider.email)
        providerFormControl.status.setValue(provider.status)
        providerFormControl.city.setValue(provider.city)
        providerFormControl.state.setValue(provider.state);
        providerFormControl.phone_number.setValue(this.phoneNumber)
        this.officeIds = [...provider.in_office_timings];
        this.officeIds && this.officeIds.map(item => {
            this.officeDays.map(type => {
                if (item === type.id) {
                    type.isChecked = true;
                }
            });
        });
        this.providerFormGroup.controls.email.disable();
        this.providerFormGroup.controls.city.disable();
        this.providerFormGroup.controls.state.disable();
        this.providerFormGroup.controls.phone_number.disable();
    }

    addFormData() {
        this.providerFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required, CustomValidators.noWhitespaceValidator]),
            email: new FormControl("", [Validators.required, Validators.pattern(CustomValidators.email), CustomValidators.noWhitespaceValidator]),
            phone_number: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(14), Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]),
            city: new FormControl({ value: '', disabled: true }, Validators.required),
            state: new FormControl({ value: '', disabled: true }, [Validators.required, CustomValidators.autocompleteObjectValidator()]),
            status: new FormControl("", Validators.required),
            services: this.formBuilder.array([this.createServiceGroup()]),
        });
    }

    createServiceGroup(): FormGroup {
        let newGroup = new FormGroup({
            service_name: new FormControl('', [Validators.required]),
            service_id: new FormControl('', [Validators.required]),
            price: new FormControl('', [Validators.required, Validators.max(999999)]),
            service_type: new FormControl('', [Validators.required]),
        })
        return newGroup;
    }

    onClickAddService() {
        const serviceData = this.providerFormGroup.get('services') as FormArray;
        const arrayLength = serviceData.length
        if (this.providerDetails && this.providerDetails.services) {
            this.totalAddedServices = arrayLength + 1
        } else {
            this.totalAddedServices = this.totalAddedServices + 1
        }
        serviceData.push(this.createServiceGroup());
    }

    removeService(index, serviceData) {
        this.totalAddedServices = this.totalAddedServices - 1;
        this.setServiceData = this.providerFormGroup.get('services') as FormArray;
        if (this.setServiceData.length > 1) {
            this.setServiceData.removeAt(index);
        }
        if (this.selectedServices.length > 0) {
            this.selectedServices.map(item => {
                if (item.service_id === serviceData.controls.service_id.value) {
                    this.servicesList.push({
                        'service_name': serviceData.controls.service_name.value,
                        'service_id': serviceData.controls.service_id.value,
                        'min_price': item.min_price,
                        'max_price': item.max_price
                    })
                }
            })
        } else {
            if (serviceData.controls.service.value !== '') {
                this.servicesList.push({ 'service_name': serviceData.controls.service_name.value, 'service_id': serviceData.controls.service_id.value });
            }
        }
        try {
            for (let i = 0; i < this.serviceTypeMapData.size; i++) {
                if (this.serviceTypeMapData.size - 1 === i) {
                    this.serviceTypeMapData.delete('item_' + i);
                } else if (i >= +index) {
                    const key = 'item_' + i;
                    const newkey = 'item_' + (i + 1);
                    const nextValue = this.serviceTypeMapData.get(newkey);
                    this.serviceTypeMapData.set(key, nextValue);
                }
            }
            for (let i = 0; i < this.selectedOnlyService.size; i++) {
                if (this.selectedOnlyService.size - 1 === i) {
                    this.selectedOnlyService.delete('item_' + i);
                } else if (i >= +index) {
                    const key = 'item_' + i;
                    const newkey = 'item_' + (i + 1);
                    const nextValue = this.selectedOnlyService.get(newkey);
                    this.selectedOnlyService.set(key, nextValue);
                }
            }
        } catch (err) {
        }
    }
    submitProviderForm(buttonTitle: string) {

        this.emptyServiceMessage();

        if (buttonTitle === 'EDIT') {
            this.enableEditMode();
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Provider');

        } else {
            if (this.providerFormGroup.valid) {
                let servicesArray = this.providerFormGroup.controls.services.value,
                    isServices = servicesArray.filter(item => item.service_id === ''),
                    isPrice = servicesArray.filter(item => item.price === '');
                if (isServices.length === 0 && this.officeIds.length > 0 && isPrice.length === 0) {
                    if (this.selectedLogoFile) {
                        this.uploadImagesToS3();
                    } else {
                        this.requestDetails()
                        this.buttonTitle === 'ADD' ? this.callCreateProvider() : this.callEditProvider();

                    }

                } else {
                    this.serviceIdErrorMessage = isPrice.length === 0 ? "" : 'Please enter the valid price ';
                    this.inOfficeTimeError = this.officeIds.length > 0 ? "" : 'Please select In office timings ';
                    this.serviceIdErrorMessage = isServices.length === 0 ? "" : 'Please select the service from dropdown if there are no services please create a new service from services tab';
                }
            }
        }
    }

    cancelProviderForm(buttonTitle: string) {

        this.titleService.setTitle(Constants.skinForYou + 'Provider-Details');
        this.responseMessage = '';
        if (buttonTitle === 'SAVE' && this.isFromDetails) {
            const provider = this.providerDetails,
                providerFormControl = this.providerFormGroup.controls;

            this.setServicesToInputs(provider);
            providerFormControl.name.setValue(provider.name);
            providerFormControl.status.setValue(provider.status);

            this.officeIds = [...provider.in_office_timings];
            this.officeIds && this.officeIds.map(item => {
                this.officeDays.map(type => {
                    if (item === type.id) {
                        type.isChecked = true;
                    }
                })
            });
            this.disableEditMode();

        } else {
            this.location.back();
        }

        this.emptyServiceMessage();

        this.salonService.providerFilterDetails.next(this.filterDetails)
    }

    enableEditMode() {
        this.buttonTitle = "SAVE";
        this.providerTitle = "Edit";
        this.providerFormGroup.enable();
        this.providerFormGroup.get('email').disable();
        this.providerFormGroup.get('phone_number').disable();
        this.providerFormGroup.get('city').disable();
        this.providerFormGroup.get('state').disable();
        this.isDisabled = !this.isDisabled;
        this.disableServices();

    }

    disableServices() {
        this.setServiceData && this.setServiceData.controls.map((item, index) => {
            this.setServiceData['controls'][index].controls.service_id.disable();
            this.setServiceData['controls'][index].controls.service_name.disable();
        })
    }

    disableEditMode() {
        this.buttonTitle = "EDIT";
        this.providerTitle = localStorage.getItem('providerTitle');;
        this.providerFormGroup.disable();
        this.providerFormGroup.value['phone_number'] = this.providerDetails.phone_number;
        this.isDisabled = !this.isDisabled;
    }

    callCreateProvider() {
        this.isCallingProvider = true;
        this.salonService.createProviderService(this.salonId, this.requestObject, (status, response) => {
            this.isCallingProvider = false;

            if (status === ServiceResponse.success) {
                this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    callEditProvider() {
        this.isCallingProvider = true;
        this.salonService.updateProviderService(this.salonId, this.providerId, this.requestObject, (status, response) => {
            this.isCallingProvider = false;
            if (status === ServiceResponse.success) {
                this.buttonTitle === 'SAVE' && this.isFromDetails ? this.disableEditMode() : this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    requestDetails() {

        this.requestObject = {
            ...this.providerFormGroup.getRawValue(),
            profile_pic_s3_key_id: this.selectedLogoFile ? this.resourceFileName : ''
        }
        this.requestObject['phone_number'] = "" + this.phoneNumber.replace(/[^0-9]/g, "")

        this.requestObject['in_office_timings'] = this.officeIds;

        const request = this.requestObject;

        for (let item in request) {

            if (item === 'services') {
                request[item].map(item => {
                    if (item.service_type) {
                        delete item['service_type']
                    }
                    if (item.service_type_id) {
                        delete item['service_type_id']
                    }
                })
            }
            if (request[item] === "" || request[item] === null || request[item] === undefined) {
                delete request[item];
            }
            console.log(this.providerId, this.buttonTitle);

            if (item === 'email' && this.providerId && this.buttonTitle === 'SAVE') {
                delete request['email'];
            }
            request['experience'] = 0

        }

    }

    formatePhoneNumber() {
        let phoneNumber = "";
        phoneNumber = this.ownerDetails.phone_number;
        if (phoneNumber.length <= 3) {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})/, '($1');
        } else if (phoneNumber.length <= 6) {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
        }
        this.phoneNumber = phoneNumber;
        this.providerFormGroup.controls.city.setValue(this.ownerDetails.city);
        this.providerFormGroup.controls.state.setValue(this.ownerDetails.state);
        this.providerFormGroup.controls.phone_number.setValue(this.phoneNumber);
    }

    onSelectionChanged(e, state) {
        if (e.isUserInput) {
            this.selectedState = state.trim();
        }
    }

    onClickUploadLogo(event) {
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
                        this.imgURL = this.providerDetails ? this.providerDetails.provider_pic_thumb_url : null;
                        this.selectedLogoFile = null;
                        this.fileName = "";
                        event = null;
                        this.InputVar.nativeElement.value = "";

                    }

                })
            };

        }
    }

    async uploadImagesToS3() {
        const item = this.selectedLogoFile
        this.isUploading = true;
        this.isCallingProvider = true;
        return new Promise((resolve) => {
            const fName = item.name;
            const extensionName = fName.substring(fName.lastIndexOf('.'));
            const milliseconds = new Date().getTime();
            this.resourceFileName = 'provider-' + milliseconds + extensionName;
            this.amazonService.uploadImagesToS3(item, this.resourceFileName, extensionName, (status, response) => {
                this.isUploading = false;
                this.isCallingProvider = true;
                if (status === 1) {
                    this.requestDetails();
                    this.buttonTitle === 'ADD' ? this.callCreateProvider() : this.callEditProvider();

                    resolve({ status: true, data: item });
                } else {
                    resolve({ status: false, data: null });
                }
            });
        });
    }

    getStates(search) {
        this.salonService.satesService(search, (status, response) => {
            if (status === ServiceResponse.success) {
                this.statesResponse = response;
                this.states = this.statesResponse.states;
            }
        })
    }

    getServices() {
        this.isServicesListLoading = true;
        this.dashboardService.serviceTypeDropdown((status, response) => {
            if (status === ServiceResponse.success) {
                this.isServicesListLoading = false;
                this.ServiceDropdownResponse = response;
                this.serviceTypes = this.ServiceDropdownResponse.serviceTypes;
            }
        });
    }

    getServiceListData(searchService) {
        this.serviceSearchString = searchService;

        this.dashboardService.salonActiveServicesAPI(this.salonId, this.serviceSearchString, (status, response) => {

            if (status === ServiceResponse.success) {
                this.emptyServices = '';
                this.activeServices = response;
                this.servicesData = this.activeServices.services;

                this.servicesData.map((item, index) => {
                    this.onlyServicesPriceData.push(...item.services);
                    this.serviceMapData.set(item.service_type, item.services);

                    if (this.selectedServices.length > 0) {
                        this.selectedServices.filter((value) => {
                            const index = item.services.findIndex(item => item.service_id === value.service_id);
                            if (index !== -1) {
                                item.services.splice(index, 1);
                            }
                        });
                    }
                });
                this.isListEmpty = false;

            } else if (status === ServiceResponse.emptyList) {
                this.isListEmpty = true;
                this.servicesList = [];
                this.servicesData = [];
                this.emptyServices = "No services Found";
            }
        });
    }

    onSelectionServiceType(e, service, index) {
        if (e.isUserInput) {
            const tempServices = Object.assign([], service.services);
            const tempSelectedOnlyService: any = this.selectedOnlyService;
            if (tempSelectedOnlyService) {
                for (let [key, value] of tempSelectedOnlyService) {
                    tempServices.map((item, index) => {
                        if (item.service === value) {
                            tempServices.splice(index, 1);
                        }
                    });
                }
                this.serviceTypeMapData.set('item_' + index, { type: service.service_type, services: tempServices });
            } else {
                this.serviceTypeMapData.set('item_' + index, { type: service.service_type, services: tempServices });
            }

        }
    }

    onSelectionServiceChanged(e, service, i) {

        if (e.isUserInput && e.source.selected) {
            try {
                this.selectedOnlyService.delete('item_' + i);
            } catch (err) {

            }

            this.selectedOnlyService.set('item_' + i, service.service);

            const formControls = this.providerFormGroup.controls.services['controls'][i].controls

            formControls.service_name.setValue(service.service);
            formControls.service_id.setValue(service.service_id);

            if (Math.trunc(service.max_price) != 0) {
                formControls.price.setValidators(
                    [Validators.required, Validators.min(service.min_price), Validators.max(service.max_price)]
                );
            } else {
                formControls.price.setValidators(
                    [Validators.required, Validators.min(service.min_price), Validators.max(999999)]
                );
            }

            formControls.price.updateValueAndValidity()

            this.selectedServices.push(
                {
                    'service': service.service,
                    'service_id': service.service_id,
                    'min_price': service.min_price,
                    'max_price': service.max_price
                }
            );
            this.emptyServiceMessage();
        }

    }

    get priceControls(): any {
        return this.providerFormGroup.get['service'];
    }

    searchState(searchState) {
        this.getStates(searchState.trim());
    }

    emptyServiceMessage() {
        this.servicesListEmptyMessage = "";
        this.serviceIdErrorMessage = "";
        this.inOfficeTimeError = "";
        this.responseMessage = "";
        this.priceValidationError = "";
        this.isPriceValidationError = false;
    }

    getInOfficeDays() {
        this.salonService.ProductFrequencies((status, response) => {
            if (status === ServiceResponse.success) {
                this.inOfficeResponse = response;
                this.officeDays = this.inOfficeResponse.frequencies;
                this.officeDays = this.officeDays.map(obj => ({ ...obj, isChecked: false }))
            }
        });
    }

    onClickFrequencies(type, isChecked) {
        if (this.officeIds.length > 0) {
            this.selectedDays = [...this.officeIds]
        }
        this.officeDays.map(item => {
            if (item.id === type.id) {
                item.isChecked = !type.isChecked
            }
        });
        if (isChecked) {
            if (type.day === 'Daily') {
                this.officeDays.map(item => {
                    if (item.id !== type.id) {
                        item.isChecked = false;
                    } else {
                        console.log("Else Cons");
                    }
                });
                this.selectedDays = [];
                this.selectedDays.push(type.id);

            } else {
                this.removeDuplicates(8);
                this.officeDays.map(item => {
                    if (item.id === 8) {
                        item.isChecked = false;
                    } else {
                        console.log("Else Cons");
                    }
                });
                this.selectedDays.push(type.id)
            }
        } else {
            this.removeDuplicates(type.id)
        }
        this.officeIds = [...new Set(this.selectedDays)]
    }

    removeDuplicates(typeId) {
        const index = this.selectedDays.findIndex(item => item === typeId);
        if (index !== -1) {
            this.selectedDays.splice(index, 1)
        }
    }

    public displayContactFn(states?): string | undefined {
        return states ? states : undefined
    }

    ngDestroy() {
        localStorage.clear();
    }

    validate(evt) {
        if ((evt.keyCode > 47 && evt.keyCode < 58) || (evt.keyCode > 36 && evt.keyCode < 41) || evt.keyCode == 8 || evt.keyCode == 190) return true;
        else return false;
    }

}