import { QBCon } from '../environments/environment';

declare var QB: any

export const QBconfig = {

    credentials: {
        appId: QBCon.appId,
        authKey: QBCon.authKey,
        authSecret: QBCon.authSecret,
        accountKey: QBCon.accountKey
    },

    appConfig: {

        on: {
            sessionExpired: function(handleResponse, retry) {
                QB.createSession(function(error, session) {
                    retry(session);
                });
            }
        },

        chatProtocol: {
            active: 2,
        },

        streamManagement: {
            enable: true,
        },

        debug: {
            mode: false,
            file: null,
        },

        webrtc: {
            answerTimeInterval: 60,
            dialingTimeInterval: 5,
            disconnectTimeInterval: 35,
            statsReportTimeInterval: 5
        }

    },
};

export const CONSTANTS = {

    DIALOG_TYPES: {
        CHAT: 3,
        GROUPCHAT: 2,
        PUBLICCHAT: 1,
    },

    ATTACHMENT: {
        TYPE: 'image',
        BODY: '[attachment]',
        MAXSIZE: 2 * 1000000, // set 2 megabytes,
        MAXSIZEMESSAGE: 'Image is too large. Max size is 2 mb.',
    },

    NOTIFICATION_TYPES: {
        NEW_DIALOG: '1',
        UPDATE_DIALOG: '2',
        LEAVE_DIALOG: '3',
    },

};
