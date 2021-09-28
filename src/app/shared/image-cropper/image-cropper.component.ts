import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Dimensions, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    containWithinAspectRatio = false;
    showCropper = false;
    constructor(@Inject(MAT_DIALOG_DATA) public data,
    ) { }

    ngOnInit() {
        this.imageChangedEvent = this.data.event
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded() {
        // show cropper
        this.showCropper = true;
        this.croppedImage = this.data.base64;
    }

    cropperReady(sourceImageDimensions: Dimensions) {
    }

    loadImageFailed() {
        // show message
    }

    toggleContainWithinAspectRatio() {
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

}
