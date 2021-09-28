import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { VideoCallListenerService } from '../videoCallListeners.service';
import { Subscription } from 'rxjs';
declare var QB: any;

@Component({
    selector: 'app-conformation-dialog',
    templateUrl: './conformation-dialog.component.html',
    styleUrls: ['./conformation-dialog.component.scss']
})
export class ConformationDialogComponent implements OnInit {
    conformationDialogCloseSub: Subscription
    profilePhoto = "";
    callerName = '';
    audio
    userOccupentId
    callingSession

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<ConformationDialogComponent>,
        private videoCallListenerService: VideoCallListenerService
    ) { }

    ngOnInit() {
        this.callerName = this.data.callerName
        this.profilePhoto = this.data.profilePhot
        this.audio = this.data.audio
        this.userOccupentId = this.data.userOccupentId
        this.callingSession = this.data.callingSession

        this.conformationDialogCloseSub = this.videoCallListenerService.confirmationDialogSubject.subscribe((boolean) => {
            if (boolean) {
                this.dialogRef.close();
                this.audio.pause()
            }
        })
    }

    ngOnDestroy() {
        setTimeout(() => {
            this.conformationDialogCloseSub.unsubscribe();
            this.videoCallListenerService.confirmationDialogSubject.next(false);
            this.videoCallListenerService.closeDialogSubject.next(false);
        }, 3000)
    }

    acceptTheCall() {
        this.dialog.open(VideoDialogComponent, {
            // 'formList-dialog'
            width: "1250px",
            panelClass: ['video-dialog', 'card-shadow'],
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',

            data: {
                isFromDialog: true,
                clientId: this.userOccupentId,
                callingSession: this.callingSession
            },

        });
        this.audio = this.audio.pause()
    }

    callerSubscriptions() {
        this.videoCallListenerService.callerData.subscribe((session) => {
        })
    }

    rejectCall() {
        let session, extension, userId
        this.dialogRef.close()
        this.audio = this.audio.pause();
        this.videoCallListenerService.callerData.subscribe((data) => {
            session = data.callerSession
            extension = data.callerExtension
            userId = data.callerId
        })
        this.videoCallListenerService.onRejectCallListener((session), userId, (extension));
    }

}
