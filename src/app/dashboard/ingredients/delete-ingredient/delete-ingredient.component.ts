import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IngredientService } from '../ingredient.service';

@Component({
    selector: 'app-delete-ingredient',
    templateUrl: './delete-ingredient.component.html',
    styleUrls: ['./delete-ingredient.component.scss']
})
export class DeleteIngredientComponent implements OnInit {

    ingredientId: number;
    ingredient = '';
    isApiLoading = false;
    isDeleted = false;
    responseMessage = "";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<DeleteIngredientComponent>,
        private ingredientService: IngredientService
    ) { }

    ngOnInit() {
        this.dialogRef.disableClose = true;
        this.ingredient = this.data.ingredient;
        this.ingredientId = this.data.id;
    }

    callDeleteIngredient() {
        this.isApiLoading = true;
        this.ingredientService.deleteIngredientService(this.ingredientId, (status, response) => {
            if (status === 1) {
                this.isApiLoading = false;
                this.isDeleted = true
            } else {
                this.isApiLoading = false;
                this.responseMessage = response.message;
            }
        });
    }

}
