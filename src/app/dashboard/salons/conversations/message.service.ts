import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as moment from 'moment';
import { CONSTANTS } from 'src/app/QBconfig';
import { environment } from 'src/environments/environment';
import { ServiceResponse } from 'src/utils/enums';
import { DefaultResponse } from './conversation.model';
import { DialogService } from './dialog.service';

declare var QB: any;
@Injectable({
    providedIn: 'root',
})
export class MessageService {
    defaultResponse: DefaultResponse;
    chatAvailableUsers: any;
    public messages: any = {};
    chatMessagesWithDates = {};
    selectedConversationEvent: EventEmitter<any> = new EventEmitter();
    messagesEvent: EventEmitter<any> = new EventEmitter();
    user

    constructor(private dialogService: DialogService, private httpClient: HttpClient) {

        // QB.chat.onSystemMessageListener = this.onSystemMessageListener.bind(this);
        const loginData = localStorage.getItem('loggedinUser');
        this.user = JSON.parse(JSON.stringify(loginData));

    }

    intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entrie) => {
                if (document.visibilityState === 'visible' && entrie.isIntersecting) {
                    const params = {
                        messageId: entrie.target['dataset'].messageId,
                        userId: parseInt(entrie.target['dataset'].userId),
                        dialogId: entrie.target['dataset'].dialogId,
                    };
                    const event = new CustomEvent('visibility', {
                        detail: {
                            dialogId: entrie.target['dataset'].dialogId,
                            messageId: entrie.target['dataset'].messageId,
                        },
                    });
                    entrie.target.dispatchEvent(event);
                    QB.chat.sendReadStatus(params);
                }
            });
        },
        {
            threshold: [1.0],
        }
    );

    setListeners() {
        try {
            QB.chat.onMessageListener = this.onMessageListener.bind(this);
        } catch (err) {
            // console.log("onMessageListener", err);

        }
    }

    onSystemMessageListener = (message) => {
        if (message.extension === undefined || !message.extension.dialog_id === undefined
        ) {
            return false;
        }

    };

    // public sendSystemMessage(userIds, systemMessage) {
    //     console.log(userIds, systemMessage);
    //     userIds.forEach((userId) => {
    //         QB.chat.sendSystemMessage(userId, systemMessage);
    //     });
    // }

    onMessageListener = function(userId, message) {

        const self = this;
        message.extension.date_sent = new Date(+message.extension.date_sent * 1000);
        message = self.fillNewMessageParams(userId, message);
        if (userId === +localStorage.getItem('quickblox_user_id')) {
            return false;
        }
        if (message.markable) {
            QB.chat.sendDeliveredStatus({
                messageId: message._id,
                userId: userId,
                dialogId: message.chat_dialog_id,
            });
        }
        self.dialogService.setDialogParams(message);
        if (message.chat_dialog_id === self.dialogService.currentDialog._id) {
            self.messages.push(message);
            self.addMessageToDatesIds(message);
            self.messagesEvent.emit(self.chatMessagesWithDates);
        }
    };

    private onReadStatusListener = function(messageId, dialogId) {
        const self = this;
        if (dialogId === self.dialogService.currentDialog._id) {
            for (const [key, messages] of Object.entries(self.datesIds)) {
                // @ts-ignore
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i]._id === messageId) {
                        self.datesIds[key][i].status = 'read';
                    }
                }
            }
        }
    };

    private onDeliveredStatusListener = function(messageId, dialogId) {
        const self = this;
    };

    public setMessages(messages, scrollTo) {
        this.chatMessagesWithDates = [];
        messages.forEach((message) => {
            if (!(message.date_sent instanceof Date)) {
                message.date_sent = new Date(+message.date_sent * 1000);
            }
            this.addMessageToDatesIds(message);
        });
        this.messages = messages;
        this.messagesEvent.emit(this.chatMessagesWithDates);
        setTimeout(() => {
            this.scrollTo(document.querySelector('.j-messages'), scrollTo);
        }, 200);
    }

    public getMessages(params): Promise<any> {
        return new Promise((resolve, reject) => {
            QB.chat.message.list(params, function(err, messages) {
                if (messages) {
                    resolve(messages);
                } else {
                    reject(err);
                }
            });
        });
    }

    sendMessage(dialog, msg) {
        // console.log(msg, dialog);

        const message = JSON.parse(JSON.stringify(msg));

        const jidOrUserId = QB.chat.helpers.getRoomJidFromDialogId(dialog._id);

        message.id = QB.chat.send(jidOrUserId, message);
        message.extension.dialog_id = dialog._id;

        return message;
    }

    public abCreateAndUpload(file): Promise<any> {
        return new Promise((resolve, reject) => {
            QB.content.createAndUpload({
                public: false,
                file: file,
                name: file.name,
                type: file.type,
                size: file.size
            }, function(err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }

    notificationMessage(clientId, request, callback) {
        const url =
            environment.api_end_point + 'client/' + clientId + '/chat/pushNotification';
        this.httpClient.post(url, request).subscribe((data: DefaultResponse) => {
            this.defaultResponse = data;
            if (this.defaultResponse.statusCode === 201) {
                callback(ServiceResponse.success, this.defaultResponse);
            } else {
                callback(ServiceResponse.error, this.defaultResponse);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });

    }

    public fillNewMessageParams(userId, msg) {
        // console.log({ msg });

        const self = this;
        let message = {
            _id: msg.id,
            attachments: [],
            created_at: +msg.extension.date_sent || Date.now(),
            date_sent: +msg.extension.date_sent || Date.now(),
            delivered_ids: [userId],
            message: msg.body,
            read_ids: [userId],
            sender_id: userId,
            chat_dialog_id: msg.extension.dialog_id,
            selfReaded: userId === +localStorage.getItem('quickblox_user_id'),
            read: 0,
        };

        if (msg.extension.attachments) {
            message.attachments = msg.extension.attachments;
        }

        if (msg.extension.notification_type) {
            message['notification_type'] = msg.extension.notification_type;
        }

        if (msg.extension.new_occupants_ids) {
            message['new_occupants_ids'] = msg.extension.new_occupants_ids;
        }

        message['status'] =
            userId !== +localStorage.getItem('quickblox_user_id')
                ? self.getMessageStatus(message)
                : undefined;

        return message;
    }

    getMessageStatus(message) {
        if (message.sender_id !== +localStorage.getItem('quickblox_user_id')) {
            return undefined;
        }
        const deleveredToOcuupants = message.delivered_ids.some(function(id) {
            return id !== +localStorage.getItem('quickblox_user_id');
        });
        const readedByOccupants = message.read_ids.some(function(id) {
            return id !== +localStorage.getItem('quickblox_user_id');
        });

        return !deleveredToOcuupants
            ? 'sent'
            : readedByOccupants
                ? 'read'
                : 'delivered';
    }

    public getRecipientUserId(users) {
        const self = this;
        if (users.length === 2) {
            return users.filter(function(user) {
                if (user !== self.user.id) {
                    return user;
                }
            })[0];
        }
    }

    scrollTo(elem, position) {
        try {
            var elemScrollHeight = elem.scrollHeight;
            var elemHeight = elem.offsetHeight;
        }
        catch (err) { }

        if (position === 'bottom') {
            if (elemScrollHeight - elemHeight > 0) {
                elem.scrollTop = elemScrollHeight;
            }
        }
    }

    public addMessageToDatesIds(message) {
        const self = this;
        const date = new Date(message.created_at);
        const key = moment.utc(date).local().format('MM/DD/yyyy');

        if (self.chatMessagesWithDates[key] === undefined) {
            self.chatMessagesWithDates[key] = [];
        }
        if (
            message.read_ids &&
            message.read_ids.indexOf(+localStorage.getItem('quickblox_user_id')) ===
            -1
        ) {
            message.visibilityEvent = true;
        }
        if (message.attachments) {
            message.attachments = message.attachments.map(attachment => {

                attachment.src = QB.content.publicUrl(attachment.id) + '.json?token=' + QB.service.getSession().token;

                return attachment;
            });
        }
        message['status'] = self.getMessageStatus(message);
        self.chatMessagesWithDates[key].push(message);
    }

    // message User Details API //

    getChatMessageUserDetails(data, callback) {
        this.httpClient
            .post(environment.api_end_point + 'client/chat/userDetails', data)
            .subscribe(
                (result: any) => {
                    if (result.statusCode === 200) {
                        callback(ServiceResponse.success, result.users);
                    } else {
                        callback(ServiceResponse.error, result.message);
                    }
                },
                (error: HttpErrorResponse) => {
                    callback(ServiceResponse.error, error.error);
                }
            );
    }
}
