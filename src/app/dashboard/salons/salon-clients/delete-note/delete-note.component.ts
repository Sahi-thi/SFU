import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SalonClientsService } from '../salon-clients.service';

@Component({
    selector: 'app-delete-note',
    templateUrl: './delete-note.component.html',
    styleUrls: ['./delete-note.component.scss']
})
export class DeleteNoteComponent implements OnInit {
    isApiLoading = false;
    isDeleted = false;
    responseMessage = "";
    salonId = null;
    clientId = null;
    noteId = null;
    note = '';
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<DeleteNoteComponent>,
        private salonClientService: SalonClientsService
    ) { }

    ngOnInit() {
        this.dialogRef.disableClose = true;
        this.salonId = this.data.salon_id;
        this.clientId = this.data.client_id;
        this.noteId = this.data.note_id;
        this.note = this.data.note;
    }

    callDeleteIngredient() {
        this.isApiLoading = true;
        this.salonClientService.DeleteNoteService(this.salonId, this.clientId, this.noteId, (status, response) => {
            if (status === 1) {
                this.isApiLoading = false;
                this.isDeleted = true
            } else {
                this.isApiLoading = false;
                this.responseMessage = response;
            }
        });
    }

}
