import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ServiceResponse } from '../../../../../utils/enums';
import { VideoDialogComponent } from '../../../video-dialog/video-dialog.component';
import { DialogService } from '../dialog.service';
import { MessageService } from '../message.service';
import { AmazonService } from '../../../amazon.service';
import { DomSanitizer } from '@angular/platform-browser';
declare let QB: any;
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
    selector: 'app-chat-messages',
    templateUrl: './chat-messages.component.html',
    styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit, OnDestroy {

    sounds = {
        'call': 'callingSignal',
        'end': 'endCallSignal',
        'ringtone': 'ringtoneSignal'
    };
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    chatDialogId: any;
    opponentIds: any;
    chatHeading: string;
    chatType: any;
    messageField: any;
    chatDialog: any;
    messages: any = [];
    userId = +localStorage.getItem('quickblox_user_id');
    messageListSubscription: Subscription;
    isChatSelected = false;
    isChatMessagesLoading = false;
    isChatMessageListEmpty = true;
    isLoadMoreCalling = false;
    todayString: any;
    yesterdayString: any;
    clientId: number;
    userOccupentId = [];
    chatUsersInformation = new Map();
    attachments: any = [];
    shiftDown = false;
    uploadedImageURL = [];
    isUploadButtonClicked = false;
    isUploadingMedia = false;
    uploadImgUrl;
    constructor(
        private messageService: MessageService,
        private dialogService: DialogService,
        public dialog: MatDialog,
        private amazonService: AmazonService,
        private domSanitizer: DomSanitizer,
        private _snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.messageField = '';
        this.calculateYesterdayAndTodayDate();

        this.messageService.selectedConversationEvent.subscribe((chatItem: any) => {
            this.userOccupentId = [];
            console.log({ chatItem });

            if (chatItem) {
                this.messageService.messages = {};
                this.messageService.chatMessagesWithDates = {};
                this.isChatMessageListEmpty = true;
                this.isChatMessagesLoading = true;
                this.messages = [];
                this.isChatSelected = true;
                this.chatDialog = chatItem;
                this.chatDialogId = chatItem._id;
                this.opponentIds = chatItem.occupants_ids;
                this.chatType = chatItem.type;
                this.chatHeading = chatItem.name;
                this.clientId = chatItem.client_id;
                this.userOccupentId.push(chatItem.quickblox_id);
                this.getChatUserDetails(chatItem);
            } else {
                this.isChatMessagesLoading = false;
                this.isChatSelected = false;
                this.messages = [];
            }
        });

        this.messageService.messagesEvent.subscribe((messages: Object) => {

            let chatMessagesWithDates = Object.keys(messages).map(function(key) {
                return [key, messages[key]];
            });
            chatMessagesWithDates.forEach((element) => {
                const data = element;
                if (data[0] === this.todayString) {
                    data[0] = 'Today';
                } else if (data[0] === this.yesterdayString) {
                    data[0] = 'Yesterday';
                }

                const chatMessages: any = data[1];
                if (chatMessages && chatMessages.length > 0) {
                    let profileData: any;
                    chatMessages.map((item) => {
                        profileData = this.chatUsersInformation;
                        if (profileData && profileData.size > 0) {

                            const itemData = profileData.get(item.sender_id);
                            if (itemData) {
                                item['profile_name'] = itemData.user_name;
                                item['profile_picture'] = itemData.profile_pic_thumb_url;
                            } else {
                                item['profile_picture'] = null;
                                item['profile_name'] = '';
                            }
                        }
                    });
                }
            });
            this.messages = chatMessagesWithDates;
            try {
                setTimeout(() => {
                    this.messageService.scrollTo(
                        document.querySelector('.j-messages'),
                        'bottom'
                    );
                }, 200);
            } catch (err) { }

        });
    }

    getChatUserDetails(chatItem) {
        this.isChatMessagesLoading = true;
        const occupantIds = { quickblox_ids: chatItem.occupants_ids }
        this.messageService.getChatMessageUserDetails(occupantIds, (status, response) => {
            if (status === ServiceResponse.success) {
                response.map((item) => {
                    this.chatUsersInformation.set(item.quickblox_id, item);
                });
                this.getMessages();
                this.dialogService.joinToDialog(chatItem);
            } else {
                alert('loading chat messages failed');
            }
        });
    }

    onClickVideoButton() {
        let dialogref = this.dialog.open(VideoDialogComponent, {

            width: "1250px",
            panelClass: ['card-shadow', 'chat-dialog'],
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',

            data: {
                isFromDialog: false,
                clientId: this.userOccupentId,
                loginUserName: this.messageService.user.full_name
            },

        });

    }

    calculateYesterdayAndTodayDate() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        this.todayString = moment.utc(today).local().format('MM/DD/yyyy');

        this.yesterdayString = moment.utc(yesterday).local().format('MM/DD/yyyy');
    }

    ngOnDestroy() {
        if (this.messageListSubscription) {
            this.messageListSubscription.unsubscribe();
        }
    }

    uploadAttachment(e) {
        console.log(e);
        // this.isUploadButtonClicked = true
        const fileList: FileList = e.target.files,
            self = this,
            dialogId = this.dialogService.currentDialog._id;
        let reader = new FileReader();
        reader.readAsDataURL(fileList[0]);
        reader.onload = () => {
            const result = e.target.result
            this.uploadImgUrl = result
            self.uploadFilesAndGetIds(fileList[0], dialogId);
        }
    }

    closeOverDropScreen() {
        this.isUploadButtonClicked = false;
        this.uploadImgUrl = ''
    }

    uploadFilesAndGetIds(file, dialogId) {

        if (file.size >= 15 * 1000000) {
            return this._snackBar.open('Image is too large. Max size is 15 mb', '', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000
            });
        }
        this.isUploadingMedia = true;
        this.attachments = [{
            id: 'isLoading',
            src: URL.createObjectURL(file)
        }];
        const self = this;
        self.messageService.abCreateAndUpload(file).
            then(response => {
                this.isUploadingMedia = false;
                let extensionName = file.name.split('.').pop();
                extensionName = extensionName.toString().toLowerCase()
                extensionName = extensionName === 'jpeg' || extensionName === 'jpg' || extensionName === 'png' ? 'image' : 'pdf'
                // fileName.split('.').pop();
                console.log({ extensionName });
                this.uploadedImageURL.push(QB.content.publicUrl(response.uid) + '.json?token=' + QB.service.getSession().token)
                this.attachments = [{ id: response.uid, type: extensionName, name: file.name }];
                self.sendMessage(this.attachments);
            }).catch(err => {
                self.attachments = [];
                console.log('ERROR: ' + err);
            });
    }

    onKeydown(e) {
        if (e.repeat && e.key === 'Shift') {
            this.shiftDown = true;
        }
        if (e.key === 'Enter' && !this.shiftDown) {
            this.sendMessage();
            return false;
        }
    }

    sendMessage(attachments: any = false) {
        if (this.messageField && this.messageField.length > 0 || attachments) {
            const self = this,
                msg = {
                    type: 'groupchat',
                    body: self.messageField,
                    extension: {
                        save_to_history: 1,
                        dialog_id: self.chatDialogId,
                    },
                    markable: 1,
                };
            console.log({ attachments });

            if (attachments) {
                msg.extension['attachments'] = this.attachments;
                msg.body = this.attachments[0].type;
            } else {
                this.attachments = [];
            }
            let messagePush = msg.body;

            const message = self.messageService.sendMessage(self.chatDialog, msg);
            this.sendPushNotification(messagePush)

            let newMessage = self.messageService.fillNewMessageParams(
                +localStorage.getItem('quickblox_user_id'),
                message
            );

            try {
                newMessage['profile_picture'] = this.messageService.chatAvailableUsers.get(+localStorage.getItem('quickblox_user_id'));
                newMessage['profile_name'] = this.messageService.chatAvailableUsers.get(+localStorage.getItem('quickblox_user_id'));
            } catch (err) { }
            this.messageField = '';
            if (attachments) {
                this.attachments = [];
            }
            this.isChatMessageListEmpty = false;
            self.dialogService.setDialogParams(newMessage);
            self.messageService.messages.push(newMessage);
            self.messageService.addMessageToDatesIds(newMessage);
            self.messageService.messagesEvent.emit(
                self.messageService.chatMessagesWithDates
            );

            try {
                setTimeout(() => {
                    this.messageService.scrollTo(
                        document.querySelector('.j-messages'),
                        'bottom'
                    );
                }, 200);
            } catch (err) { }
        }
    }

    sendPushNotification(message) {
        let obj: any = {};
        obj.message = message;
        let x = new Date()
        let utcTime = Math.floor((new Date()).getTime() / 1000)
        obj.sent_time = utcTime;
        this.messageService.notificationMessage(this.clientId, obj, (status, response) => {
            if (status === ServiceResponse.success) { }
            else { }
        });
    }

    getMessages() {
        this.messageField = '';
        const self = this;
        const params = {
            chat_dialog_id: this.chatDialogId,
            sort_desc: 'date_sent',
            limit: 50,
            skip: 0,
            mark_as_read: 0,
        };
        self.dialogService.currentDialog.full = false;

        this.messageService
            .getMessages(params)
            .then((res) => {
                if (res.items.length > 40) {
                    self.dialogService.currentDialog.full = true;
                }
                this.messageService.setMessages(res.items.reverse(), 'bottom');
                this.isChatMessagesLoading = false;
                if (res.items.length === 0) {
                    this.isChatMessageListEmpty = true;
                } else {
                    this.isChatMessageListEmpty = false;
                }
            })
            .catch((err) => {
                this.isChatMessagesLoading = false;
            });
    }

    onScroll() {
        if (this.dialogService.currentDialog.full) {
            this.isLoadMoreCalling = true;
            const params = {
                chat_dialog_id: this.chatDialogId,
                sort_desc: 'date_sent',
                limit: 50,
                skip: this.messageService.messages.length,
                mark_as_read: 0,
            };
            this.messageService
                .getMessages(params)
                .then((res) => {
                    this.messageService.setMessages(
                        res.items.reverse().concat(this.messageService.messages),
                        'top'
                    );
                    this.isLoadMoreCalling = false;
                })
                .catch((err) => {
                    this.isLoadMoreCalling = false;
                });
        }
    }
}
