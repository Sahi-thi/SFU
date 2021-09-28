import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MatSelectionList, MAT_DIALOG_DATA } from '@angular/material';
import { ReplaySubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BrandsService } from '../product-lines.service';

@Component({
    selector: 'app-mat-auto-search',
    templateUrl: './mat-auto-search.component.html',
    styleUrls: ['./mat-auto-search.component.scss']
})
export class MatAutoSearchComponent implements OnInit, AfterViewInit {

    @ViewChild('selectionList', { static: false }) selectedValues: MatSelectionList;
    private positionRelativeToElement: ElementRef

    searchControl: FormControl = new FormControl();
    filteredIngredients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    ingredients = [];
    selectedIngredientIds = [];
    selectedIngredient = [];
    selectedIngredientMap = new Map();
    page = 1;
    pageSize = 400;
    searching = false;
    searchString = "";
    isApiLoading = false;
    emptyMessage = '';
    finalData = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private brandService: BrandsService,
        private dialogRef: MatDialogRef<MatAutoSearchComponent>,
    ) {
        // this.positionRelativeToElement = data.positionRelativeToElement
    }

    ngOnInit() {

        // const matDialogConfig = new MatDialogConfig()
        // const rect: DOMRect = this.positionRelativeToElement.nativeElement.getBoundingClientRect()

        // matDialogConfig.position = { right: `10px`, top: `${rect.bottom + 2}px` }
        // this.dialogRef.updatePosition(matDialogConfig.position)

        if (this.data.selectedIngredientMap !== '' && this.data.selectedIngredientMap !== undefined) {
            this.selectedIngredientMap = this.data.selectedIngredientMap;
            this.searchString = this.data.searchString;
            this.selectedValues = this.data.selectionValue;
        }
        console.log(this.data);

        this.searchIngredientsList(this.searchString);

        this.searchControl.valueChanges
            .pipe(
                debounceTime(200),
                switchMap(async (search) => {
                    this.searchString = search
                    if (search.toString().trim().length > 1) {
                        this.ingredients = await this.searchIngredientsList(search);

                        return this.ingredients;

                    } else {
                        return [];
                    }
                }),
            )
            .subscribe((filteredData: any) => {
                this.searching = false;

                this.filteredIngredients.next(filteredData);
            },
                error => {
                    this.searching = false;
                    console.log({ error });
                });
    }

    ngAfterViewInit() {

        this.dialogRef.backdropClick().subscribe((re) => {

            this.dialogRef.close(
                {
                    selectedIngredientMap: this.selectedIngredientMap,
                    // selectionValue: this.finalData,
                    searchString: this.searchString
                }
            )
        })
    }

    // onSelectioned(e, selectedItems) {

    //     console.log({ e });
    //     console.log(e.option._value.id);
    //     console.log({ selectedItems });
    //     if (this.data && this.data.selectionValue.length > 0) {
    //         this.finalData = [...this.data.selectionValue];
    //         selectedItems.length > 0 && this.finalData.push(selectedItems[0]._value)

    //     } else {
    //         selectedItems.length > 0 && this.finalData.push(selectedItems[0]._value)

    //     }

    //     console.log(this.finalData);

    // }

    onSelection(e) {
        // console.log(e.option._value);
        const id = e.option._value.id
        if (this.selectedIngredientMap && this.selectedIngredientMap.size > 0) {
            const result = this.selectedIngredientMap.get(id);
            // console.log(result);
            if (result) {
                this.selectedIngredientMap.delete(id);
            } else {
                this.selectedIngredientMap.set(e.option._value.id, e.option._value.name);
            }
        } else {
            this.selectedIngredientMap.set(e.option._value.id, e.option._value.name);
        }
        // console.log(this.selectedIngredientMap);

    }

    async searchIngredientsList(searchString) {
        return new Promise<any>((resolve, reject) => {
            this.isApiLoading = true;
            this.emptyMessage = '';
            this.brandService.IngredientBySearch(searchString, this.page, this.pageSize, (status, data) => {
                if (status === 1) {
                    this.isApiLoading = false;
                    const response = data.ingredients;
                    this.ingredients = response;
                    this.ingredients.map((item, index) => {

                        if (this.selectedIngredientMap) {

                            const result = this.selectedIngredientMap.get(item.id);
                            if (result) {
                                item['isChecked'] = true
                            }
                        }
                    })
                    // console.log(this.ingredients);

                    this.filteredIngredients.next(this.ingredients.slice());
                    return resolve(this.ingredients);
                } else {
                    this.isApiLoading = false;
                    this.ingredients = [];
                    this.emptyMessage = 'No ingredients found'
                    return resolve(this.ingredients = []);
                }
            }
            );
        });
    }

}
