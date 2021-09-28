import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogService } from '../dialog.service';
import { CONSTANTS } from 'src/app/QBconfig';
import { ConversationsService } from '../conversations.service';
import { ServiceResponse } from 'src/utils/enums';
@Component({
    selector: 'app-chat-create-dialog',
    templateUrl: './chat-create-dialog.component.html',
    styleUrls: ['./chat-create-dialog.component.scss'],
})
export class ChatCreateDialogComponent implements OnInit {
    occupentIds: String[] = [];
    salonId: number;
    superAdminQuickbloxID;
    isAPILoading = false;
    userRole = localStorage.getItem('userRole');
    constructor(
        public dialogRef: MatDialogRef<ChatCreateDialogComponent>,
        private dialogService: DialogService,
        private conversationService: ConversationsService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    ngOnInit() {
        this.superAdminQuickbloxID = localStorage.getItem('sup_admin_quickblox_id');
        this.salonId = this.data.salonId
    }
    createDialog() {
        this.isAPILoading = true;
        if (this.data.clientId && this.data.clientId) {
            const clientId = this.data.clientId,
                clientQuickBloxId = this.data.clientQuickBloxId;

            if (this.userRole === 'A') {
                this.occupentIds.push(localStorage.getItem('quickblox_user_id'));
                this.occupentIds.push(this.superAdminQuickbloxID);
                this.occupentIds.push(clientQuickBloxId);
            } else if (this.userRole === 'P') {
                this.occupentIds.push(localStorage.getItem('quickblox_user_id'));
                this.occupentIds.push(localStorage.getItem('quickblox_admin_id'));
                this.occupentIds.push(this.superAdminQuickbloxID);
                this.occupentIds.push(clientQuickBloxId);
            }

            const params = { client_id: clientId };
            this.conversationService.createChatDialog(this.salonId, params, (status, response) => {
                this.isAPILoading = false;
                if (status === ServiceResponse.success) {
                    if (response.xmpp_room_jid) {
                        this.dialogService.joinToDialog(response).then(() => {
                            if (response.type === CONSTANTS.DIALOG_TYPES.GROUPCHAT) {
                                this.dialogRef.close('success');
                                this.isAPILoading = false;
                            }
                        });
                    }
                } else {
                    this.dialogRef.close('failed');
                }
            });
        }
    }
    cancel() {
        this.dialogRef.close();
    }
}