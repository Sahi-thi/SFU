import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { } from "googlemaps";
import { Observable } from 'rxjs';
import { CustomValidators } from 'src/utils/customValidators';
import { ServiceResponse } from 'src/utils/enums';
import { Constants } from '../../../../utils/constants';
import { AmazonService } from '../../amazon.service';
import { Item, States, StatesResponse, Status } from '../../dashboard.model';
import { Salon, SalonDetailsResponse, UrlItem } from '../../salons/salon.model';
import { SalonService } from '../../salons/salon.service';
import { ImageCropperComponent } from '../../../shared/image-cropper/image-cropper.component';

@Component({
    selector: 'app-add-salon',
    templateUrl: './add-salon.component.html',
    styleUrls: ['./add-salon.component.scss']
})

export class AddSalonComponent implements OnInit {
    @ViewChild('inputLogo', { static: false }) InputVar: ElementRef;

    dayFrom: Status[] = Constants.Days;
    dayTo: Status[] = Constants.Days;
    timeFrom: Status[] = Constants.Time;
    timeTo: Status[] = Constants.toTime;
    updatedTimeTo: Status[];
    statesResponse: StatesResponse;
    states: States[];
    statuses: Status[] = Constants.Statuses;
    selectedStatus = "";
    responseMessage = "";
    selectedState = "";
    primaryPresetData = [];
    private salonDetailsResponse: SalonDetailsResponse;
    salon: Salon;
    public primaryColor = "";
    public salonPhoneNumber = "";
    public salonEmail = "";
    public primaryBgColor = "#8ba6b9";
    public secondaryColor = null;
    public secondaryBgColor = "#8ba6b9";
    public salonTitle = "Create a Studio";
    public btnTitle = "ADD";
    public tabTitle = "Add Studio";
    public salonId: number;
    public salonFormGroup: FormGroup;
    public isLoadingAPI: boolean;
    public isSalonAPI: boolean;
    public phoneNumber;
    public isEditSalon: boolean;
    public isPrimaryColor: false;
    public validationMessage: string;

    public selectedLogoFile: File;
    public isUploadingImages: boolean;
    public uploadSuccessMessages: string = "Uploading Images...";
    private selectedMediaFile: File;
    private fileName: string = "";
    public imgURL: any = null;
    public selectedFromDay: string;
    public selectedToDay: string;
    public selectedFromTime: string;
    public selectedToTime: string;
    private resourceFileName: string = "";
    isAddClicked = false;
    private fileMediaName: string = "";
    public mediaURL: UrlItem[] = [];
    inputCache;
    fileList = [];
    logoFileList = [];
    inputFiles: Array<Item> = [];
    latArray: Array<Item> = [];
    private resourceMediaFiles: string = "";
    private latitude = "";
    private longitude = "";
    public isLatLng: boolean;
    totalCount = 0;
    successCount = 0;
    failureCount = 0;
    progressValue = 20;
    isApiLoading = false;
    isCancelUpload = false;
    isFilesLength: boolean;
    private requestObject;
    public salon_media_key_ids: UrlItem[];
    public salon_media_get_key_ids: UrlItem[];
    public removedMediaKeyURL: UrlItem[] = [];
    imagesExt = [];
    videoExt = [];
    mediaValidation = "";
    new_salon_owners: Array<any> = [];
    salon_owners: Array<any> = [];
    userRole: string;
    userEmail: string;
    isChecked = true;

    constructor(
        public location: Location,
        private titleService: Title,
        private salonService: SalonService,
        private activatedRoute: ActivatedRoute,
        private amazonService: AmazonService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.getStates("");
        this.activatedRoute.params.subscribe((params) => {
            if (params['salon_id'] != undefined) {
                this.salonId = params['salon_id'];
            } else { }
        });
        this.userRole = localStorage.getItem('userRole');
        this.userEmail = localStorage.getItem('email');
        this.addFormData();

        if (this.salonId) {
            this.tabTitle = "Edit";
            this.salonTitle = "Edit";
            this.btnTitle = "SAVE";
            this.isEditSalon = true;
            this.loadSalonDetails();
        } else {

            this.salonTitle = "Create a Studio";
            this.tabTitle = "Add Studio";
            this.btnTitle = "ADD";
            this.isEditSalon = false;
            this.addFormData();
        }
        this.titleService.setTitle(Constants.skinForYou + this.tabTitle);
    }

    onTimeFromSelect(e, index) {
        if (e.isUserInput) {
            this.updatedTimeTo = this.timeTo.slice(index);
        }
    }

    addFormData() {
        this.salonFormGroup = new FormGroup({
            salon_logo_s3_key_id: new FormControl(''),
            name: new FormControl('', [Validators.required, CustomValidators.noWhitespaceValidator]),
            address: new FormControl("", [Validators.required]),
            phone_number: new FormControl("", [Validators.required, Validators.minLength(14)]),
            email: new FormControl("", [Validators.required, Validators.pattern(CustomValidators.email), CustomValidators.noWhitespaceValidator]),
            city: new FormControl("", Validators.required),
            owners: this.formBuilder.array([this.createOwnerFormGroup()]),

            state: new FormControl("", { validators: [CustomValidators.autocompleteObjectValidator(), Validators.required] }),
            zipcode: new FormControl("", [Validators.required, Validators.maxLength(5), Validators.pattern("^[0-9]*$")]),
            status: new FormControl("", Validators.required),
            salon_media_key_ids: new FormControl(''),
            days_from: new FormControl('', Validators.required),
            days_to: new FormControl('', Validators.required),
            time_from: new FormControl('', Validators.required),
            time_to: new FormControl('', Validators.required),
        });
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    loadSalonDetails() {
        this.isLoadingAPI = true;
        this.salonService.salonsDetailsService(this.salonId, (status, response) => {
            this.isLoadingAPI = false;
            if (status === ServiceResponse.success) {
                this.salonDetailsResponse = response;
                this.salon = this.salonDetailsResponse.salon;
                this.setSalonFormData();
            }
        });
    }

    setSalonFormData() {
        this.formatePhoneNumber();
        const salon = this.salon;
        const fromGroupControl = this.salonFormGroup.controls;
        fromGroupControl.name.setValue(salon.name);

        const owner = this.salonFormGroup.get('owners') as FormArray;

        while (owner.length) {
            owner.removeAt(0);
        }

        this.salonFormGroup.patchValue(owner);
        this.salon.owners.forEach(element => {
            owner.push(this.formBuilder.group(element))
        });
        owner.controls.forEach((item: FormGroup) => {
            item.controls['email'].disable();
            if (this.userRole === 'A') {
                if (item.controls['email'].value === this.userEmail) {
                    item.controls['salon_owner_name'].enable();
                    item.controls['status'].enable();
                }
                else {
                    item.controls['salon_owner_name'].disable();
                    item.controls['status'].disable();
                }
            }
        })

        fromGroupControl.email.setValue(salon.email);
        fromGroupControl.phone_number.setValue(salon.phone_number);
        fromGroupControl.city.setValue(salon.city);
        fromGroupControl.state.setValue(salon.state);
        fromGroupControl.address.setValue(salon.address);
        fromGroupControl.status.setValue(salon.status);
        fromGroupControl.zipcode.setValue(salon.zipcode);
        fromGroupControl.days_from.setValue(salon.days_from);
        fromGroupControl.days_to.setValue(salon.days_to);
        fromGroupControl.time_from.setValue(salon.time_from);
        fromGroupControl.time_to.setValue(salon.time_to);
        this.imgURL = salon.salon_logo_thumb_url;
        this.primaryColor = salon.primary_color;
        this.secondaryColor = salon.secondary_color;
        this.selectedStatus = salon.status;
        this.mediaURL = salon.salon_media_key_ids;
        this.resourceFileName = salon.salon_logo_s3_key_id;
        this.latitude = salon.latitude.toString();
        this.longitude = salon.longitude.toString();
        this.salonEmail = salon.email
        this.salonPhoneNumber = salon.phone_number

        let mediaUrls: Array<UrlItem> = [];
        salon.salon_media_key_ids.forEach(item => {
            let photoItem = new UrlItem();
            photoItem['type'] = item.type;
            photoItem['salon_media_key_id'] = item.salon_media_key_id;
            mediaUrls.push(photoItem);
        })
        this.salon_media_key_ids = mediaUrls
        this.salon_media_get_key_ids = mediaUrls;

    }

    onSubmit() {
        if (this.salonFormGroup.valid) {
            if (this.primaryColor) {

                if (this.selectedLogoFile || this.fileList.length > 0) {
                    this.handleImagesUpload();
                } else {
                    this.isEditSalon === true ? this.saveSalonDetails() : this.createSalon()
                }
            } else {
                this.validationMessage = "Select primary color for Studio"
            }
        }

    }

    handleImagesUpload() {
        if (this.selectedLogoFile) {
            this.fileList.push(this.selectedLogoFile);
        }
        this.totalCount = this.fileList.length;
        this.inputFiles = Array.from(this.fileList);
        let uploadCount = 0;
        let imagesUploadSuccessResult: Array<Item> = [];
        if (this.inputFiles.length > 0) {
            this.inputFiles.forEach(async element => {
                this.isUploadingImages = true;

                const result: any = await this.uploadImagesToS3(element);

                if (result.status === true) {
                    uploadCount = uploadCount + 1;
                    this.successCount = this.successCount + 1;
                    imagesUploadSuccessResult.push(result.data);
                } else {
                    uploadCount = uploadCount + 1;
                    this.failureCount = this.failureCount + 1;
                }

                if (this.totalCount !== 0 && this.successCount !== 0) {
                    let value = (this.successCount / this.totalCount) * 100;
                    this.progressValue = parseInt("" + value);
                } else {
                    this.progressValue = 20;
                }

                if (this.inputFiles.length === uploadCount) {
                    this.uploadSuccessMessages = "Images uploaded successfully"

                    if (this.isCancelUpload) {
                        return;
                    }
                    setTimeout(() => {
                        this.isUploadingImages = false;

                        this.uploadImagesToServer(imagesUploadSuccessResult);
                    }, 2000);
                } else { }

            });
        }
    }

    async uploadImagesToS3(item) {
        return new Promise((resolve) => {
            const fName = item.name;
            const extensionName = fName.substring(fName.lastIndexOf('.'));
            const milliseconds = new Date().getTime();
            const resourceFileName = 'salon-' + milliseconds + extensionName;
            item.uploadFileName = resourceFileName;
            this.amazonService.uploadImagesToS3(item, resourceFileName, extensionName, (status, response) => {
                if (status === 1) {
                    resolve({ status: true, data: item });
                } else {
                    resolve({ status: false, data: null });
                }
            });
        });

    }

    uploadImagesToServer(imagesObject) {
        const images = imagesObject;

        if (this.selectedLogoFile) {
            this.resourceFileName = this.selectedLogoFile['uploadFileName']
            for (var item in images) {
                if (images[item].uploadFileName === this.selectedLogoFile['uploadFileName']) {
                    delete images[item];
                }
            }
        }
        let salonMedia: Array<UrlItem> = [];

        images.forEach(element => {
            const extensionName = element.name.substring(element.name.lastIndexOf('.'));
            let photoItem = new UrlItem();
            photoItem.salon_media_key_id = element.uploadFileName;
            photoItem.type = extensionName === '.mp4' ? 'video' : extensionName === '.MP4' ? 'video' : 'image'
            salonMedia.push(photoItem);
        });

        this.salon_media_key_ids = this.salon_media_get_key_ids && this.salon_media_get_key_ids.length !== 0 ? [...salonMedia, ...this.salon_media_get_key_ids] : salonMedia;
        this.isEditSalon === true ? this.saveSalonDetails() : this.createSalon()
    }
    saveSalonDetails() {
        this.isSalonAPI = true;

        this.request();
        this.salon_owners = [];
        this.new_salon_owners = [];
        for (let i = 0; i < this.requestObject.owners.length; i++) {
            const el = this.requestObject.owners[i];
            const index = this.salon.owners.findIndex(elm => el['email'] === elm['email']);
            if (index === -1) {
                this.new_salon_owners.push(el);
                continue;
            }
            else {
                this.salon_owners.push(el);
            }
        }

        this.requestObject.owners.filter(item => {
            delete item.quickblox_id
        })
        this.requestObject.new_salon_owners = this.new_salon_owners;
        this.requestObject.salon_owners = this.salon_owners;
        this.requestObject.owners = null;
        this.requestObject.salon_media_key_ids = this.salon_media_key_ids && this.salon_media_key_ids.length > 0 ? this.salon_media_key_ids : [],
            this.requestObject.deleted_salon_media_key_ids = this.removedMediaKeyURL.length === 0 ? [] : this.removedMediaKeyURL;
        this.requestObject.salon_logo_s3_key_id = this.resourceFileName;
        const request = this.requestObject;
        for (var item in request) {
            if (request[item] === "" || request[item] === null || request[item] === undefined) {
                delete request[item];
            }
        }

        this.salonService.editSalonService(this.salonId, this.requestObject, (status, response) => {
            this.isSalonAPI = false;

            if (status === ServiceResponse.success) {
                this.location.back();
                this.statesResponse = response;
                this.states = this.statesResponse.states;
            } else {
                this.responseMessage = response.message
            }
        })
    }

    createSalon() {
        this.isSalonAPI = true;
        this.request()
        this.salonService.createSalonService(this.requestObject, (status, response) => {
            this.isSalonAPI = false;
            if (status === ServiceResponse.success) {
                this.location.back();
                this.statesResponse = response;
                this.states = this.statesResponse.states;
            } else {
                this.responseMessage = response.message
            }
        })
    }

    request() {

        if (this.btnTitle === 'SAVE') {
            const owner = this.salonFormGroup.get('owners') as FormArray;
            owner.controls.forEach((item: FormGroup) => {
                item.controls['email'].enable();
                item.controls['salon_owner_name'].enable();
                item.controls['status'].enable();
            })
        }
        this.salonFormGroup.value.phone_number = "" + this.salonFormGroup.value.phone_number.replace(/[^0-9]/g, "");

        this.requestObject = {
            ...this.salonFormGroup.value,
            primary_color: this.primaryColor,
            secondary_color: this.secondaryColor,
            latitude: this.latitude,
            longitude: this.longitude,
            salon_media_key_ids: this.salon_media_key_ids && this.salon_media_key_ids.length > 0 ? this.salon_media_key_ids : '',
            deleted_salon_media_key_ids: this.removedMediaKeyURL.length === 0 ? '' : this.removedMediaKeyURL,
            salon_logo_s3_key_id: this.resourceFileName,
        }

        const request = this.requestObject
        for (var item in request) {
            if (request[item] === "" || request[item] === null || request[item] === undefined) {
                delete request[item];
            }
        }
        console.log(this.salonFormGroup.value);

    }

    onClickUploadSalonLogo(event) {
        console.log({ event });

        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {

            this.selectedLogoFile = fileList[0];
            this.fileName = this.selectedLogoFile.name;
            var reader = new FileReader();
            reader.readAsDataURL(this.selectedLogoFile);

            reader.onload = (_event) => {
                // this.imgURL = reader.result;
                let dialogref = this.dialog.open(ImageCropperComponent, {
                    disableClose: true,
                    data: {
                        base64: this.imgURL,
                        event: event
                    },
                });
                dialogref.afterClosed().subscribe((response) => {
                    console.log({ response });
                    if (response) {
                        this.imgURL = response;
                        const file = [];
                        file.push(this.selectedLogoFile)
                        this.logoFileList = Array.from(file);
                        this.InputVar.nativeElement.value = "";

                    } else {
                        this.imgURL = this.salon ? this.salon.salon_logo_thumb_url : null;

                        this.selectedLogoFile = null;
                        this.fileName = "";
                        fileList = null;
                        event = null;
                        this.InputVar.nativeElement.value = "";

                    }

                })
            };

        }
    }

    onClickUploadMedia(event) {
        this.inputCache = event.target;
        const fileList: FileList = event.target.files;
        const totalUploadPhotos = this.fileList.length + fileList.length
        if (totalUploadPhotos <= 8 && this.fileList.length <= 8 && this.mediaURL.length < 8) {
            this.mediaValidation = ""
            if (fileList && fileList[0]) {
                let filesAmount = event.target.files.length;
                for (let i = 0; i < filesAmount; i++) {
                    let reader = new FileReader();
                    let fileData = event.target.files[i];
                    let urlItem = new UrlItem();

                    urlItem.eventFile = fileList[i];
                    urlItem.name = fileList[i].name;
                    const fileExtension = urlItem.name.substring(urlItem.name.lastIndexOf('.'))
                    this.addFileExtensions(fileExtension)
                    urlItem.type = fileExtension;

                    reader.onload = (event: any) => {
                        urlItem.file = event.target.result;
                        this.mediaURL.push(urlItem);
                    }

                    this.fileList.push(fileData);
                    reader.readAsDataURL(fileData);
                    this.isFilesLength = this.fileList.length > 7 ? true : false;
                }
            }
        } else {
            this.mediaValidation = "You can only upload the maximum of 8 images/videos"
        }
    }

    addFileExtensions(fileExtension) {
        if (fileExtension === '.mp4' || fileExtension === '.MP4') {
            this.imagesExt.push(fileExtension)
        } else {
            this.videoExt.push(fileExtension)
        }
    }

    removeImg(index, media) {
        this.mediaValidation = "";
        let removedFiles = new UrlItem();
        if (media.name === undefined) {
            removedFiles.salon_media_key_id = media.salon_media_key_id;
            removedFiles.type = media.type;
            this.mediaURL.splice(index, 1);
            this.salon_media_key_ids.splice(index, 1);
            this.removedMediaKeyURL.push(removedFiles);
        } else {
            this.mediaURL.splice(index, 1);
            this.fileList.splice(index, 1);
        }
        this.isFilesLength = this.fileList.length > 7 ? true : false;
    }

    onClickGoBack() {
        this.location.back();
        this.mediaURL = []
    }

    getGeoLocation(address: string) {
        this.isLatLng = false;

        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address },
            (results, status) => {
                if (status !== "OK") {
                    this.isLatLng = true;
                    return;
                }
                this.isLatLng = false;
                this.latitude = results[0].geometry.location.lat().toString();
                this.longitude = results[0].geometry.location.lng().toString();
            })
    }

    public displayContactFn(states?): string | undefined {

        return states ? states : undefined
    }

    formatePhoneNumber() {

        let phoneNumber = this.salon && this.salon.phone_number.toString();

        if (phoneNumber.length <= 3) {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})/, '($1');
        } else if (phoneNumber.length <= 6) {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else {
            phoneNumber = phoneNumber.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
        }

        this.salon.phone_number = phoneNumber

    }

    onEventLogPrimary(name, e) {
        this.primaryColor = e.color
        this.primaryBgColor = e.color
        this.pushTheColorToPreset(e.color);
    }

    onEventLogSecondary(name, e) {
        this.secondaryColor = e.color
        this.secondaryBgColor = e.color
    }

    pushTheColorToPreset(color) {
        this.primaryPresetData.push(color);
    }

    getStates(search) {
        this.salonService.satesService(search, (status, response) => {
            if (status === ServiceResponse.success) {
                this.statesResponse = response;
                this.states = this.statesResponse.states;
            }
        })
    }

    searchState(searchState) {
        this.getStates(searchState);
    }

    onSelectionChanged(e, state) {
        if (e.isUserInput) {
            this.selectedState = state.trim()
        }
    }
    observables: Observable<any>[] = [];
    createOwnerFormGroup(): FormGroup {
        let newGroup = new FormGroup({
            salon_owner_name: new FormControl('', [Validators.required, CustomValidators.noWhitespaceValidator]),
            email: new FormControl('', [Validators.required, Validators.pattern(CustomValidators.email), CustomValidators.noWhitespaceValidator]),
            // phone_number: new FormControl('', [Validators.required, Validators.minLength(14)]),
            status: new FormControl("", Validators.required),
        })
        return newGroup;
    }

    public addOwnerFormGroup() {
        this.isAddClicked = true;
        const ownerData = this.salonFormGroup.get('owners') as FormArray
        ownerData.push(this.createOwnerFormGroup());
    }

    removeOwner(index) {
        const emails = this.salonFormGroup.get('owners') as FormArray
        if (emails.length > 1) {
            emails.removeAt(index)
        }
    }
    isDisabled() {
        for (let i = 0; i <= this.salonFormGroup.value.owners.length - 1; i++) {
            if (this.salonFormGroup.value.owners[i].email !== null) { return true; }
            else return false;
        }
    }

}
