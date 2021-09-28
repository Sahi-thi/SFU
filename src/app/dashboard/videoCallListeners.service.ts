import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare let QB: any;
@Injectable({
    providedIn: 'root',
})

export class VideoCallListenerService {

    public sessionSubject: BehaviorSubject<any> = new BehaviorSubject(null)
    public remoteMediaSubject: BehaviorSubject<any> = new BehaviorSubject(null);
    public detachVideoSubject: BehaviorSubject<any> = new BehaviorSubject(null);
    public unMuteRingTone: BehaviorSubject<any> = new BehaviorSubject(null);
    public callingStatusSubject: BehaviorSubject<any> = new BehaviorSubject(null);
    public closeDialogSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public confirmationDialogSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public callerData: BehaviorSubject<any> = new BehaviorSubject({});

    constructor() { }

    videoCallSetListeners() {
        if (QB.webrtc) {
            try {
                QB.webrtc.onAcceptCallListener = this.onAcceptCallListener.bind(this);
                QB.webrtc.onRemoteStreamListener = this.onRemoteStreamListener.bind(this)
                QB.webrtc.onRejectCallListener = this.onRejectCallListener.bind(this)
                QB.webrtc.onStopCallListener = this.onStopCallListener.bind(this)
                QB.webrtc.onSessionConnectionStateChangedListener = this.onSessionConnectionStateChangedListener.bind(this);
                QB.webrtc.onSessionCloseListener = this.onSessionCloseListener.bind(this)
                QB.webrtc.onUserNotAnswerListener = this.onUserNotAnswerListener.bind(this)
                QB.chat.onSystemMessageListener = this.onSystemMessageListener.bind(this);
            } catch (err) {
                console.log({ err });
            }
        }
    }

    private onSystemMessageListener = function(message) {
        // console.log("Message listener", message);
        if (message.extension === undefined || !message.extension.dialog_id === undefined
        ) {
            return false;
        }
    };

    onUserNotAnswerListener = (session, userId) => {
        if (session.currentUserID == session.initiatorID) {
            this.callingStatusSubject.next('User is not responding')
            this.closeDialogSubject.next(true)
        }
    };

    onSessionCloseListener = (session) => {
        // console.log("onSessionCloseListener", session);
        this.sessionSubject = session;
    };

    onAcceptCallListener = (session, userId, extension) => {
        console.log("onAcceptCallListener", userId);
        try {
            this.unMuteRingTone.next(false)
        } catch (err) {
            console.log({ err });
        }
    };

    onRejectCallListener = (session, userId, extension) => {
        console.log("onRejectCallListener", userId, session);
        session.reject(extension);
    };

    onStopCallListener = (session, userId, extension) => {
        // console.log("onStopCallListener");

        session.stop(extension);
        this.callingStatusSubject.next('Call end by the user');
        this.closeDialogSubject.next(true);
        this.confirmationDialogSubject.next(true);
    };

    onRemoteStreamListener = (session, userId, stream) => {
        console.log("onRemoteStreamListener", userId, stream);

        try {
            this.remoteMediaSubject.next({ 'session': session, 'stream': stream })
        } catch (err) {
            console.log({ err });
        }

    };

    onSessionConnectionStateChangedListener = (session, userId, connectionState) => {
        console.log("onSessionConnectionStateChangedListener", userId);

        if (connectionState === QB.webrtc.SessionConnectionState.CONNECTING) {
            console.log('Connecting....', connectionState);
            this.callingStatusSubject.next('Connecting....')
        }

        if (connectionState === QB.webrtc.SessionConnectionState.CONNECTED) {
            console.log('Connected....', connectionState);

            this.callingStatusSubject.next('Connected....')
        }

        if (connectionState === QB.webrtc.SessionConnectionState.COMPLETED) {
            console.log('Completed....', connectionState);

            this.callingStatusSubject.next('Completed....')
        }

        if (connectionState === QB.webrtc.SessionConnectionState.DISCONNECTED) {
            console.log('Disconnected....', connectionState);

            this.callingStatusSubject.next('Disconnected....')
        }

        if (connectionState === QB.webrtc.SessionConnectionState.CLOSED) {
            console.log('Closed....', connectionState);

            this.callingStatusSubject.next('Closed....');
        }
    };

}