import { DatePipe, formatDate, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Status } from 'src/app/dashboard/dashboard.model';
import { Constants } from 'src/utils/constants';
import { CustomValidators } from 'src/utils/customValidators';
import { ServiceResponse } from 'src/utils/enums';
import { DashboardService } from '../../../dashboard.service';
import { SalonService } from '../../salon.service';
import { AddServiceProductDialogComponent } from '../add-service-product-dialog/add-service-product-dialog.component';
import { appointmentDetails, appointmentStatus, GetAppointmentDetails, GetAppointmentDetailsResponse, ServiceData, ProductData } from '../appointment.model';
import { AppointmentService } from '../appointment.service';
import { DeleteServiceProductDialogComponent } from '../delete-service-product-dialog/delete-service-product-dialog.component';

@Component({
    selector: 'app-appointment-create',
    templateUrl: './appointment-create.component.html',
    styleUrls: ['./appointment-create.component.scss']
})
export class AppointmentCreateComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;
    public appointmentFormGroup: FormGroup;

    tabTitle = '';
    state: string = "";
    status: string = "";
    type = "";
    price = "";
    searchString: string = "";
    currentPage: number = 1;
    salonId: number;
    offset = 1000;
    clientsList: Array<any>
    addIdsArray: Array<any> = [];
    servicesList: Array<any> = [];
    productsList: Array<any> = [];
    buttonTitle = "CREATE";
    timeTo: Status[] = Constants.toTime;
    salonDays: Status[] = Constants.salonDays;
    timesArray: Array<any> = [];
    responseMessage = '';
    appointmentStatus: appointmentStatus[] = Constants.appointmentStatus;
    requestObject: appointmentDetails;
    servicesIdsData: ServiceData[] = [];
    productIdsData: ProductData[] = [];
    appointmentId: number;
    appointmentTitle: string = "Create Appointment";
    isFromDetails = false;
    isLoadingAPI: boolean;
    appointmentDetailResponse: GetAppointmentDetailsResponse;
    appointmentDetails: GetAppointmentDetails
    appointmentType: string;
    isAppointmentListLoading: boolean
    maxDate;
    minDate;
    date: Date;
    nextDay;
    clientName: string
    isCallingAppointment: boolean
    isEmptyClientsList = false;
    salonDaysFrom = null;
    salonDaysTo = null;
    daysArray = [];
    dateErrorMessage: string;
    dateValid: boolean;
    editDate
    minTime;
    getMinHours;
    prevTime;
    clientId: number;
    clientEmail: string;
    totalPrice: number = 0;
    appointmentFrom = '';
    selectedDate = '';
    constructor(
        private location: Location,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private appointmentService: AppointmentService,
        private salonService: SalonService,
        private dashboardService: DashboardService,
        private datePipe: DatePipe,
        private titleService: Title

    ) {

    }

    ngOnInit() {
        this.date = new Date();
        console.log(this.date);

        this.maxDate = new Date(new Date(this.date).setDate(new Date(this.date).getDate() + 2));
        this.minDate = new Date(new Date(this.date).setDate(new Date(this.date).getDate()));

        this.minTime = moment.utc(this.date).local().format('h:00 a');
        this.getMinHours = this.date.getHours();
        // this.minTime = formatDate(this.date, ' h:00 a', 'en-US', '+0530');
        // console.log(this.minTime, this.date, this.getMinHours);

        this.appointmentFrom = localStorage.getItem('appointment_from');

        this.activatedRoute.params.subscribe((params) => {
            // console.log({ params });

            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
                this.appointmentId = params['appointment_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });

        this.createFormData();
        this.getClientsListData("");
        this.isProviderLogin();

        if (this.appointmentId) {
            this.buttonTitle = localStorage.getItem('appointmentButtonTitle');
            if (this.buttonTitle === "EDIT") this.tabTitle = "Details"

            this.appointmentTitle = localStorage.getItem('appointmentTitle');
            this.isFromDetails = JSON.parse(localStorage.getItem('isFromDetails'));
            this.callAppointmentDetails();
        } else {
            this.titleService.setTitle(Constants.skinForYou + 'Create Appointment');
        }

        this.salonService.providerFilterDetails.subscribe((details) => {
            if (details) { }
        });

    }

    callAppointmentDetails() {
        // console.log(this.appointmentFrom);

        this.appointmentFrom === 'registered' ? this.callRegisteredAppointments() : this.callUnregisteredAppointments();
    }

    callRegisteredAppointments() {
        // console.log("Registered Appointments");

        this.isLoadingAPI = true;
        this.appointmentService.getAppointmentDetailsService(this.salonId, this.appointmentId, (status, response) => {
            this.isLoadingAPI = false;
            if (status === ServiceResponse.success) {
                this.appointmentDetailResponse = response;
                this.appointmentDetails = this.appointmentDetailResponse.appointment;
                this.setAppointmentData();
            } else {
                this.responseMessage = response.message;
            }
        });
    }

    callUnregisteredAppointments() {
        // console.log("UnRegistered Appointments");

        this.isLoadingAPI = true;
        this.appointmentService.getUnregisterAppointmentDetailsService(this.salonId, this.appointmentId, (status, response) => {
            this.isLoadingAPI = false;
            if (status === ServiceResponse.success) {
                this.appointmentDetailResponse = response;
                this.appointmentDetails = this.appointmentDetailResponse.appointment;
                this.setAppointmentData();
            } else {
                this.responseMessage = response.message;
            }
        });
    }

    setAppointmentData() {
        if (this.buttonTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Appointment-Details');

        } else {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Appointment');
        }
        this.servicesList = [];
        this.productsList = [];
        const appointment = this.appointmentDetails;
        console.log({ appointment });

        this.editDate = appointment.date;
        this.selectedDate = appointment.date;

        let localDate = new Date(appointment.date);
        appointment.date = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
        console.log(localDate, appointment.date);

        this.nextDay = (formatDate(this.minDate, 'dd-MM-yyyy', 'en-US') ==
            formatDate(appointment.date, 'dd-MM-yyyy', 'en-US')) ? true : false

        this.appointmentFormGroup.get('name').disable();
        this.appointmentFormGroup.get('phone_number').disable();
        this.appointmentFormGroup.get('email').disable();
        this.appointmentFrom === 'registered' ?
            this.registeredClientData(appointment) :
            this.unregisteredClientData(appointment);
        this.appointmentType = appointment.status;

        this.servicesList = appointment.services;
        this.productsList = appointment.products;

        if (this.servicesList !== null) {
            this.servicesList.forEach(item => {
                // console.log({ item });
                item['discount_price'] = (item.price - (item.price * item.discount / 100)).toFixed(2)
                this.addIdsArray.push(item);
                // console.log({ item });

                if (item.reward_id) {
                    this.servicesIdsData.push(
                        {
                            'service_id': item.service_id,
                            'provider_id': item.provider_id,
                            'provider_name': item.provider_name,
                            'reward_id': item.reward_id
                        }
                    )
                } else {
                    this.servicesIdsData.push(
                        {
                            'service_id': item.service_id,
                            'provider_id': item.provider_id,
                            'provider_name': item.provider_name,
                        }
                    )
                }

            })
        }

        if (this.productsList !== null) {
            this.productsList.forEach(item => {
                item['discount_price'] = (item.price - (item.price * item.discount / 100)).toFixed(2)
                this.addIdsArray.push(item);
                // console.log({ item });

                if (item.reward_id) {
                    this.productIdsData.push(
                        {
                            'product_id': item.id,
                            'reward_id': item.reward_id
                        }
                    )
                } else {
                    this.productIdsData.push(
                        {
                            'product_id': item.id
                        }
                    )
                }

            });
        }

        this.getTotalPrice();
    }

    registeredClientData(appointment) {
        this.formatePhoneNumber(appointment.client_number);
        this.clientName = appointment.client_name;
        this.clientId = appointment.client_id;
        this.appointmentFormGroup.setValue({
            name: appointment.client_name,
            email: appointment.client_email,
            phone_number: appointment.client_number,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
            notes: appointment.notes
        });
    }

    unregisteredClientData(appointment) {
        this.clientEmail = appointment.client_email;

        this.appointmentFormGroup.setValue({
            name: '',
            email: appointment.client_email,
            phone_number: '',
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
            notes: appointment.notes
        });

    }

    addEvent(event) {
        this.nextDay = (formatDate(this.minDate, 'dd-MM-yyyy', 'en-US') == formatDate(event.value, 'dd-MM-yyyy', 'en-US')) ? true : false
        let str = "" + event.value + "";
        this.dateValid = false;
        this.appointmentFormGroup.controls.time.setValue('');
        for (let i = 0; i < this.salonDays.length - 1; i++) {
            if (this.salonDays[i].id.slice(0, 3) === str.slice(0, 3)) {
                for (let j = 0; j < this.daysArray.length; j++) {
                    if (this.salonDays[i].value == this.daysArray[j]) {
                        this.appointmentFormGroup.controls.date.setValue(event.value);

                        this.dateErrorMessage = '';
                        this.dateValid = true;

                    }
                }
            }
        }

        this.selectedDate = this.datePipe.transform((new Date(event.target.value)), "yyyy-MM-dd");
        if (this.selectedDate) {
            // this.addIdsArray = [];
            this.productsList = [];
            this.servicesList = [];
        }
        // console.log(this.selectedDate);

    }

    isProviderLogin() {
        const role = localStorage.getItem('userRole');
        let fromDay,
            toDay;

        if (role === 'P') {
            this.salonService.salonsDetailsService(this.salonId, (status, response) => {
                if (status === ServiceResponse.success) {
                    const startTime = response.salon.time_from;
                    const endTime = response.salon.time_to;
                    this.inBetweenTimes(startTime, endTime);
                    fromDay = response.days_from;
                    toDay = response.days_to;
                }
            });
        }
        if (role === 'SA' || role === 'A') {
            const stTime = localStorage.getItem('salon time from');
            const edTime = localStorage.getItem('salon time to');
            this.inBetweenTimes(stTime, edTime);
            fromDay = localStorage.getItem('salon_days_from');
            toDay = localStorage.getItem('salon_days_to');
        }
        this.salonDays.map(item => {
            if (item.id == fromDay) {
                this.salonDaysFrom = item.value;
            }
            if (item.id == toDay) {
                this.salonDaysTo = item.value
            }
        })
    }

    myFilter = (d: Date) => {
        const day = (d || new Date()).getDay();

        if (this.salonDaysFrom < this.salonDaysTo) {
            return day >= this.salonDaysFrom && day <= this.salonDaysTo;
        } else {
            return day >= this.salonDaysFrom || day <= this.salonDaysTo
        }
    }

    inBetweenTimes(startTime, endTime) {

        let initialIndex = this.timeTo.findIndex(x => x.value === startTime);
        const finalIndex = this.timeTo.findIndex(x => x.value === endTime);

        while (initialIndex <= this.timeTo.length - 1 && initialIndex <= finalIndex) {
            this.timesArray.push(this.timeTo[initialIndex]);
            initialIndex++;
        }

        for (let i = 0; i < this.timesArray.length - 1; i++) {

            if (this.timesArray[i].value.trim().toLowerCase() === this.minTime.trim().toLowerCase()) {
                this.prevTime = this.timesArray[i].id;
            } else {
                this.prevTime = this.getMinHours;
            }
        }

        this.timesArray.map(x => {

            if (Number(x.id) <= Number(this.getMinHours)) {
                x.isTime = true
            }
            // if (this.prevTime === undefined || this.prevTime === null) {
            //     x.isTime = true
            // }
        });
    }

    getClientsListData(searchString) {
        this.isEmptyClientsList = true;
        this.dashboardService.clientsListService(this.salonId, this.offset, this.currentPage, searchString, status, (status, response) => {
            this.isAppointmentListLoading = false;
            if (status === ServiceResponse.success) {
                this.isEmptyClientsList = false;
                this.clientsList = response.clients;
            } else if (status === ServiceResponse.emptyList) {
                this.isEmptyClientsList = true;
            }
        });
    }

    goBack() {
        this.location.back();
    }

    getTotalPrice() {
        this.totalPrice = 0;

        // console.log('servicesList', this.servicesList);
        // console.log('productsList', this.productsList);

        let servicesCount = 0, productsCount = 0;
        this.servicesList && this.servicesList.forEach(item => {
            // console.log(item.discount_price);
            servicesCount = servicesCount + Number(item.discount_price);
        })
        this.productsList && this.productsList.forEach(item => {
            // console.log(item.discount_price);
            productsCount = productsCount + Number(item.discount_price);
        })
        this.totalPrice = this.totalPrice + servicesCount + productsCount
    }

    createFormData() {
        const validationIsFrom = this.appointmentFrom === 'registered' ? true : false;
        this.appointmentFormGroup = new FormGroup({
            name: validationIsFrom ? new FormControl('', [Validators.required, CustomValidators.noWhitespaceValidator])
                : new FormControl({ value: '', disabled: true }),
            email: validationIsFrom ? new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(CustomValidators.email), CustomValidators.noWhitespaceValidator])
                : new FormControl('', [Validators.required, Validators.pattern(CustomValidators.email), CustomValidators.noWhitespaceValidator]),
            phone_number: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(14), Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]),
            date: new FormControl('', Validators.required),
            time: new FormControl('', Validators.required),
            status: new FormControl('Pending', Validators.required),
            notes: new FormControl("", [Validators.maxLength(150)]),
        });

    }

    openDialog(type) {

        let dialogref = this.dialog.open(AddServiceProductDialogComponent, {
            width: "640px",
            panelClass: ['serviceProduct-dialog', 'card-shadow'],
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                type: type,
                // addIdsArray: this.addIdsArray,
                selectedServices: this.servicesList,
                selectedProducts: this.productsList,
                salonId: this.salonId,
                selectedState: this.state,
                selectedStatus: this.status,
                searchString: this.searchString,
                selectedDate: this.selectedDate
            },
        });
        dialogref.afterClosed().subscribe((response) => {
            // console.log({ response });

            if (response !== undefined) {
                if (response.type === 'Service') {
                    this.servicesList = [];
                    this.servicesList = [...response.selectedServices];
                }

                if (response.type === 'Product') {
                    this.productsList = [];
                    this.productsList = [...response.selectedProducts];
                    // console.log(this.productsList);
                }

                this.sendProductIdsObject()
                this.sendServiceIdsObject()
                this.getTotalPrice();
            }

        });
    }

    openDeleteServiceDialog(type, id, name) {
        // console.log({ id });
        // console.log({ name });

        if (type === 'Service' && this.buttonTitle === 'CREATE') {
            const serviceIndex = this.servicesList.findIndex(item => item.service_id === id
            );

            this.servicesList.splice(serviceIndex, 1);
            this.getTotalPrice();
            this.sendServiceIdsObject();
        }

        if (this.buttonTitle === 'SAVE' && type === 'Service') {
            let dialogref = this.dialog.open(DeleteServiceProductDialogComponent, {
                width: "330px",
                panelClass: "filter-dialog",
                hasBackdrop: true,
                autoFocus: false,
                backdropClass: 'backdropClassBg',
                data: {
                    listId: id,
                    listType: 'service',
                    listTitle: name,
                    salonId: Number(this.salonId)
                },
            });
            dialogref.afterClosed().subscribe(response => {
                if (response != undefined) {
                    const newIndex = this.servicesList.findIndex(item => item.service_id === id);
                    this.servicesList.splice(newIndex, 1);
                    this.getTotalPrice();
                    this.sendServiceIdsObject();

                }
            })

        }

    }

    openDeleteProductDialog(type, id, name) {
        if (type === 'Product' && this.buttonTitle === 'CREATE') {
            const productIndex = this.productsList.findIndex(item => item.id === id);
            // console.log({ productIndex });
            this.productsList.splice(productIndex, 1);
            this.getTotalPrice();
            this.sendProductIdsObject();

        }
        if (this.buttonTitle === 'SAVE' && type === 'Product') {
            // console.log("DELETE and save product");

            let dialogref = this.dialog.open(DeleteServiceProductDialogComponent, {
                width: "330px",
                panelClass: "filter-dialog",
                hasBackdrop: true,
                autoFocus: false,
                backdropClass: 'backdropClassBg',
                data: {
                    listId: id,
                    listType: 'product',
                    listTitle: name,
                    salonId: Number(this.salonId)
                },
            });
            dialogref.afterClosed().subscribe(response => {
                if (response != undefined) {
                    const productIndex = this.productsList.findIndex(item => item.id === id);
                    this.productsList.splice(productIndex, 1);
                    this.getTotalPrice();
                    this.sendProductIdsObject();
                }
            })

        }
    }

    searchClient(searchClient) {
        // console.log({ searchClient });
        this.getClientsListData(searchClient.trim());
        if (searchClient === '') {
            this.appointmentFormGroup.get('email').enable();
            this.appointmentFormGroup.get('phone_number').enable();
            this.appointmentFormGroup.controls.email.setValue('')
            this.appointmentFormGroup.controls.phone_number.setValue('');
            this.clientId = null;
        }
    }

    clientNameChange(e) {
        // console.log(e.option.id);

        this.clientId = e.option.id;
        const email = this.clientsList.find(x => x.client_id === e.option.id).email;
        const phoneNumber = this.clientsList.find(x => x.client_id === e.option.id).phone_number;
        this.formatePhoneNumber(phoneNumber);
        this.appointmentFormGroup.controls.email.setValue(email);
        this.appointmentFormGroup.get('email').disable();
        this.appointmentFormGroup.get('phone_number').disable();
    }

    isEmailEntered() {
        if (this.appointmentFormGroup.get('email').valid) {

            this.appointmentFormGroup.get('name').disable();
            this.appointmentFormGroup.get('phone_number').disable();
        } else {
            this.appointmentFormGroup.get('name').enable();
            this.appointmentFormGroup.get('phone_number').enable();
        }

    }

    public displayClientFn(client?): string | undefined {
        return client ? client : undefined
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
        this.appointmentFormGroup.controls.phone_number.setValue(phoneNumber);
    }

    enableEditMode() {
        this.buttonTitle = "SAVE";
        this.appointmentFormGroup.enable();
    }

    async submitAppointmentForm(buttonTitle) {

        this.appointmentFrom !== 'registered' && this.inputValidations();
        if (buttonTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Appointment');
            this.enableEditMode();
        } else {
            if (this.buttonTitle === 'CREATE') {
                if (this.appointmentFormGroup.valid) {
                    await this.requestDetails();
                    this.callCreateAppointment()
                }
            } else {
                this.appointmentFormGroup.controls['date'].clearValidators();
                this.appointmentFormGroup.controls['date'].updateValueAndValidity();

                if (this.appointmentFormGroup.valid) {
                    await this.requestDetails();
                    this.callEditAppointment();
                } else { }
            }
        }
    }

    inputValidations() {
        if (this.clientId) {
            this.setValidations('name');
            this.setValidations('phone_number');
        } else {
            this.clearValidations('name');
            this.clearValidations('phone_number');

        }
    }

    clearValidations(type) {
        this.appointmentFormGroup.get(type).clearValidators();
        this.appointmentFormGroup.get(type).updateValueAndValidity();
    }

    setValidations(type) {
        this.appointmentFormGroup.get(type).setValidators(Validators.required);
        this.appointmentFormGroup.get(type).updateValueAndValidity();
    }

    async requestDetails() {

        if (this.buttonTitle === 'ADD') {
            this.appointmentFormGroup.value.phone_number = "" + this.appointmentFormGroup.value.phone_number.replace(/[^0-9]/g, "");
        }
        this.requestObject = {
            ... this.appointmentFormGroup.value
        }

        const date = new Date(this.requestObject.date);
        const obj: any = {};
        obj.date = this.datePipe.transform(date, "yyyy-MM-dd");
        obj.status = this.requestObject.status;
        obj.time = this.requestObject.time;
        obj.notes = this.requestObject.notes;
        obj.service_ids = this.servicesIdsData;
        obj.product_ids = this.productIdsData;
        if (this.clientId) {
            obj.client_id = this.clientId
        } else {
            obj.client_email = this.appointmentFormGroup.getRawValue().email;
        }

        for (let item in obj) {
            if (obj[item] === "" || obj[item] === null || obj[item] === undefined) {
                delete obj[item];
            }
        }
        this.requestObject = obj;
        // console.log("requestObject", this.requestObject);

    }

    sendProductIdsObject() {
        this.productIdsData = [];

        if (this.productsList && this.productsList.length > 0) {
            this.productsList.map(item => {
                // console.log({ item });

                if (item.reward_id) {

                    this.productIdsData.push({
                        'product_id': item.id,
                        'reward_id': item.reward_id
                    })

                } else {
                    this.productIdsData.push({
                        'product_id': item.id
                    })
                }

            })

        } else {
            this.productIdsData = [];
        }
        return this.productIdsData;
    }

    sendServiceIdsObject() {
        this.servicesIdsData = []
        if (this.servicesList && this.servicesList.length > 0) {
            this.servicesList.map(item => {
                if (item.reward_id) {
                    this.servicesIdsData.push({
                        'service_id': item.service_id,
                        'provider_id': item.provider_id,
                        'provider_name': item.provider_name,
                        'reward_id': item.reward_id
                    })
                } else {
                    this.servicesIdsData.push({
                        'service_id': item.service_id,
                        'provider_id': item.provider_id,
                        'provider_name': item.provider_name,
                    })
                }

            })
        } else {
            this.servicesIdsData = [];
        }
        return this.servicesIdsData;
    }

    callCreateAppointment() {
        this.isCallingAppointment = true;
        this.appointmentFrom === 'registered' ?
            this.appointmentService.createAppointmentService(this.salonId, this.requestObject, (status, response) => {
                this.isCallingAppointment = false;
                if (status === ServiceResponse.success) {
                    this.location.back();
                } else {
                    this.responseMessage = response.message;
                }
            }) :
            this.appointmentService.createUnregisterAppointmentService(this.salonId, this.requestObject, (status, response) => {
                this.isCallingAppointment = false;
                if (status === ServiceResponse.success) {
                    this.location.back();
                } else {
                    this.responseMessage = response.message;
                }
            })
    }

    callEditAppointment() {
        this.isCallingAppointment = true;
        this.appointmentFrom === 'registered' ?
            this.appointmentService.updateAppointmentService(this.salonId, this.appointmentId, this.requestObject, (status, response) => {
                this.isCallingAppointment = false;
                if (status === ServiceResponse.success) {
                    this.buttonTitle === 'SAVE' && this.isFromDetails ? this.disableEditMode() : this.location.back();
                } else {
                    this.responseMessage = response.message;
                }
            }) :
            this.appointmentService.updateUnregisterAppointmentService(this.salonId, this.appointmentId, this.requestObject, (status, response) => {
                this.isCallingAppointment = false;
                if (status === ServiceResponse.success) {
                    this.buttonTitle === 'SAVE' && this.isFromDetails ? this.disableEditMode() : this.location.back();
                } else {
                    this.responseMessage = response.message;
                }
            })
    }

    disableEditMode() {
        this.buttonTitle = "EDIT";
        this.appointmentTitle = localStorage.getItem('appointmentTitle');;
        this.appointmentFormGroup.disable();
        this.appointmentFormGroup.value['phone_number'] = this.appointmentDetails.client_number;
    }
}
