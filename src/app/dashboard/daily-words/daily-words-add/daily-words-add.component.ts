import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DailyWords, DailyWordsDetails, DailyWordsDetailsResponse } from '../daily-words.model';
import { DailyWordsService } from '../daily-words.service';
import { ServiceResponse } from 'src/utils/enums';
import * as XLSX from "xlsx";
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Constants } from 'src/utils/constants';

@Component({
    selector: 'app-daily-words-add',
    templateUrl: './daily-words-add.component.html',
    styleUrls: ['./daily-words-add.component.scss']
})
export class DailyWordsAddComponent implements OnInit {
    fileName = '';
    buttonTitle = "ADD";
    jsonData: Array<any>;
    public dailyWordsFormGroup: FormGroup;
    requestObject: DailyWordsDetails;
    responseMessage = '';
    quoteTitle = 'Add a Quote'
    errorMessage = '';
    quoteId: number;
    isFromDetails = false;
    quoteDetailResponse: DailyWordsDetailsResponse;
    quoteDetails: DailyWords;
    isCallingQuote: boolean;
    isLoadingAPI: boolean;
    selectedFile = File;
    constructor(private dailyWordsService: DailyWordsService,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        public titleService: Title

    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            if (params['id'] != undefined) {
                this.quoteId = params['id']
            }
        });
        if (this.quoteId) {
            this.buttonTitle = localStorage.getItem('buttonTitle');
            this.quoteTitle = localStorage.getItem('quoteTitle');
            this.isFromDetails = JSON.parse(localStorage.getItem('isFromDetails'));
            this.callQuoteDetail();
        } else this.titleService.setTitle(Constants.skinForYou + 'Add-Quote');

        this.addQuoteData();
    }
    addQuoteData() {
        this.dailyWordsFormGroup = new FormGroup({
            quote: new FormControl('', [Validators.required]),

        });
    }
    async submitDailyWordsForm(buttonTitle) {
        if (buttonTitle === 'EDIT') {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Quote');
        } else {
            if (this.dailyWordsFormGroup.valid) {
                await this.requestDetails();
                this.buttonTitle === 'ADD' ? this.callCreateDailyWordQuote() : this.callEditDailyWordQuote();
            }
            else {
                this.uploadQuotes();
            }
        }
    }
    enableEditMode() {
        this.buttonTitle = "SAVE";
        this.quoteTitle = "Edit";
    }
    callQuoteDetail() {
        this.isLoadingAPI = true;
        this.dailyWordsService.getQuoteDetailsService(this.quoteId, (status, response) => {
            if (status === ServiceResponse.success) {
                this.isLoadingAPI = false;
                this.quoteDetailResponse = response;
                this.quoteDetails = this.quoteDetailResponse.quote;
                this.setQuoteData();
            } else {
                this.isLoadingAPI = false;
                this.responseMessage = response.message;
            }
        });
    }
    uploadQuotes() {
        if (this.dailyWordsFormGroup.invalid && this.jsonData === undefined) this.errorMessage = 'Please insert Quote / upload  file';
        if (this.jsonData !== undefined) {
            this.errorMessage = ''
            this.dailyWordsFormGroup.controls['quote'].clearValidators();
            this.dailyWordsFormGroup.controls['quote'].updateValueAndValidity();
            this.dailyWordsService.uploadQuoteService(this.jsonData, (status, response) => {
                if (status === ServiceResponse.success) {
                    this.location.back();
                } else {
                    this.responseMessage = response.message;
                }
            })
        }
    }
    setQuoteData() {
        if (this.buttonTitle === 'EDIT') {
            this.dailyWordsFormGroup.disable()

        } else {
            this.titleService.setTitle(Constants.skinForYou + 'Edit-Quote');
            this.dailyWordsFormGroup.enable()
        }
        const quote = this.quoteDetails;

        this.dailyWordsFormGroup.setValue({
            quote: quote.quote,

        });

    }
    callCreateDailyWordQuote() {
        this.isCallingQuote = true;
        this.dailyWordsService.createQuoteService(this.requestObject, (status, response) => {
            this.isCallingQuote = false;
            if (status === ServiceResponse.success) {
                this.location.back();
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    async requestDetails() {
        this.requestObject = {
            ...this.dailyWordsFormGroup.value,
        }
    }

    onClickGoBack() {
        this.location.back();
    }

    fileEvent(e: Event) {
        let file = (e.target as HTMLInputElement).files[0];
    }
    onFileChange(ev) {

        let workBook = null;
        if (ev.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || ev.target.files[0].type === 'application/vnd.ms-excel' || ev.target.files[0].type === 'text/csv') {

            const reader = new FileReader();
            this.errorMessage = ''
            const file = ev.target.files[0];
            reader.onload = event => {
                const data = reader.result;
                workBook = XLSX.read(data, { type: "binary" });
                this.jsonData = workBook.SheetNames.reduce((initial, name) => {
                    const sheet = workBook.Sheets[name];
                    console.log({ sheet });

                    if (sheet.A1.v === 'Quote') {
                        this.fileName = file.name;
                        initial['quotes'] = XLSX.utils.sheet_to_json(sheet);
                        return initial;
                    }
                    else {
                        this.errorMessage = 'Please enter a valid format'
                    }

                }, {});

            };
            reader.readAsBinaryString(file);
        }
        else {
            this.errorMessage = 'Please upload only .csv/.xlsx formats'
        }
    }

    cancelFile() {

        this.fileName = '';
        this.jsonData = undefined;
    }

    callEditDailyWordQuote() {
        this.isCallingQuote = true;
        this.dailyWordsService.updateQuoteService(this.quoteId, this.requestObject, (status, response) => {
            this.isCallingQuote = false;
            if (status === ServiceResponse.success) {
                this.buttonTitle === 'SAVE' && this.isFromDetails ? this.disableEditMode() : this.location.back();
            } else { }
        })
    }

    disableEditMode() {

    }

}
