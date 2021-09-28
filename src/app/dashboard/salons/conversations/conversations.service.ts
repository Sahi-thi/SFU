import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment, quickblox } from 'src/environments/environment';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { QBconfig } from '../../../QBconfig';
import { DefaultResponse } from './conversation.model';
import { QBHelper } from './quickblox/helpers/qbHelper';
declare var QB: any;
@Injectable({

    providedIn: 'root',
})
export class ConversationsService {
    public user: any;
    public defaultResponse: DefaultResponse;
    public listCurrentPage = -1;
    currentDialogEvent: EventEmitter<any> = new EventEmitter();
    sessionResult = null;

    constructor(
        private qbHelper: QBHelper,
        protected httpClient: HttpClient,
    ) { }

    initializeQuickBlox() {

        if (!QB.webrtc) {
            QB.init(
                QBconfig.credentials.appId,
                QBconfig.credentials.authKey,
                QBconfig.credentials.authSecret,
                QBconfig.credentials.accountKey,
                QBconfig.appConfig
            );
        }
    }

    isSessionAvailable() {
        this.sessionResult = QB && QB.service ? QB.service.getSession() : null;
        return this.sessionResult;
    }

    public login(loginPayload) {

        return new Promise((resolve, reject) => {
            // console.log({ resolve });
            // console.log({ reject });

            const user = {
                login: loginPayload.email,
                password: quickblox.login,
            };
            const loginSuccess = (loginRes) => {
                // console.log("loginSuccess", loginRes);

                this.setUser(loginRes);
                this.qbHelper.qbChatConnection(loginRes.id, user.password).then(

                    (chatRes) => {
                        // console.log("qbChatConnection chatRes", chatRes);
                        resolve(true);
                    },
                    (chatErr) => {
                        // console.log("qbChatConnection chatErr", chatErr);
                        resolve(true);

                    }
                );
            };
            this.qbHelper.qbCreateConnection(user).then((loginRes) => {
                // console.log("qbCreateConnection", loginRes);

                loginSuccess(loginRes);
            });
        });
    }
    public setUser(User) {
        this.user = User;
        localStorage.setItem('loggedinUser', User);
        localStorage.setItem('quickblox_user_id', User.id);
    }

    usersChatList(salonId: number, search: string, callback) {
        let searchString;
        if (search) {
            searchString = '?search=' + search;
        } else {
            searchString = '';
        }
        const url = environment.api_end_point + Constants.salon + salonId + '/chat/users' + searchString;

        this.httpClient.get(url).subscribe(
            (data) => {
                const response = data as DefaultResponse;
                this.defaultResponse = response;
                if (this.defaultResponse.statusCode === 200) {
                    callback(ServiceResponse.success, this.defaultResponse);
                } else if (this.defaultResponse.statusCode === 204) {
                    callback(ServiceResponse.emptyList, this.defaultResponse);
                } else {
                    callback(ServiceResponse.error, this.defaultResponse);
                }
            },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            }
        );
    }
    getChatAvailableUsers(callback) {
        let salonID = -1;
        if (localStorage.getItem('userRole') === 'SA') {
            salonID = +localStorage.getItem('salon_id');
        } else {
            salonID = +localStorage.getItem('salon_id');
        }

        this.httpClient
            .get(environment.api_end_point + 'salon/' + salonID + '/chat/users')
            .subscribe(
                (result: any) => {
                    if (result.statusCode === 200) {
                        callback(ServiceResponse.success, result.data);
                    } else {
                        callback(ServiceResponse.emptyList, result.data);
                    }
                },
                (error: HttpErrorResponse) => {
                    callback(ServiceResponse.error, error.error);
                }
            );
    }

    createChatDialog(salonID, request, callback) {
        const url = environment.api_end_point + 'salon/' + salonID + '/chat/dialog/create'
        this.httpClient
            .post(url, request)
            .subscribe(
                (result: any) => {
                    if (result.statusCode === 201) {
                        callback(ServiceResponse.success, result.conversation);
                    } else {
                        callback(ServiceResponse.emptyList, result.conversation);
                    }
                },
                (error: HttpErrorResponse) => {
                    callback(ServiceResponse.error, error.error);
                }
            );
    }
}