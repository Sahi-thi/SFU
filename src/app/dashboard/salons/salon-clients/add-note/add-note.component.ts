import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Constants } from '../../../../../utils/constants';
import { SalonClientsService } from '../salon-clients.service';
import { ServiceResponse } from 'src/utils/enums';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add-note',
    templateUrl: './add-note.component.html',
    styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit {

    noteFormGroup: FormGroup;
    cardTitle = 'Add Notes';
    responseMessage = '';
    noteData = '';

    isFromDetails: boolean;
    isCallingNote = false;
    isAPICalling = false;

    buttonTitle = 'ADD';
    salonId = null;
    clientId = null;
    noteId = null;
    navigationFrom = '';

    constructor(
        private location: Location,
        private titleService: Title,
        private activatedRoute: ActivatedRoute,
        private salonClientService: SalonClientsService
    ) { }

    ngOnInit() {

        this.navigationFrom = localStorage.getItem("navigationFrom");
        this.clientId = + localStorage.getItem("client_id");
        this.salonId = + localStorage.getItem("salon_id");
        this.addNoteFormData();

        this.activatedRoute.params.subscribe((params) => {
            if (params) {
                this.noteId = params.note_id;
            }
        });

        if (this.navigationFrom === 'list') {
            this.cardTitle = 'Note Details';
            this.buttonTitle = 'EDIT';
        } else if (this.navigationFrom === 'edit') {
            this.cardTitle = 'Edit';
            this.buttonTitle = 'SAVE';
        } else {
            this.buttonTitle = 'ADD';
            this.cardTitle = 'Add Notes';
        }

        if (this.noteId) {
            this.getNoteDetails();
        }

    }

    addNoteFormData() {
        this.noteFormGroup = new FormGroup({
            note: new FormControl('', [Validators.required])
        });
    }

    submitNoteForm(buttonTitle: string) {
        if (buttonTitle === 'EDIT') {
            this.buttonTitle = "SAVE";
            this.cardTitle = "Edit";
            this.noteFormGroup.enable();
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Note');
        }
        else
            if (this.noteFormGroup.valid) {
                this.buttonTitle === 'ADD' ? this.callCreateNote() : this.callEditNote();
            }

    }

    callCreateNote() {
        this.isAPICalling = true;

        const createRequest = {};
        createRequest['salon_id'] = this.salonId;
        createRequest['client_id'] = this.clientId;
        createRequest['note'] = this.noteFormGroup.value.note

        this.salonClientService.AddNoteService(createRequest, (status, response) => {
            this.isAPICalling = false;

            if (status === ServiceResponse.success) {
                this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    disableNote() {
        this.noteFormGroup.disable();
        this.buttonTitle = 'EDIT';
        this.navigationFrom = 'edit';
        this.cardTitle = 'Note Details';
    }
    callEditNote() {
        this.isAPICalling = true;
        this.salonClientService.UpdateNoteService(this.noteFormGroup.value, this.salonId, this.clientId, this.noteId, (status, response) => {
            this.isAPICalling = false;
            if (status === ServiceResponse.success) {
                this.navigationFrom === 'list' && this.buttonTitle === 'SAVE' ? this.disableNote() : this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    getNoteDetails() {
        this.buttonTitle === 'SAVE' ? this.noteFormGroup.enable() : this.noteFormGroup.disable();
        this.isCallingNote = true;
        this.salonClientService.GetNoteService(this.salonId, this.clientId, this.noteId, (status, response) => {
            this.isCallingNote = false;
            if (status === ServiceResponse.success) {
                this.noteFormGroup.controls['note'].setValue(response.notes.note);
                this.noteData = response.notes.note;
            }
        })
    }

    onClickGoBack(buttonTitle) {
        if (this.navigationFrom === 'list' && buttonTitle === 'SAVE') {
            this.noteFormGroup.controls['note'].setValue(this.noteData);
            this.disableNote();
        } else {
            this.location.back();
        }

    }
}
