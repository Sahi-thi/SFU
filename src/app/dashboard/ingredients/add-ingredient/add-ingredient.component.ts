import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngredientService } from '../ingredient.service';
import { ServiceResponse } from '../../../../utils/enums';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-add-ingredient',
    templateUrl: './add-ingredient.component.html',
    styleUrls: ['./add-ingredient.component.scss']
})
export class AddIngredientComponent implements OnInit {

    ingredientFormGroup: FormGroup;
    responseMessage = "";
    isCallingIngredient = false;
    btnTitle = "ADD";
    dialogTitle = "Add Ingredient"
    operationIs = '';
    ingredient = '';
    ingredientId
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<AddIngredientComponent>,
        public ingredientService: IngredientService
    ) { }

    ngOnInit() {
        this.dialogRef.disableClose = true;
        this.addIngredientData();
        this.operationIs = this.data.operationIs;

        if (this.operationIs === 'add') {
            this.dialogTitle = 'Add Ingredient';
            this.btnTitle = 'ADD';
        } else {
            this.dialogTitle = 'Edit Ingredient';
            this.btnTitle = 'SAVE';
            this.ingredientId = this.data.id;
            this.ingredient = this.data.ingredient;
            this.setIngredientData();
        }
    }

    addIngredientData() {
        this.ingredientFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required])
        })
    }

    setIngredientData() {
        this.ingredientFormGroup.setValue({
            name: this.ingredient
        })
    }

    callCreateIngredient() {
        this.ingredientService.createIngredientService(this.ingredientFormGroup.value, (status, response) => {
            this.isCallingIngredient = false;
            if (status === ServiceResponse.success) {
                this.dialogRef.close("add");
            } else {
                this.responseMessage = response.message;
            }
        })
    }

    callUpdateIngredient() {

        this.ingredientService.updateIngredientService(this.ingredientId, this.ingredientFormGroup.value, (status, response) => {
            this.isCallingIngredient = false;
            if (status === ServiceResponse.success) {
                this.dialogRef.close('save');
            } else {
                this.responseMessage = response.message;

            }
        })

    }

    checkEditFormData() {
        if (this.ingredientFormGroup.value.name.trim() === this.ingredient.trim()) {
            this.dialogRef.close();
        } else {
            this.callUpdateIngredient()
        }
    }

    submitFormData() {
        if (this.ingredientFormGroup.valid) {
            this.isCallingIngredient = true;
            if (this.ingredient) {
                this.checkEditFormData();
            } else {
                this.callCreateIngredient();
            }
        }
    }

    emptyResponseMessage() {
        this.responseMessage = '';
    }

}
