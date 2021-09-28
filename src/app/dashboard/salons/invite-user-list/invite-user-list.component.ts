import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';
import { ServiceResponse } from 'src/utils/enums';
import { InviteClientListResponse, Invitations, MetaData } from '../salon.model';
import { SalonService } from '../salon.service';
import { MatDialog } from '@angular/material/dialog';
import { InviteUserDialogComponent } from '../invite-user-dialog/invite-user-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-invite-user-list',
    templateUrl: './invite-user-list.component.html',
    styleUrls: ['./invite-user-list.component.scss']
})
export class InviteUserListComponent implements OnInit {

    displayedColumns: string[] = ['email', 'invited_by', 'invited_on'];
    skeletonHead: string[] = ['Email', 'Invited By', 'Invited On'];
    skeletonColumn: string[] = ['invite-email', 'invite-by', ''];
    inviteUsersDataSource: InviteUsersDataSource;
    inviteClientListResponse: InviteClientListResponse;
    invitations: Invitations[];
    metaData: MetaData
    inviteDataSub: Subscription;
    inviteLoadingSub: Subscription;
    inviteEmptySub: Subscription;
    isLoadingAPI = false;
    isUsersEmpty = false;
    offset = 10;
    currentPage = 1;
    salonId = null;
    searchString = '';

    constructor(
        public dialog: MatDialog,
        public salonService: SalonService,
        private activatedRoute: ActivatedRoute,

    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.salonId = params['salon_id'];
        });
        this.getInviteUsersData();
        this.subscribeData();
    }

    getInviteUsersData() {
        this.inviteUsersDataSource = new InviteUsersDataSource(this.salonService);
        this.inviteUsersDataSource.getInviteUserListService(this.salonId, this.searchString, this.offset, this.currentPage);
    }

    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.inviteUsersDataSource.getInviteUserListService(this.salonId, this.searchString, this.offset, this.currentPage);
    }

    clearSearch() {
        this.searchString = "";
        this.inviteUsersDataSource.getInviteUserListService(this.salonId, this.searchString, this.offset, this.currentPage)
    }

    subscribeData() {
        this.inviteDataSub = this.inviteUsersDataSource.observeClientsResponse.subscribe(usersListData => {
            this.inviteClientListResponse = usersListData;
            this.invitations = this.inviteClientListResponse.invitations;
            this.metaData = this.inviteClientListResponse.meta_data;
        });

        this.inviteLoadingSub = this.inviteUsersDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.inviteEmptySub = this.inviteUsersDataSource.observeClientsEmpty.subscribe(isUsersListEmpty => {
            this.isUsersEmpty = isUsersListEmpty;
        });
    }

    ngOnDestroy() {
        if (!!this.inviteEmptySub) this.inviteEmptySub.unsubscribe();
        if (!!this.inviteLoadingSub) this.inviteLoadingSub.unsubscribe();
        if (!!this.inviteDataSub) this.inviteDataSub.unsubscribe();
    }

    openDialog() {
        let dialogRef = this.dialog.open(InviteUserDialogComponent, {
            width: "640px",
            panelClass: "invite-dialog",
            data: {
                salonId: this.salonId
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            response &&
                this.inviteUsersDataSource.getInviteUserListService(this.salonId, this.searchString, this.offset, this.currentPage);
        })
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.inviteUsersDataSource.getInviteUserListService(this.salonId, this.searchString, this.offset, this.currentPage);
    }

    // isInvitesAdded() {
    //     if (this.invitations) {
    //         return true
    //     } else {
    //         return this.searchString === '' && !this.isLoadingAPI ? false : true
    //     }
    // }
}

export class InviteUsersDataSource extends DataSource<Invitations> {
    private observeClients = new BehaviorSubject<Invitations[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeClientsEmpty = new BehaviorSubject<boolean>(false);
    public observeClientsResponse = new Subject<InviteClientListResponse>();

    constructor(public salonService: SalonService) {
        super();
    }

    getInviteUserListService(salonId: number, searchString: string, offset: number, page: number) {
        this.observeLoader.next(true);
        let searchObj
        if (searchString) {
            searchObj = { search: searchString }
        } else {
            searchObj = ''
        }
        this.salonService.InviteUsersListService(salonId, searchObj, offset, page, (status, response) => {
            this.observeLoader.next(false);

            if (status === ServiceResponse.success) {
                this.observeClientsEmpty.next(false);
                this.observeClientsResponse.next(response);
                this.observeClients.next(response.invitations);
            } else if (status === ServiceResponse.emptyList) {
                this.observeClientsResponse.next(new InviteClientListResponse());
                this.observeClients.next(new Array<Invitations>());
                this.observeClientsEmpty.next(true);
            } else {
                this.observeClientsEmpty.next(true);
            }

        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Invitations[]> {
        return this.observeClients.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}
