import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { DeleteSalonComponent } from 'src/app/shared/delete-salon/delete-salon.component';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { MetaData, PromotionalMessageResponse } from '../promotional-message.model';
import { PromotionalMessageService } from '../promotional-message.service';

export interface PromotionalMessages {
    title: string;
    body: string;
}
@Component({
    selector: 'app-promotional-messages-list',
    templateUrl: './promotional-messages-list.component.html',
    styleUrls: ['./promotional-messages-list.component.scss']
})
export class PromotionalMessagesListComponent implements OnInit {
    currentPage: number = 1;
    offset: number = 10;
    isLoadingApi: boolean;
    isQuoteListEmpty;
    responseMessage: string;
    promotionalMessagesList: PromotionalMessageResponse;
    metaData: MetaData;
    salonId: number;
    displayedColumns: string[] = ['title', 'body'];
    promotionalMessagesDataSource: NotificationDataSource;
    skeletonHead: string[] = ['Notification Title', 'Notification Body'];
    skeletonColumn: string[] = ['notify-title', ''];
    promotionalDataSub: Subscription;
    promotionalLoadingSub: Subscription;
    promotionalEmptySub: Subscription;

    constructor(
        private promotionalMessageService: PromotionalMessageService,
        public dialog: MatDialog,
        public titleService: Title,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + 'Notification Management');
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.getPromotionalMessagesList();
        this.subscribeData();
    }

    getPromotionalMessagesList() {
        this.promotionalMessagesDataSource = new NotificationDataSource(this.promotionalMessageService);
        this.promotionalMessagesDataSource.getNotificationListService(this.salonId, this.currentPage, this.offset);
    }

    subscribeData() {
        this.promotionalDataSub = this.promotionalMessagesDataSource.observeNotificationResponse.subscribe(data => {
            this.promotionalMessagesList = data;
            this.metaData = this.promotionalMessagesList.meta_data;
        });

        this.promotionalLoadingSub = this.promotionalMessagesDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingApi = isLoading;
        });

        this.promotionalEmptySub = this.promotionalMessagesDataSource.observeNotificationEmpty.subscribe(isListEmpty => {
            this.isQuoteListEmpty = isListEmpty;
        });
    }

    ngOnDestroy() {
        if (!!this.promotionalDataSub) this.promotionalDataSub.unsubscribe();
        if (!!this.promotionalLoadingSub) this.promotionalLoadingSub.unsubscribe();
        if (!!this.promotionalEmptySub) this.promotionalEmptySub.unsubscribe();
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.promotionalMessagesDataSource.getNotificationListService(this.salonId, this.currentPage, this.offset);
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
            if (response !== undefined) {
                this.promotionalMessagesDataSource.getNotificationListService(this.salonId, this.currentPage, this.offset);
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

export class NotificationDataSource extends DataSource<PromotionalMessages> {
    private observeNotification = new BehaviorSubject<PromotionalMessages[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeNotificationEmpty = new BehaviorSubject<boolean>(false);
    public observeNotificationResponse = new Subject<PromotionalMessageResponse>();

    constructor(private promotionalMessageService: PromotionalMessageService, ) {
        super();
    }
    getNotificationListService(salonId: number, page: number, offset: number, ) {
        this.observeLoader.next(true);
        this.promotionalMessageService.getPromotionalMessagesList(salonId, page, offset, (status, response) => {
            this.observeLoader.next(false);
            if (status === ServiceResponse.success) {
                this.observeNotificationEmpty.next(false);
                this.observeNotificationResponse.next(response);
                this.observeNotification.next(response.notifications);
            } else if (status === ServiceResponse.emptyList) {
                this.observeNotificationResponse.next(new PromotionalMessageResponse());
                this.observeNotification.next(new Array<PromotionalMessages>());
                this.observeNotificationEmpty.next(true);
            } else {
                this.observeNotificationEmpty.next(true);
            }
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<PromotionalMessages[]> {
        return this.observeNotification.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}