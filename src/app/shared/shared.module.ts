import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DeleteSalonComponent } from './delete-salon/delete-salon.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { PhoneNumberFormatPipe } from './phonenumber.pipe';
import { PhoneNumberFormatDirective } from './PhoneNumberFormat.directive';
import { NonRecommenedProductsComponent } from './non-recommened-products/non-recommened-products.component';

@NgModule({
    declarations: [
        PhoneNumberFormatDirective,
        PhoneNumberFormatPipe,
        DeleteSalonComponent,
        ImageCropperComponent,
        NonRecommenedProductsComponent,
        // CheckBoxComponent,
        // MultiSelectComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatFormFieldModule,
        ImageCropperModule,
        // CheckBoxModule
    ],
    exports: [
        PhoneNumberFormatDirective,
        PhoneNumberFormatPipe,
        DeleteSalonComponent,
        ImageCropperComponent,
        ImageCropperModule,
        NonRecommenedProductsComponent,
        // CheckBoxComponent,
        // MultiSelectComponent,
        MatButtonModule,
        MatFormFieldModule,
        // CheckBoxModule
    ],
    providers: [PhoneNumberFormatPipe, PhoneNumberFormatDirective],
    entryComponents: [DeleteSalonComponent, ImageCropperComponent]
})
export class SharedModule { }
