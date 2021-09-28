import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
declare var QB: any;
@Injectable({
    providedIn: 'root',
})
export class DialogService {
    public currentDialog: any = {};
    public dialogs: any = {};
    dialogsEvent: EventEmitter<any> = new EventEmitter();
    currentDialogEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        protected httpClient: HttpClient,
    ) { }

    public createDialog(params): Promise<any> {
        return new Promise((resolve, reject) => {
            QB.chat.dialog.create(params, function(createErr, createRes) {
                if (createErr) {
                    reject(createErr);
                } else {
                    resolve(createRes);
                }
            });
        });
    }

    public getDialogs(args): Promise<any> {
        return new Promise((resolve, reject) => {
            QB.chat.dialog.list(args, (err, resDialogs) => {
                if (err) {
                    console.log({ err });
                    reject(err);

                } else {
                    resolve(resDialogs);
                }
            });
        });
    }

    public setDialogs(chats): any {
        this.dialogs = chats.reduce((obj, item) => {
            obj[item._id] = item;
            return obj;
        }, {});
    }

    public setDialogParams(message) {
        try {
            const self = this,
                tmpObj = {};
            tmpObj[message.chat_dialog_id] = self.dialogs[message.chat_dialog_id];
            tmpObj[message.chat_dialog_id].last_message = message.message;
            tmpObj[message.chat_dialog_id].last_message_date_sent = message.date_sent;
            tmpObj[message.chat_dialog_id].last_message_id = message._id;
            tmpObj[message.chat_dialog_id].last_message_user_id = message.sender_id;
            if (!message.selfReaded) {
                tmpObj[message.chat_dialog_id].unread_messages_count++;
            }
            delete self.dialogs[message.chat_dialog_id];
            self.dialogs = Object.assign(tmpObj, self.dialogs);
            self.dialogsEvent.emit(self.dialogs);
        } catch (err) { }
    }

    public joinToDialog(dialog): Promise<any> {
        return new Promise((resolve, reject) => {
            const jidOrUserId = QB.chat.helpers.getRoomJidFromDialogId(dialog._id);

            QB.chat.muc.join(jidOrUserId, function(resultStanza) {
                for (let i = 0; i < resultStanza.childNodes.length; i++) {
                    const elItem = resultStanza.childNodes.item(i);
                    if (elItem.tagName === 'error') {
                        reject()
                    } else {
                        resolve(resultStanza);
                    }
                }
            });
        });
    }

    public getRecipientUserId(users) {
        const self = this;
        if (users.length === 2) {
            return users.filter(function(user) {
                if (user !== +localStorage.getItem('quickblox_user_id')) {
                    return user;
                }
            })[0];
        }
    }

}
