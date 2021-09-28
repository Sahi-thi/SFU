import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DeleteSalonComponent } from 'src/app/shared/delete-salon/delete-salon.component';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { DailyWordsResponse, MetaData, DailyWords } from '../daily-words.model';
import { DailyWordsService } from '../daily-words.service';

@Component({
    selector: 'app-daily-words-list',
    templateUrl: './daily-words-list.component.html',
    styleUrls: ['./daily-words-list.component.scss']
})
export class DailyWordsListComponent implements OnInit {
    currentPage: number = 1;
    offset: number = 10;
    isLoadingApi: boolean;
    isQuoteListEmpty: boolean;
    responseMessage: string;
    dailyWordsResponse: DailyWordsResponse;
    dailyWordsList: DailyWords[];

    metaData: MetaData;
    constructor(private dailWordsService: DailyWordsService, public dialog: MatDialog,
        public titleService: Title
    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + 'Daily Words Of Wisdom');
        this.getDailyWordsList(this.currentPage, this.offset);
    }

    getDailyWordsList(currentPage, offset) {
        this.isLoadingApi = true;
        this.dailWordsService.getDailyWordsWisdomList(currentPage, offset, (status, response) => {
            this.isLoadingApi = false;

            if (status === ServiceResponse.success) {
                this.isQuoteListEmpty = false;
                this.dailyWordsResponse = response
                this.dailyWordsList = this.dailyWordsResponse.quotes;
                this.metaData = response.meta_data;
            }
            else if (status === ServiceResponse.emptyList) {
                this.isQuoteListEmpty = true;
                this.responseMessage = response.message;
                this.dailyWordsList = null
            }

        })
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.getDailyWordsList(this.currentPage, this.offset)
    }

    openQuoteDeleteDialog(listId, listTitle) {
        event.stopPropagation();
        let dialogref = this.dialog.open(DeleteSalonComponent, {
            width: "330px",
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                listId,
                listType: 'this Quote',
                listTitle: '',
            },
        });
        dialogref.afterClosed().subscribe(response => {

            if (this.dailyWordsList && this.dailyWordsList.length === 1 && this.currentPage !== 1) {
                this.currentPage = this.currentPage - 1;
            } else {
                this.currentPage = this.currentPage;
            }
            if (response !== undefined) {
                this.getDailyWordsList(this.currentPage, this.offset);
            }
        })
    }

    activeList(value): boolean {
        return value === 'Active' ? false : true
    }

    openEditMenu() {
        localStorage.setItem('buttonTitle', 'SAVE');
        localStorage.setItem('quoteTitle', 'Edit');
        localStorage.setItem('isFromDetails', 'false');
    }
}
