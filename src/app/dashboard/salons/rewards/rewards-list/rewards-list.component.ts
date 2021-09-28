import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { DeleteSalonComponent } from 'src/app/shared/delete-salon/delete-salon.component';
import { Constants } from 'src/utils/constants';
import { ServiceResponse } from 'src/utils/enums';
import { RewardFilterComponent } from '../reward-filter/reward-filter.component';
import { MetaData, Reward, RewardResponse } from '../reward.model';
import { RewardService } from '../reward.service';

export interface RewardsElement {
    title: string;
    required_points: number;
    start_date: string;
    end_date: string;
    status: string;
}

@Component({
    selector: 'app-rewards-list',
    templateUrl: './rewards-list.component.html',
    styleUrls: ['./rewards-list.component.scss']
})
export class RewardsListComponent implements OnInit {

    @ViewChild(MatButton, { static: false }) button: MatButton;

    currentPage: number = 1;
    offset: number = 10;
    searchString: string = "";
    state: string = "";
    status: string = "";
    salonId: number;
    startDate = '';
    endDate = '';
    rewardDataSource: RewardDataSource;
    reward: Reward[];
    rewardResponse: RewardResponse
    metaData: MetaData;
    rewardEmptySub: Subscription;
    rewardDataSub: Subscription;
    rewardLoadingSub: Subscription;
    requestObject;
    isLoadingAPI: boolean
    isRewardEmpty: boolean;
    displayedColumns: string[] = ['title', 'start_date', 'end_date', 'status', 'edit', 'delete'];
    skeletonHead: string[] = ['Title', 'Start Date', 'End Date', 'Status', '', ''];
    skeletonColumn: string[] = ['reward-title', 'reward-start', 'reward-end', 'reward-status', 'w-40', 'w-40'];

    constructor(
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private rewardService: RewardService,
        private titleService: Title,

    ) { }

    ngOnInit() {

        this.titleService.setTitle(Constants.skinForYou + 'Rewards');

        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else {
                this.salonId = +localStorage.getItem('salon_id')
            }
        });
        this.getRewardData();
        this.subscribeData();

    }
    activeList(value): boolean {
        return value === 'Active' ? false : true
    }
    isRewardAdded() {
        if (this.reward) {
            return true
        } else {
            return this.searchString === '' && this.startDate === '' && this.endDate === '' && this.status === '' ? false : true
        }
    }
    getRewardData() {
        if (this.rewardService.listCurrentPage != -1) {
            this.currentPage = this.rewardService.listCurrentPage
        }
        this.rewardDataSource = new RewardDataSource(this.rewardService);
        this.rewardDataSource.getRewardListService(this.salonId, this.searchString, this.currentPage, this.offset, this.startDate, this.endDate, this.status);

    }

    subscribeData() {
        this.rewardDataSub = this.rewardDataSource.observeRewardResponse.subscribe(usersListData => {
            this.rewardResponse = usersListData;
            this.reward = this.rewardResponse.rewards;
            this.metaData = this.rewardResponse.meta_data;
        });

        this.rewardLoadingSub = this.rewardDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.rewardEmptySub = this.rewardDataSource.observeRewardEmpty.subscribe(isListEmpty => {
            this.isRewardEmpty = isListEmpty;
        });
    }

    ngOnDestroy() {
        if (!!this.rewardDataSub) this.rewardDataSub.unsubscribe();
        if (!!this.rewardLoadingSub) this.rewardLoadingSub.unsubscribe();
        if (!!this.rewardEmptySub) this.rewardEmptySub.unsubscribe();
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.rewardDataSource.getRewardListService(
            this.salonId,
            this.searchString,
            this.currentPage,
            this.offset,
            this.startDate,
            this.endDate,
            this.status
        );
    }
    clearSearch() {
        this.searchString = "";
        this.rewardDataSource.getRewardListService(
            this.salonId,
            this.searchString,
            this.currentPage,
            this.offset,
            this.startDate,
            this.endDate,
            this.status
        );
    }
    openRewardFilter() {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let serviceDialogref = this.dialog.open(RewardFilterComponent, {
            width: "365px",
            position: { right: right + 'px', top: top + 'px' },
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                salonId: this.salonId,
                searchString: this.searchString,
                startDate: this.startDate,
                endDate: this.endDate,
                status: this.status,
            },
        });
        serviceDialogref.afterClosed().subscribe((response) => {
            if (response !== undefined) {
                this.currentPage = 1;
                this.rewardDataSource.getRewardListService(
                    this.salonId,
                    this.searchString,
                    this.currentPage,
                    this.offset,
                    this.startDate = response.startDate,
                    this.endDate = response.endDate,
                    this.status = response.status
                )
            }
        });

    }

    navigateToInfo(element) {
        localStorage.setItem('buttonTitle', 'EDIT');
        localStorage.setItem('rewardTitle', element.title);
        localStorage.setItem('isFromDetails', 'true');
    }
    navigationDetails() {
        this.requestObject = {}
        this.rewardService.rewardFilterDetails.next(this.requestObject)
    }

    openEditMenu() {
        localStorage.setItem('buttonTitle', 'SAVE');
        localStorage.setItem('rewardTitle', 'Edit');
        localStorage.setItem('isFromDetails', 'false');

        this.navigationDetails()
    }
    openRewardDeleteDialog(listId) {
        event.stopPropagation();
        let dialogref = this.dialog.open(DeleteSalonComponent, {
            width: "330px",
            panelClass: "filter-dialog",
            hasBackdrop: true,
            autoFocus: false,
            backdropClass: 'backdropClassBg',
            data: {
                listId,
                listType: 'reward',
                salonId: this.salonId
            },
        });
        dialogref.afterClosed().subscribe(response => {
            if (this.reward && this.reward.length === 1 && this.searchString === '' && this.currentPage !== 1) {
                this.currentPage = this.currentPage - 1;
            } else {
                this.currentPage = this.currentPage;
            }
            response && this.rewardDataSource.getRewardListService(
                this.salonId,
                this.searchString,
                this.currentPage,
                this.offset,
                this.startDate,
                this.endDate,
                this.status
            );
        })
    }
    searchSalon(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.rewardDataSource.getRewardListService(
            this.salonId,
            this.searchString,
            this.currentPage,
            this.offset,
            this.startDate,
            this.endDate,
            this.status

        );
    }
}

export class RewardDataSource extends DataSource<Reward> {
    private observeReward = new BehaviorSubject<Reward[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeRewardEmpty = new BehaviorSubject<boolean>(false);
    public observeRewardResponse = new Subject<RewardResponse>();

    constructor(public rewardService: RewardService) {
        super();
    }

    getRewardListService(salonId: number, search: string, offset: number, page: number, startDate: string, endDate: string, status: string) {
        search = search.replace('+', '%2B');

        this.observeLoader.next(true);
        this.rewardService.RewardListService(salonId, search, offset, page, startDate, endDate, status, (status, response) => {
            this.observeLoader.next(false);

            if (status === ServiceResponse.success) {
                this.observeRewardEmpty.next(false);
                this.observeRewardResponse.next(response);
                this.observeReward.next(response.rewards);
            } else if (status === ServiceResponse.emptyList) {
                this.observeRewardResponse.next(new RewardResponse());
                this.observeReward.next(new Array<Reward>());
                this.observeRewardEmpty.next(true);
            } else {
                this.observeRewardEmpty.next(true);
            }

        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Reward[]> {
        return this.observeReward.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void { }

}
