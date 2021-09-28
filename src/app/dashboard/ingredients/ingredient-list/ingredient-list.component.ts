import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ServiceResponse } from 'src/utils/enums';
import { AddIngredientComponent } from '../add-ingredient/add-ingredient.component';
import { DeleteIngredientComponent } from '../delete-ingredient/delete-ingredient.component';
import { IngredientListResponse, Ingredients, MetaData } from '../ingredient.model';
import { IngredientService } from '../ingredient.service';
import { Title } from '@angular/platform-browser';
import { Constants } from '../../../../utils/constants';

@Component({
    selector: 'app-ingredient-list',
    templateUrl: './ingredient-list.component.html',
    styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit {

    displayedColumns: string[] = ['ingredient', 'edit', 'delete'];
    ingredientsDataSource: IngredientsDataSource;
    ingredientListResponse: IngredientListResponse
    ingredients: Ingredients[];
    metaData: MetaData;
    ingredientDataSub: Subscription;
    ingredientEmptySub: Subscription;
    ingredientLoaderSub: Subscription;
    skeletonHead: string[] = ['Ingredients', '', ''];
    skeletonColumn: string[] = ['', 'w-40', 'w-40'];
    currentPage: number = 1;
    offset: number = 10;
    searchString: string = "";
    isIngredientsEmpty = false;
    isLoadingAPI = false;

    @ViewChild(MatButton, { static: false }) button: MatButton;

    constructor(
        public dialog: MatDialog,
        public ingredientService: IngredientService,
        public titleService: Title
    ) { }

    ngOnInit() {
        this.titleService.setTitle(Constants.skinForYou + 'Ingredients');

        this.getIngredientsData();
        this.subscribeData();
    }

    getIngredientsData() {
        this.ingredientsDataSource = new IngredientsDataSource(this.ingredientService);
        this.ingredientsDataSource.getIngredientsService(this.searchString, this.currentPage, this.offset);
    }

    subscribeData() {
        this.ingredientDataSub = this.ingredientsDataSource.observeRewardResponse.subscribe(data => {
            this.ingredientListResponse = data;

            this.ingredients = this.ingredientListResponse.ingredients;
            this.metaData = this.ingredientListResponse.meta_data;
            console.log("metaData", this.metaData);

        });

        this.ingredientLoaderSub = this.ingredientsDataSource.observeLoader.subscribe(isLoading => {
            this.isLoadingAPI = isLoading;
        });

        this.ingredientEmptySub = this.ingredientsDataSource.observeRewardEmpty.subscribe(isListEmpty => {
            this.isIngredientsEmpty = isListEmpty;
        });
    }

    ngOnDestroy() {
        if (!!this.ingredientEmptySub) this.ingredientEmptySub.unsubscribe();
        if (!!this.ingredientLoaderSub) this.ingredientLoaderSub.unsubscribe();
        if (!!this.ingredientDataSub) this.ingredientDataSub.unsubscribe();
    }

    loadNextData(event) {
        this.currentPage = event.pageIndex + 1;
        this.ingredientsDataSource.getIngredientsService(
            this.searchString,
            this.currentPage,
            this.offset,
        );
    }

    clearSearch() {
        this.searchString = "";
        this.ingredientsDataSource.getIngredientsService(
            this.searchString,
            this.currentPage,
            this.offset,
        );
    }
    searchIngredient(searchString) {
        this.searchString = searchString;
        this.currentPage = 1;
        this.ingredientsDataSource.getIngredientsService(
            this.searchString,
            this.currentPage,
            this.offset,
        );

    }

    deleteIngredient(element) {

        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let dialogref = this.dialog.open(DeleteIngredientComponent, {
            width: "365px",
            hasBackdrop: true,
            data: {
                id: element.id,
                ingredient: element.name
            }

        });
        dialogref.afterClosed().subscribe(response => {

            if (response !== undefined) {
                if (this.ingredients && this.ingredients.length === 1 && this.searchString === '' && this.currentPage !== 1) {
                    this.currentPage = this.currentPage - 1;
                } else {
                    this.currentPage = this.currentPage;
                }
                this.ingredientsDataSource.getIngredientsService(
                    this.searchString,
                    this.currentPage,
                    this.offset,
                );

            }
        })
    }

    addIngredient() {

        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;
        let dialogref = this.dialog.open(AddIngredientComponent, {
            width: "365px",
            position: { right: right + 'px', top: (top + 40) + 'px' },
            hasBackdrop: true,
            backdropClass: 'backdropBackground',
            data: {
                operationIs: 'add'
            }
        });
        dialogref.afterClosed().subscribe(response => {
            if (response !== undefined) {
                this.ingredientsDataSource.getIngredientsService(
                    this.searchString,
                    this.currentPage,
                    this.offset,
                );

            }
        })
    }

    editIngredient(ele) {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.button._elementRef.nativeElement.getBoundingClientRect();
        const right = bodyRect.right - elemRect.right;
        const top = elemRect.top - bodyRect.top;

        let dialogref = this.dialog.open(AddIngredientComponent, {
            width: "365px",
            position: { right: right + 'px', top: (top + 40) + 'px' },
            panelClass: "ingredient-add",
            hasBackdrop: true,
            backdropClass: 'backdropBackground',
            data: {
                operationIs: 'save',
                id: ele.id,
                ingredient: ele.name
            }
        });
        dialogref.afterClosed().subscribe(response => {
            if (response !== undefined) {
                this.ingredientsDataSource.getIngredientsService(
                    this.searchString,
                    this.currentPage,
                    this.offset,
                );

            }
        })
    }

}

export class IngredientsDataSource extends DataSource<Ingredients> {
    private observeReward = new BehaviorSubject<Ingredients[]>([]);
    public observeLoader = new BehaviorSubject<boolean>(false);
    public observeRewardEmpty = new BehaviorSubject<boolean>(false);
    public observeRewardResponse = new Subject<IngredientListResponse>();

    constructor(public ingredientService: IngredientService) {
        super();
    }

    getIngredientsService(search: string, offset: number, page: number) {
        search = search.replace('+', '%2B');

        this.observeLoader.next(true);
        this.ingredientService.ingredientListService(search, offset, page, (status, response) => {
            this.observeLoader.next(false);

            if (status === ServiceResponse.success) {
                this.observeRewardEmpty.next(false);
                this.observeRewardResponse.next(response);
                this.observeReward.next(response.ingredients);
            } else if (status === ServiceResponse.emptyList) {
                this.observeRewardResponse.next(new IngredientListResponse());
                this.observeReward.next(new Array<Ingredients>());
                this.observeRewardEmpty.next(true);
            } else {
                this.observeRewardEmpty.next(true);
            }

        });
    }

    connect(collectionViewer: CollectionViewer): Observable<Ingredients[]> {
        return this.observeReward.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {

    }

}
