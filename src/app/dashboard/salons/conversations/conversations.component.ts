import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ServiceResponse } from 'src/utils/enums';
import { Constants } from '../../../../utils/constants';
import { DashboardService } from '../../dashboard.service';
import { SalonService } from '../salon.service';
import { ConversationsService } from './conversations.service';
import { MessageService } from './message.service';
declare let QB: any;

@Component({
    selector: 'app-conversations',
    templateUrl: './conversations.component.html',
    styleUrls: ['./conversations.component.scss'],
})
export class ConversationsComponent implements OnInit {

    salonId: number;

    constructor(
        private salonService: SalonService,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private messageService: MessageService,
        private conversationService: ConversationsService,
        private dashboardService: DashboardService,

    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + 'Conversations');
        // QB.chat.onSystemMessageListener = this.onSystemMessageListener.bind(this);

        this.activatedRoute.params.subscribe((params) => {

            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id');
            }
        });

        this.getSalonDetailsService();
        console.log(QB.webrtc ? true : false);

        if (QB.webrtc) {
            // console.log("WebRtc there true");
            this.messageService.setListeners();
        } else {
            // console.log("WebRtc there false");

            this.initializeQuickBlox()
        }
    }

    private onSystemMessageListener = function(message) {
        console.log("Message listener", message);

        if (message.extension === undefined || !message.extension.dialog_id === undefined
        ) {
            return false;
        }

    };
    setUserToLogin() {
        try {
            this.conversationService.login({ email: localStorage.getItem('email') });
            setTimeout(() => {
                this.messageService.setListeners();
            }, 3000)
        } catch (error) {
            console.log({ error });

        }
    }

    initializeQuickBlox() {
        this.dashboardService.initialiseQuickBlox();
        this.setUserToLogin();
    }

    getSalonDetailsService() {
        this.salonService.salonsDetailsService(this.salonId, (status, response) => {
            if (status === ServiceResponse.success) {
                localStorage.setItem('quickblox_admin_id', response.salon.quickblox_id)
            }
        });
    }
}
