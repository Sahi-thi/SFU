import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VideoCallListenerService } from '../videoCallListeners.service';
import { Subscription } from 'rxjs';
declare var QB: any;
@Component({
    selector: 'app-video-dialog',
    templateUrl: './video-dialog.component.html',
    styleUrls: ['./video-dialog.component.scss']
})

export class VideoDialogComponent implements OnInit, OnDestroy {

    detachVideoSubscription: Subscription
    callingStatusSubscription: Subscription
    remoteMediaSubscription: Subscription
    dialogCloseSubscription: Subscription
    opponentIds;
    loginUserName = '';
    mediaSession
    isAudioEnabled = true
    audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    isFromDialog
    callingStatus = "";
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<VideoDialogComponent>,
        private videoCallListenerService: VideoCallListenerService
    ) {
    }

    ngOnInit() {
        this.dialogRef.disableClose = true;
        this.opponentIds = this.data.clientId;
        console.log(this.opponentIds);
        console.log(this.data);

        if (this.data.callingSession) {
            this.mediaSession = this.data.callingSession
        }
        this.isFromDialog = this.data.isFromDialog
        this.loginUserName = this.data.loginUserName
        this.isFromDialog === true ? this.acceptingIncomingCall() : this.initiateVideoCall();
        this.videoCallSubscriptions();
    }

    videoCallSubscriptions() {

        this.callingStatusSubscription = this.videoCallListenerService.callingStatusSubject.subscribe((title) => {
            if (title) {
                this.callingStatus = title
            }
        })

        this.remoteMediaSubscription = this.videoCallListenerService.remoteMediaSubject.subscribe((obj) => {
            console.log("remoteMediaSubject", obj);

            if (obj) {
                obj.session.attachMediaStream('remote_video', obj.stream);
                this.audio.pause();
            }
        })

        this.dialogCloseSubscription = this.videoCallListenerService.closeDialogSubject.subscribe((obj) => {
            if (obj) {
                setTimeout(() => {
                    this.dialogRef.close();
                }, 2000)
            }
        })

        this.detachVideoSubscription = this.videoCallListenerService.detachVideoSubject.subscribe((session) => {
            console.log("detachVideoSubject", session);

            if (session) {
                session.detachMediaStream('localVideo');
                session.detachMediaStream('remote_video');
                this.audio.pause();
                this.opponentIds = [];
            }
        })
    }

    ngOnDestroy() {
        setTimeout(() => {
            this.videoCallListenerService.callingStatusSubject.next(null);
            this.videoCallListenerService.detachVideoSubject.next(null)
            this.videoCallListenerService.closeDialogSubject.next(false)
            this.videoCallListenerService.remoteMediaSubject.next(null)
            this.videoCallListenerService.confirmationDialogSubject.next(false);
        }, 100)
        this.callingStatusSubscription.unsubscribe();
        this.remoteMediaSubscription.unsubscribe();
        this.detachVideoSubscription.unsubscribe();
        this.dialogCloseSubscription.unsubscribe();

    }

    initiateVideoCall() {
        this.callingStatus = 'Calling....'
        var callersIds = this.opponentIds;
        var sessionType = QB.webrtc.CallType.VIDEO;
        var additionalOptions = {};
        console.log("callersIds", callersIds);

        this.mediaSession = QB.webrtc.createNewSession(callersIds, sessionType, null, additionalOptions);
        console.log(this.mediaSession);

        var mediaParams = {
            audio: true,
            video: true,
            elemId: "localVideo",
            options: {
                muted: true,
            },
        };

        this.mediaSession.getUserMedia(mediaParams, (error, stream) => {
            const self = this;
            console.log({ error });
            console.log({ stream });

            if (!error) {
                this.mediaSession.call({}, function() {
                    if (!window.navigator.onLine) {
                        self.mediaSession.stop({});
                    } else { }
                });
            } else { }
        });

    }

    endIncomingCall() {
        let session, extension, userId
        this.dialogRef.close();

        if (this.isFromDialog) {
            this.videoCallListenerService.callerData.subscribe((data) => {
                session = data.callerSession
                extension = data.callerExtension
                userId = data.callerId
            })
            this.videoCallListenerService.onStopCallListener(session, userId, extension)

        } else {
            session = this.mediaSession
            extension = {},
                userId = this.opponentIds
            this.videoCallListenerService.onStopCallListener(session, userId, extension)

        }
    }

    switchMediaTrack = (track) => {
        this.mediaSession.localStream.getVideoTracks()[0].stop();
        var stream = this.mediaSession.localStream.clone();
        stream.removeTrack(stream.getVideoTracks()[0]);
        stream.addTrack(track);
        this.mediaSession.localStream.getAudioTracks()[0].stop();
        this.mediaSession._replaceTracks(stream);
        this.mediaSession.localStream = stream;
        return true;
    };

    acceptingIncomingCall() {
        var mediaParams = {
            audio: true,
            video: true,
            elemId: "localVideo",
            options: {
                muted: true,
            },
        };

        const scope = this
        this.mediaSession.getUserMedia(mediaParams, function(err, stream) {
            if (err || !stream.getAudioTracks().length) {
                var errorMsg = '';
                scope.mediaSession.stop({});
            } else {
                scope.mediaSession.accept({});
            }
        });

    }

    toggleLocalAudio() {
        if (this.isAudioEnabled) {
            this.mediaSession.mute('audio');
        } else {
            this.mediaSession.unmute('audio');
        }
        this.isAudioEnabled = !this.isAudioEnabled
    }

}
