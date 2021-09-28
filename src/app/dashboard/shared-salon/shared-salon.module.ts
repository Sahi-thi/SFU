import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedModule } from '../../shared/shared.module';
import { AddSalonComponent } from './add-salon/add-salon.component';

const materialModules = [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule
]
@NgModule({
    declarations: [AddSalonComponent],

    exports: [
        AddSalonComponent,
        SharedModule,
        ...materialModules
    ],

    imports: [
        FormsModule,
        ColorPickerModule,
        MatCardModule,
        SharedModule,

        ...materialModules
    ]
})
export class SharedSalonModule { }
