import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PhoneNumberFormatPipe } from 'src/app/shared/phonenumber.pipe';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { GetAppointmentDetails, GetAppointmentDetailsResponse } from '../appointment.model';
import { AppointmentService } from '../appointment.service';

const colors: any = {
    cancelled: {
        primary: 'rgba(239, 86, 78, 0.5)',
        secondary: 'rgba(255, 206, 206, 0.5)'
    },
    accepted: {
        primary: 'rgba(171, 237, 221, 0.5)'
    },
    fulfilled: {
        primary: 'rgba(110, 212, 0, 0.5)'
    },
};

@Component({
    selector: 'app-appointment-details',
    templateUrl: './appointment-details.component.html',
    styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {

    salonId: number;
    appointmentId: number;
    appointmentDetailResponse: GetAppointmentDetailsResponse;
    appointmentDetails: GetAppointmentDetails;
    isLoadingAPI: boolean;
    formate: any;
    priceArray: Array<any> = [];
    totalPrice: number = 0;
    responseMessage = '';
    appointmentFrom = '';
    filteredDetails

    constructor(public activatedRoute: ActivatedRoute,
        public location: Location,
        private router: Router,
        public appointmentService: AppointmentService,
        public phoneFormate: PhoneNumberFormatPipe,
        public titleService: Title) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.salonId = params['salon_id'];
            this.appointmentId = params['id'];

        });
        this.appointmentFrom = localStorage.getItem('appointment_from');
        this.appointmentFrom === 'registered' ? this.getAppointmentDetail() :
            this.getUnregisterAppointmentDetail();
        this.titleService.setTitle(Constants.skinForYou + 'Appointment-Details');
        this.formate = this.phoneFormate;

        this.appointmentService.appointmentFilteredDetails.subscribe((details) => {
            if (details) {
                this.filteredDetails = details;
            }
        })
    }

    getAppointmentDetail() {
        this.isLoadingAPI = true;
        this.appointmentService.getAppointmentDetailsService(this.salonId, this.appointmentId, (status, response) => {
            this.isLoadingAPI = false;
            if (status === ServiceResponse.success) {
                this.appointmentDetailResponse = response;
                this.appointmentDetails = this.appointmentDetailResponse.appointment;
                this.setDiscountPriceToList();
            }
            else {
                this.responseMessage = response.message
            }
        });
    }

    setDiscountPriceToList() {
        if (this.appointmentDetails.services !== null) {

            this.appointmentDetails.services.forEach(service => {
                if (service.discount > 0) {
                    service['discount_price'] = +(service.price - (service.price * service.discount / 100)).toFixed(2);
                } else {
                    service['discount_price'] = +service.price;
                }
            })
        }
        if (this.appointmentDetails.products !== null) {

            this.appointmentDetails.products.forEach(product => {
                if (product.discount > 0) {
                    product['discount_price'] = +(product.price - (product.price * product.discount / 100)).toFixed(2);
                } else {
                    product['discount_price'] = +product.price;
                }
            })
        }
        this.getTotalPrice();
    }

    getUnregisterAppointmentDetail() {
        this.isLoadingAPI = true;
        this.appointmentService.getUnregisterAppointmentDetailsService(this.salonId, this.appointmentId, (status, response) => {
            this.isLoadingAPI = false;
            if (status === ServiceResponse.success) {
                this.appointmentDetailResponse = response;
                this.appointmentDetails = this.appointmentDetailResponse.appointment;
                this.setDiscountPriceToList();
            } else {
                this.responseMessage = response.message
            }
        });
    }

    getTotalPrice() {
        this.totalPrice = 0;
        this.priceArray.forEach(item => {
            this.totalPrice = this.totalPrice + item;
        })
        let servicesCount = 0, productsCount = 0;
        this.appointmentDetails.services && this.appointmentDetails.services.forEach(item => {
            servicesCount = servicesCount + Number(item.discount_price);
        })
        this.appointmentDetails.products && this.appointmentDetails.products.forEach(item => {
            productsCount = productsCount + Number(item.discount_price);
        })
        this.totalPrice = this.totalPrice + servicesCount + productsCount
    }

    setEventColor(status) {
        return status === 'Cancelled' ? colors.cancelled.primary : status === 'Confirmed' ? colors.confirmed.primary : colors.accepted.primary
    }

    navigateToEditAppointment(btnTitle, appointmentTitle) {
        localStorage.setItem('appointmentButtonTitle', btnTitle);
        if (this.appointmentFrom === 'registered') {
            localStorage.setItem('appointmentTitle', appointmentTitle);
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/appointments/registered-users/' + this.appointmentDetails.appointment_id + '/edit')
        } else {
            this.navigationToScreen('/home/salons/salon/' + this.salonId + '/appointments/unregistered-users/' + this.appointmentDetails.appointment_id + '/edit');
            localStorage.setItem('appointmentTitle', 'Edit');

        }
    }

    navigationToScreen(URL: string) {
        this.router.navigate([URL], {
            relativeTo: this.activatedRoute,
        })
    }

    goBack() {
        this.location.back()
        this.appointmentService.appointmentFilteredDetails.next(this.filteredDetails)

    }
}
