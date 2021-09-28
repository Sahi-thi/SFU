import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { RewardsRoutingModule } from './rewards-routing.module';
import { RewardsListComponent } from './rewards-list/rewards-list.component';
import { RewardCreateComponent } from './reward-create/reward-create.component';
import { RewardFilterComponent } from './reward-filter/reward-filter.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule, MatNativeDateModule, MatRadioModule } from '@angular/material';

import { MatCardModule } from '@angular/material/card';

import { SharedLoadingModule } from '../../../shared-loading/shared-loading.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { RewardServiceProductDialogComponent } from './reward-service-product-dialog/reward-service-product-dialog.component';
import { AddServiceProductDialogComponent } from '../appointments/add-service-product-dialog/add-service-product-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        RewardsListComponent,
        RewardFilterComponent,
        RewardCreateComponent,
        RewardServiceProductDialogComponent

    ],
    imports: [
        CommonModule,
        RewardsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        SharedLoadingModule,
        SharedModule,
        MatCheckboxModule,
        MatRadioModule,
        InlineSVGModule.forRoot()
    ],
    entryComponents: [
        RewardFilterComponent,
        RewardServiceProductDialogComponent

    ],
    providers: [DecimalPipe]
})
export class RewardsModule { }
