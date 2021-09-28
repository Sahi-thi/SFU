import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientsRoutingModule } from './ingredients-routing.module';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';
import { DeleteIngredientComponent } from './delete-ingredient/delete-ingredient.component';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { SharedLoadingModule } from '../../shared-loading/shared-loading.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        IngredientListComponent,
        AddIngredientComponent,
        DeleteIngredientComponent
    ],
    imports: [
        CommonModule,
        IngredientsRoutingModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTableModule,
        SharedLoadingModule,
        MatPaginatorModule,
        MatDialogModule,
        MatFormFieldModule,
        MatMenuModule,
        FormsModule, ReactiveFormsModule
    ],
    entryComponents: [
        DeleteIngredientComponent,
        AddIngredientComponent
    ]
})
export class IngredientsModule { }
