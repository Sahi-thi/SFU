import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { PhoneNumberFormatPipe } from '../../../shared/phonenumber.pipe';
import { Salon, SalonDetailsResponse, UrlItem } from '../salon.model';
import { SalonService } from '../salon.service';

@Component({
    selector: 'app-salon-information',
    templateUrl: './salon-information.component.html',
    styleUrls: ['./salon-information.component.scss'],
})
export class SalonInformationComponent implements OnInit {
    salonDetailsResponse: SalonDetailsResponse;
    salon: Salon;
    salonMedia: UrlItem[];
    userRole: string;
    salonId: number;
    isDetailsLoading: boolean = false;
    formate;
    responseMessage: string;
    constructor(
        public location: Location,
        private titleService: Title,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private salonService: SalonService,
        public phoneFormate: PhoneNumberFormatPipe
    ) { }

    ngOnInit() {
        this.formate = this.phoneFormate;
        this.userRole = localStorage.getItem('userRole');
        this.titleService.setTitle(Constants.skinForYou + Constants.details);

        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id');
            }
        });
        this.salonId && this.getSalonDetailsService();
    }

    navigateToEdit(id) {
        if (this.userRole === 'SA') {
            this.router.navigate(['edit'], {
                relativeTo: this.activatedRoute,
            });
        } else {
            this.router.navigate(['../../' + id + '/details/edit'], {
                relativeTo: this.activatedRoute,
                queryParams: { salon_id: id },
            });
        }
        localStorage.setItem('salon_id', id);
    }

    getSalonDetailsService() {
        this.isDetailsLoading = true;
        this.salonService.salonsDetailsService(this.salonId, (status, response) => {
            if (status === ServiceResponse.success) {
                this.isDetailsLoading = false;

                this.salonDetailsResponse = response;
                this.salon = this.salonDetailsResponse.salon;
                this.salonMedia = this.salonDetailsResponse.salon.salon_media_key_ids;

                localStorage.setItem('salon time from', this.salon.time_from);
                localStorage.setItem('salon time to', this.salon.time_to);
                localStorage.setItem('salon_days_from', this.salon.days_from);
                localStorage.setItem('salon_days_to', this.salon.days_to);

                if (this.salon.quickblox_id) {
                    localStorage.setItem('salon_admin_quickblox_id', this.salon.quickblox_id.toString());
                }
            } else {
                this.isDetailsLoading = false;
                this.responseMessage = response.message;
            }
        });
    }
}
