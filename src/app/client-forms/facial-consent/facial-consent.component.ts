import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FormService } from '../form.service';

declare var Print: any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-facial-consent',
    templateUrl: './facial-consent.component.html',
    styleUrls: ['./facial-consent.component.scss']
})
export class FacialConsentComponent implements OnInit {

    facialConsentFormGroup: FormGroup;
    isChecked: boolean;
    isChecked1: boolean;
    isChecked7: boolean;
    checkProductsArray: any;
    isChecked2: boolean;
    isChecked3: boolean;
    isChecked4: boolean;
    isChecked5: boolean;
    isChecked6: boolean;
    isFormSubmitted = false;
    responseMessage = '';

    @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;
    @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
    @ViewChild(MatInput, { static: false }) input: MatInput;

    challenges: string[] = ['Wrinkles/Fine Lines', 'Hyperpigmentation/Sun Damage', 'Acne/Acne Scarring', 'Redness/Rosacea',
        'Aging', 'Melasma', 'Sensitivity', 'Other'];
    products: string[] = ['Cleanser/Face Wash', 'Bar Soap', 'Face Scrub/Exfoliants', 'Toner', 'Serums', 'Moisturizer',
        'Sunscreen', 'Eye Product(s)', 'Lip Product(s)'];
    services: string[] = ['Waxing', 'Sugaring', 'Threading', 'Electrolysis/Laser', 'Depilatory Cream', 'Shaving', 'None'];
    healths: string[] = ['Hormone Imbalance', 'Cancer/Systemic Disease', 'High Blood Pressure', 'Diabetes',
        'Heart Problems', 'Arthritis', 'Auto-Immune Disorders', 'Asthma', 'Epilepsy/Seizure Disorder', 'Fever Blisters',
        'Herpes', 'Frequent Cold Sores', 'HIV/AIDS', 'Lupus', 'Depression/Anxiety', 'Hepatitis', 'Headaches/Migraines',
        'Other', 'None'];
    allergies: string[] = ['Aspirin', 'Tree Nuts', 'Latex', 'Dairy', 'Fruits', 'Vegetables', 'Shellfish', 'Iodine',
        'Fragrances/Essential Oils', 'Other', 'None'];

    signaturePadOptions: Object = {
        'minWidth': 0.5,
        'canvasWidth': 718,
        'canvasHeight': 100
    };

    minDate: Date;
    signatureImage = '';
    isPdfTemplateVisible = false;
    isSignatureEmpty = false;
    pdfMake: any;
    skinLogo = '../../../assets/form_logo_in.png';
    isApiCalling = false;
    salonId: number;
    clientId: number;
    formId: number;
    isIntakeForm: boolean;

    constructor(
        private formService: FormService,
        private activatedRoute: ActivatedRoute,
        private meta: Meta) {
        this.minDate = new Date();
    }

    ngOnInit() {
        this.meta.updateTag({ name: 'viewport', content: "width=device-width, height=device-height, user-scalable=no" })

        document.addEventListener('touchstart', function(e) { e.preventDefault() }, false);
        document.addEventListener('touchmove', function(e) { e.preventDefault() }, false);
        // window.scrollBy(0, 0);
        console.log("matInput onInit", this.input);
        // this.input.nativeElement. = function() {
        //     console.log("matInput CAlling");

        //     window.scrollTo(0, 0);
        //     document.body.scrollTop = 0;
        // }
        this.activatedRoute.queryParams.subscribe((params) => {

            this.salonId = params['salon_id'];
            this.clientId = params['client_id'];
            this.formId = params['form_id'];
            this.isIntakeForm = params && params['intake'] == 1 ? true : false;
        });
        this.addFacialConsentFormData();
    }

    drawComplete() {
        this.signatureImage = this.signaturePad.toDataURL('image/png');
        this.isSignatureEmpty = true;
    }

    drawStart() {
        this.signatureImage = this.signaturePad.toDataURL('image/png');
        this.isSignatureEmpty = true;
    }

    clearSignature() {
        this.signaturePad.clear();
        this.isSignatureEmpty = false;
    }

    showImage(data) {
        this.signatureImage = data
    }

    submitClientConsentForm() {
        this.isPdfTemplateVisible = true;
        this.signatureImage = this.signaturePad.toDataURL('image/png');
        if (this.facialConsentFormGroup.valid) {
            this.isApiCalling = true;
            this.uploadFormPdf();
        } else {
            this.isPdfTemplateVisible = false;
        }
    }

    async loadPdfMaker() {
        if (!this.pdfMake) {
            const pdfMakeModule = await import('pdfmake/build/pdfmake');
            const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
            this.pdfMake = pdfMakeModule.default;
            this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
        }
    }

    onCheckboxChallengesChange(e) {
        const checkArray: FormArray = this.facialConsentFormGroup.get('checkbox_1') as FormArray;
        if (e.checked) {
            if (e.source.value === 'Other') {
                this.isChecked = true;
            }
            checkArray.push(new FormControl(e.source.value));
        } else {
            let i: number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value == e.source.value) {
                    checkArray.removeAt(i);
                    if (e.source.value === 'Other') {
                        this.isChecked = false;
                    }

                    return;
                }
                i++;
            });
        }
    }

    onCheckboxProductsChange(e) {
        const checkArray: FormArray = this.facialConsentFormGroup.get('checkbox_2') as FormArray;

        if (e.checked) {
            for (let i = 0; i <= checkArray.value.length; i++) {
                this.facialConsentFormGroup.controls['input_' + (i + 2)].setValidators(Validators.required);
                this.facialConsentFormGroup.controls['input_' + (i + 2)].updateValueAndValidity();
            }
            checkArray.push(new FormControl(e.source.value));
        }
        else {
            for (let j = 0; j <= checkArray.value.length - 1; j++) {

                this.facialConsentFormGroup.controls['input_' + (j + 2)].clearValidators();
                this.facialConsentFormGroup.controls['input_' + (j + 2)].updateValueAndValidity();
            }
            let i: number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value == e.source.value) {
                    this.facialConsentFormGroup.controls['input_' + (i + 2)].setValue('');
                    checkArray.removeAt(i);
                    return;
                }
                i++;
            });
        }
        this.checkProductsArray = checkArray.value;
    }

    onCheckboxServicesChange(e) {
        const checkArray: FormArray = this.facialConsentFormGroup.get('checkbox_3') as FormArray;
        if (e.checked) {
            if (e.source.value !== 'None') {
                this.isChecked3 = true;
                this.facialConsentFormGroup.controls['input_12'].setValidators(Validators.required);
                this.facialConsentFormGroup.controls['input_12'].updateValueAndValidity();
            }
            checkArray.push(new FormControl(e.source.value));
        }
        else {
            let i: number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value == e.source.value) {
                    if (e.source.value === 'None' && checkArray.length === 1) {
                        this.isChecked3 = false;
                        this.facialConsentFormGroup.controls.input_12.setValue('');
                        this.facialConsentFormGroup.controls['input_12'].clearValidators();
                        this.facialConsentFormGroup.controls['input_12'].updateValueAndValidity();
                    }
                    checkArray.removeAt(i);
                    if (checkArray.value[0] === 'None' || checkArray.length === 0) this.isChecked3 = false;
                    return;
                }
                i++;
            });
        }
    }

    onCheckboxHealthChange(e) {
        const checkArray: FormArray = this.facialConsentFormGroup.get('checkbox_4') as FormArray;
        if (e.checked) {
            if (e.source.value !== 'None') {
                this.isChecked7 = true;
                this.facialConsentFormGroup.controls['textarea_3'].setValidators(Validators.required);
                this.facialConsentFormGroup.controls['textarea_3'].updateValueAndValidity();
            }
            checkArray.push(new FormControl(e.source.value));
        }
        else {
            let i: number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value == e.source.value) {
                    if (e.source.value === 'None' && checkArray.length === 1) {
                        this.isChecked7 = false;
                        this.facialConsentFormGroup.controls.textarea_3.setValue('');
                        this.facialConsentFormGroup.controls['textarea_3'].clearValidators();
                        this.facialConsentFormGroup.controls['textarea_3'].updateValueAndValidity();
                    }
                    checkArray.removeAt(i);
                    if (checkArray.value[0] === 'None' || checkArray.length === 0) this.isChecked7 = false;
                    return;
                }
                i++;
            });
        }
    }

    onCheckboxAllergiesChange(e) {
        const checkArray: FormArray = this.facialConsentFormGroup.get('checkbox_5') as FormArray;
        if (e.checked) {
            if (e.source.value === 'Other') {
                this.isChecked4 = true;
                this.facialConsentFormGroup.controls['input_13'].setValidators(Validators.required);
                this.facialConsentFormGroup.controls['input_13'].updateValueAndValidity();
            }
            checkArray.push(new FormControl(e.source.value));
        }
        else {
            let i: number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value == e.source.value) {
                    if (e.source.value === 'Other') {
                        this.facialConsentFormGroup.controls.input_13.setValue('');
                        this.facialConsentFormGroup.controls['input_13'].clearValidators();
                        this.facialConsentFormGroup.controls['input_13'].updateValueAndValidity();
                        this.isChecked4 = false;
                    }
                    checkArray.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

    radioChange(e) {
        if (e.value === 'Yes') {
            this.isChecked1 = true;
            this.facialConsentFormGroup.controls['input_1'].setValidators(Validators.required);
            this.facialConsentFormGroup.controls['input_1'].updateValueAndValidity();
        }
        else {
            this.isChecked1 = false;
            this.facialConsentFormGroup.controls.input_1.setValue('');
            this.facialConsentFormGroup.controls['input_1'].clearValidators();
            this.facialConsentFormGroup.controls['input_1'].updateValueAndValidity();
        }
    }

    async uploadFormPdf() {
        const formValue = this.facialConsentFormGroup.value
        let docDefinition = {
            content: [
                {
                    svg: '<svg width="300" height="200" viewBox="0 0 144 35"><polygon id="Fill-1" fill="#EFA586" points="141 9.41809636 139.788013 9.41809636 139.788013 12 139.213651 12 139.213651 9.41809636 138 9.41809636 138 9 141 9"></polygon><polygon id="Fill-2" fill="#EFA586" points="143.306737 9 142.720395 10.7358402 142.510692 11.4500588 142.502414 11.4500588 142.29754 10.7358402 141.706369 9 141 9 141 12 141.439411 12 141.439411 10.2634548 141.404231 9.43642773 141.40837 9.43642773 142.302368 12 142.697632 12 143.59232 9.43642773 143.595769 9.43642773 143.565417 10.2634548 143.565417 12 144 12 144 9"></polygon><path d="M2.51494947,22.842331 C1.49695658,22.3109225 0.658380071,21.605993 0.000195017794,20.7265563 L1.7963089,18.7039507 C2.43499217,19.3709225 3.08878932,19.8806408 3.75770036,20.2335986 C4.42612384,20.5865563 5.1501274,20.7625423 5.92873594,20.7625423 C6.60691032,20.7625423 7.17099929,20.6264859 7.62002776,20.3538803 C8.06954377,20.0807817 8.29381423,19.6814859 8.29381423,19.155007 C8.29381423,18.7261338 8.12951174,18.3953592 7.79993167,18.1612042 C7.4703516,17.9275423 6.94672883,17.6643028 6.22808826,17.3719789 L4.73083915,16.7360634 C3.43299573,16.1908521 2.47009537,15.5958521 1.84116299,14.9500775 C1.2122306,14.3043028 0.898251957,13.4564155 0.898251957,12.4069085 C0.898251957,11.0744437 1.38725907,10.0254296 2.36527331,9.25789437 C3.3428,8.49183803 4.58116299,8.10782394 6.0784121,8.10782394 C8.19386762,8.10782394 9.89052242,8.88028873 11.1688641,10.4247254 L9.46148327,12.4069085 C9.00221637,11.9519085 8.47371815,11.6004296 7.87501352,11.3534577 C7.27582135,11.1074718 6.6571274,10.9837394 6.01844413,10.9837394 C5.39975018,10.9837394 4.91074306,11.0976127 4.55093523,11.3238803 C4.19161495,11.5506408 4.01219858,11.8809225 4.01219858,12.3152183 C4.01219858,12.6735986 4.15651174,12.9664155 4.44611317,13.1931761 C4.73571459,13.4194437 5.23934804,13.6747958 5.95798861,13.9572606 L7.36552954,14.4960634 C8.76283203,15.0890915 9.78082491,15.7289507 10.4199957,16.413669 C11.0581915,17.0983873 11.3780206,17.9733873 11.3780206,19.0366972 C11.3780206,20.4889507 10.8587858,21.6188099 9.8212911,22.4267676 C8.78282135,23.2352183 7.48546548,23.6389507 5.92873594,23.6389507 C4.67087117,23.6389507 3.53294235,23.3732465 2.51494947,22.842331" id="Fill-3" fill="#EFA586"></path><path d="M27.3935157,23.3059577 L23.6204089,23.3059577 L17.242352,14.949831 L22.9919641,8.4408169 L26.8845192,8.4408169 L20.9554907,14.9803944 L27.3935157,23.3059577 Z M14.0089569,23.3059577 L17.1531313,23.3059577 L17.1531313,0.599338028 L14.0089569,0.599338028 L14.0089569,23.3059577 Z" id="Fill-5" fill="#EFA586"></path><path d="M31.1386374,8.44066901 L34.2828117,8.44066901 L31.9538117,23.3058099 L28.8101249,23.3058099 L31.1386374,8.44066901 Z M31.8338758,4.38411972 C31.4774808,3.98038732 31.3453562,3.48644366 31.4375021,2.90080986 C31.5291605,2.31517606 31.8168117,1.81580986 32.3009434,1.40172535 C32.7850751,0.988626761 33.3262495,0.781091549 33.9254416,0.781091549 C34.5036694,0.781091549 34.970737,0.988626761 35.3251819,1.40172535 C35.6796267,1.81580986 35.8107762,2.31517606 35.7191178,2.90080986 C35.6274594,3.48644366 35.3402957,3.98038732 34.8576267,4.38411972 C34.3759327,4.78785211 33.8445093,4.98947183 33.2662815,4.98947183 C32.6670893,4.98947183 32.1897833,4.78785211 31.8338758,4.38411972 L31.8338758,4.38411972 Z" id="Fill-7" fill="#EFA586"></path><path d="M49.4111221,9.7276831 C50.2199584,10.8072606 50.4851826,12.2353592 50.2072822,14.0114859 L48.7509868,23.3057113 L45.6077875,23.3057113 L46.9968018,14.4354296 C47.158179,13.4061338 46.9938765,12.5735282 46.5048694,11.9376127 C46.0153747,11.3016972 45.2918587,10.9837394 44.3338338,10.9837394 C43.355332,10.9837394 42.5016416,11.3071197 41.7717875,11.9528944 C41.0414459,12.598669 40.5977804,13.4263451 40.439816,14.4354296 L39.0503142,23.3057113 L35.9061399,23.3057113 L38.2346523,8.44057042 L41.168695,8.44057042 L40.9410117,9.89380986 C42.2451932,8.7033169 43.8058231,8.10782394 45.6224139,8.10782394 C47.339058,8.10782394 48.6017982,8.64810563 49.4111221,9.7276831" id="Fill-9" fill="#EFA586"></path><path d="M88.7555719,8.58747183 L88.7555719,11.3169789 L87.797547,11.3169789 C86.5596715,11.3169789 85.5319278,11.6738803 84.7138281,12.3866972 C83.8947534,13.0995141 83.4857036,14.1081056 83.4857036,15.4134577 L83.4857036,23.3057113 L80.3420167,23.3057113 L80.3420167,8.44057042 L83.276547,8.44057042 L83.276547,10.5085282 C83.7952943,9.84993662 84.4291021,9.33972535 85.1774829,8.98035915 C85.9263512,8.62099296 86.7195861,8.44057042 87.5581626,8.44057042 C87.9964651,8.44057042 88.3967391,8.4898662 88.7555719,8.58747183" id="Fill-11" fill="#F1CABA"></path><path d="M115.76812,20.1212042 C116.466772,19.6938099 117.015259,19.1076831 117.415046,18.3643028 C117.813857,17.6204296 118.013263,16.8006408 118.013263,15.9039507 C118.013263,14.9875423 117.813857,14.1524718 117.415046,13.3982465 C117.015259,12.6445141 116.466772,12.0534577 115.76812,11.6260634 C115.068981,11.1981761 114.300611,10.9837394 113.462522,10.9837394 C112.603957,10.9837394 111.825348,11.1981761 111.126697,11.6260634 C110.427558,12.0534577 109.87907,12.6445141 109.480259,13.3982465 C109.080473,14.1524718 108.881067,14.9875423 108.881067,15.9039507 C108.881067,16.8208521 109.080473,17.650993 109.480259,18.3948662 C109.87907,19.1382465 110.42317,19.7184577 111.11207,20.1364859 C111.800483,20.5545141 112.573729,20.7625423 113.432295,20.7625423 C114.290373,20.7625423 115.068981,20.5490915 115.76812,20.1212042 M109.524626,22.5948662 C108.336967,21.8983169 107.398932,20.9547958 106.710519,19.7638099 C106.021619,18.5728239 105.677412,17.2709225 105.677412,15.8585986 C105.677412,14.4250775 106.021619,13.1182465 106.710519,11.9376127 C107.398932,10.7569789 108.336967,9.82380986 109.524626,9.13711972 C110.712284,8.45141549 112.015003,8.10782394 113.432295,8.10782394 C114.869576,8.10782394 116.186921,8.45141549 117.384818,9.13711972 C118.582715,9.82380986 119.525626,10.7624014 120.214526,11.9528944 C120.902939,13.1438803 121.247145,14.4457817 121.247145,15.8585986 C121.247145,17.2709225 120.902939,18.5728239 120.214526,19.7638099 C119.525626,20.9547958 118.582715,21.8983169 117.384818,22.5948662 C116.186921,23.2909225 114.869576,23.6389507 113.432295,23.6389507 C112.015003,23.6389507 110.712284,23.2909225 109.524626,22.5948662" id="Fill-13" fill="#EFA586"></path><path d="M127.235849,22.8368099 C126.25686,22.3024437 125.48849,21.5349085 124.930251,20.5356831 C124.37055,19.5364577 124.091675,18.3814577 124.091675,17.0692042 L124.091675,8.44047183 L127.205621,8.44047183 L127.205621,17.3551197 C127.205621,18.389838 127.5196,19.2165282 128.148532,19.8351901 C128.777465,20.4543451 129.571187,20.7624437 130.529212,20.7624437 C131.447258,20.7624437 132.216116,20.4543451 132.83481,19.8351901 C133.453016,19.2165282 133.763095,18.389838 133.763095,17.3551197 L133.763095,8.44047183 L136.907269,8.44047183 L136.907269,17.0692042 C136.907269,18.3814577 136.627419,19.5364577 136.068205,20.5356831 C135.509479,21.5349085 134.745984,22.3024437 133.777721,22.8368099 C132.809458,23.3706831 131.727109,23.6388521 130.529212,23.6388521 C129.311326,23.6388521 128.213376,23.3706831 127.235849,22.8368099" id="Fill-15" fill="#EFA586"></path><path d="M74.294905,15.6106901 C74.3022181,15.0674507 74.2222609,14.5128732 74.043332,13.9637183 C73.1808658,11.307662 70.2380473,10.1763239 67.724268,11.4772394 C66.1104957,12.3123099 64.7356203,14.3610423 65.0218089,16.942662 C65.280695,19.275338 67.2645135,20.9883662 69.5764495,20.7699859 C72.2657448,20.5161127 74.262727,18.1942817 74.294905,15.6106901 M77.5424388,15.3375915 C77.5658409,19.0697746 75.0427982,22.4056197 71.6348623,23.3442113 C69.0796416,24.0481549 66.6370438,23.8233662 64.5103747,22.1463239 C62.1175064,20.2597746 61.3364601,17.6899859 61.8522822,14.7223803 C62.4587875,11.2361831 65.4693747,8.56435211 68.7978409,8.10787324 C72.289147,7.62871831 75.6736808,9.2924507 77.018816,12.6209014 C77.3961754,13.5550563 77.5736416,14.5325915 77.5424388,15.3375915" id="Fill-17" fill="#F1CABA"></path><path d="M63.6225075,0.623394366 C62.0677281,-0.0347042254 60.2667388,0.0293802817 58.6817317,0.799873239 C57.0528456,1.59156338 55.8398349,3.03395775 55.353753,4.75635211 C55.1914007,5.3316338 55.0636641,5.90592958 54.9286142,6.51325352 L54.4069416,8.73402817 L52.1457103,8.73402817 L51.7161836,11.5902254 L54.0066676,11.5862817 L52.0087103,23.3038873 L55.5711979,23.3043803 L57.4770093,12.3355775 C57.5540413,11.8697324 57.7987886,11.5729718 58.389205,11.5838169 L61.5138776,11.5971268 L62.0238491,8.73550704 L58.0859523,8.73402817 L58.5140164,6.54923944 C58.6100626,6.03902817 58.7007459,5.55740845 58.8314078,5.08466197 C59.0820057,4.17712676 59.5446854,3.5944507 60.2447993,3.30311268 C60.9356498,3.01571831 61.567995,3.05614085 62.0735786,3.42043662 C62.7975822,3.94198592 62.5684363,4.77656338 62.4933544,5.05064789 L65.2694327,5.04966197 C65.8759381,3.51360563 65.5083295,1.42149296 63.6225075,0.623394366" id="Fill-19" fill="#F1CABA"></path><path d="M105.557281,8.44066901 L98.4006157,26.1930634 C97.7824093,27.6053873 97.0428043,28.6405986 96.1852135,29.2962324 C95.3266477,29.9518662 94.2686762,30.2801761 93.0112989,30.2801761 C92.1922242,30.2801761 91.384363,30.1791197 90.5862527,29.9775 L90.5862527,27.282993 C91.5038114,27.3633451 92.0825267,27.4037676 92.3223986,27.4037676 C93.0605409,27.4037676 93.6894733,27.2475 94.2091957,26.9349648 C94.7279431,26.6214437 95.1667331,26.0515845 95.5265409,25.2244014 L96.3358648,23.1485563 L90.2566726,8.44066901 L93.6402313,8.44066901 L97.8487153,19.2044014 L102.20395,8.44066901 L105.557281,8.44066901 Z" id="Fill-21" fill="#EFA586"></path><polygon id="Fill-23" fill="#8BA6B9" points="77.5458516 27.4645493 28.8099299 27.4645493 28.8099299 30.5056056 50.9376238 30.5056056 50.9376238 34.9999014 55.3825669 30.5056056 77.5458516 30.5056056"></polygon></svg>',
                    style: 'formLogo',
                    width: 144,
                    height: 35,
                },
                { text: 'Facial Consent Form', style: 'formHeader' },
                { text: 'CONTACT INFORMATION', style: 'subHeader' },
                {
                    columns: [
                        {
                            width: '50%',
                            text: ['First Name: ', { text: this.facialConsentFormGroup.value.first_name, style: 'infoAnsStyle' }],
                            style: 'infoQuesStyle'
                        },
                        {
                            width: '*',
                            text: ['Last Name: ', { text: this.facialConsentFormGroup.value.last_name, style: 'infoAnsStyle' }],
                            style: 'infoQuesStyle'
                        },
                    ],
                    columnGap: 10
                },
                { text: ['Phone Number: ', { text: this.facialConsentFormGroup.value.phone_number, style: 'infoAnsStyle' }], style: 'infoQuesStyle' },
                { text: ['Email: ', { text: this.facialConsentFormGroup.value.email, style: 'infoAnsStyle' }], style: 'infoQuesStyle', },
                { text: 'YOUR SKIN', style: 'subHeader' },
                { text: 'What are your skin care goals?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.textarea_1, style: 'infoAnsStyle' },
                { text: 'What are your skin care challenges?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.checkbox_1 + ',', style: 'infoAnsStyle' },
                {
                    text: formValue.textarea_2.trim().length === 0 ? '' : 'Please feel free to add more detail',
                    style: formValue.textarea_2.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.textarea_2, style: formValue.textarea_2.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },

                { text: 'Have you ever had a facial or skin treatment before?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_1, style: 'infoAnsStyle' },
                {
                    text: formValue.input_1.trim().length === 0 ? '' : 'If yes, when?',
                    style: formValue.input_1.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_1, style: formValue.input_1.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                { text: 'What skin care products do you currently use?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.checkbox_2 + ',' + ' ', style: 'infoAnsStyle' },
                {
                    text: (formValue.input_2.trim().length != 0 || formValue.input_3.trim().length != 0 || formValue.input_4.trim().length != 0 || formValue.input_5.trim().length != 0
                        || formValue.input_6.trim().length != 0 || formValue.input_7.trim().length != 0 || formValue.input_8.trim().length != 0 || formValue.input_9.trim().length != 0
                        || formValue.input_10.trim().length != 0) ? ' If you are seeking corrective treatments please detail the SPECIFIC products (BRAND & PRODUCT TYPE/NAME) you are currently using so I can best answer any questions on ingredients and help you meet your skin care goals' : '', style: 'infoQuesStyle'
                },
                {
                    text: formValue.input_2.trim().length === 0 ? '' : this.checkProductsArray[0],
                    style: formValue.input_2.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_2, style: formValue.input_2.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                {
                    text: formValue.input_3.trim().length === 0 ? '' : this.checkProductsArray[1],
                    style: formValue.input_3.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_3, style: formValue.input_3.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                {
                    text: formValue.input_4.trim().length === 0 ? '' : this.checkProductsArray[2],
                    style: formValue.input_4.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_4, style: formValue.input_4.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                {
                    text: formValue.input_5.trim().length === 0 ? '' : this.checkProductsArray[3],
                    style: formValue.input_5.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_5, style: formValue.input_5.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                {
                    text: formValue.input_6.trim().length === 0 ? '' : this.checkProductsArray[4],
                    style: formValue.input_6.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_6, style: formValue.input_6.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                {
                    text: formValue.input_7.trim().length === 0 ? '' : this.checkProductsArray[5],
                    style: formValue.input_7.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_7, style: formValue.input_7.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                {
                    text: formValue.input_8.trim().length === 0 ? '' : this.checkProductsArray[6],
                    style: formValue.input_8.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_8, style: formValue.input_8.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                {
                    text: formValue.input_9.trim().length === 0 ? '' : this.checkProductsArray[7],
                    style: formValue.input_9.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_9, style: formValue.input_9.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                {
                    text: formValue.input_10.trim().length === 0 ? '' : this.checkProductsArray[8],
                    style: formValue.input_10.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_10, style: formValue.input_10.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },

                { text: 'Do you/have you used Retin-A, Renova, Adapalene, Accutant, Differen, Glycolic Acid, Lactic Acid, Mandelic Acid, Retinol, or other Vitamin A derivatives?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_2, style: 'infoAnsStyle' },
                {
                    text: formValue.input_11.trim().length === 0 ? '' : 'Please specify which product or type if you answered Yes.',
                    style: formValue.input_11.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_11, style: formValue.input_11.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },

                { text: 'Have you received any of these hair removal services in the last 30 days?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.checkbox_3 + ',' + ' ', style: 'infoAnsStyle' },
                {
                    text: formValue.input_12.trim().length === 0 ? '' : 'If checked, please note last time.',
                    style: formValue.input_12.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_12, style: formValue.input_12.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                { text: 'Have you ever received chemical peels, laser services, or microdermabrasion treatments?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_3, style: 'infoAnsStyle' },
                { text: 'Have you ever received Botox, Juvederm, or other dermal fillers in the last two weeks?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_4, style: 'infoAnsStyle' },
                { text: 'YOUR HEALTH', style: 'subHeader' },
                { text: 'Have you experienced any of these health conditions in the past or present?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.checkbox_4 + ',' + ' ', style: 'infoAnsStyle' },
                {
                    text: formValue.textarea_3.trim().length === 0 ? '' : 'If checked other than “None”, please provide further information.',
                    style: formValue.textarea_3.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.textarea_3, style: formValue.textarea_3.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                { text: 'Any known allergies?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.checkbox_5 + ',' + ' ', style: 'infoAnsStyle' },
                {
                    text: formValue.input_13.trim().length === 0 ? '' : 'If "Other", please specify',
                    style: formValue.input_13.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_13, style: formValue.input_13.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },

                { text: 'Have you used or been prescribed any medications (topical or oral) for acne/acne control?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_5, style: 'infoAnsStyle' },
                {
                    text: formValue.input_14.trim().length === 0 ? '' : 'If yes, please specify what and date last used.',
                    style: formValue.input_14.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_14, style: formValue.input_14.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                { text: 'FEMALE CLIENTS', style: 'subHeader' },
                { text: 'Are you pregnant or trying to become pregnant?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_6, style: 'infoAnsStyle' },
                { text: 'Any menopause issues?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_7, style: 'infoAnsStyle' },
                {
                    text: formValue.input_15.trim().length === 0 ? '' : 'IIf yes, please specify.',
                    style: formValue.input_15.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaStyle'
                },
                { text: formValue.input_15, style: formValue.input_15.trim().length === 0 ? 'textAreaHideStyle' : 'textAreaAnsShow' },
                { text: 'MALE CLIENTS', style: 'subHeader' },
                { text: 'What is your current shaving system?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_8, style: 'infoAnsStyle' },
                { text: 'Do you experience irritation from shaving?', style: 'infoQuesStyle' },
                { text: this.facialConsentFormGroup.value.radio_9, style: 'infoAnsStyle' },
                { text: 'Post Facial Care/Waxing Instructions: Aerobic exercise and/or vigorous physical activity should be avoided for 48 hours. Direct sunlight exposure is to be avoided immediately following the treatment (including any strong UV light exposure and/or tanning beds). If some sun exposure cannot be avoided first apply a broad spectrum sunscreen of SPF 30. Sunscreen (with a minimum SPF 15) should become part of your daily skin care regimen as skin can potentially become more sensitize to the sun as a result of this treatment. Unless otherwise specified, in the evening following your treatment, cleanse your skin with a mild cleanser and water followed by a non-active moisturizer. Do not apply additional exfoliating ingredients/products the day of your service as over-exfoliation can result in irritation or further sensitivity. Consult your skin care professional before resuming topical treatments. Enzyme peels, DermaFile or DermaDisc treatments, chemical peels or facial waxing can result in skin flushing/redness or slight skin flaking or sensitivity for up to 48-72 hours post treatment. DO NOT peel, pick, rub, or scratch your skin at any time, whatsoever. This can potentially cause damage or compromise your results.', style: 'infoQuesStyle' },
                { text: [{ text: this.facialConsentFormGroup.value.checkbox_6 === true ? 'Yes, ' : '', style: 'infoAnsStyle' }, 'I have read the post care instructions and agree to adhere to them.'], style: 'infoQuesStyle' },
                { text: 'Reservation & Cancellation Policy for all current and future appointments: a valid credit card is required for all appointments. Please do not forget to confirm your appointment when you receive your reminder from Clementines Salon & Skincare. In the event of cancellations received less than 24 hours prior to appointment, a cancellation fee equal to 50% of the reserved service booking will incur. No Shows will be charged 100%.', style: 'infoQuesStyle' },
                {
                    text: [{ text: this.facialConsentFormGroup.value.checkbox_7 === true ? 'Yes, ' : '', style: 'infoAnsStyle' }
                        , 'I understand the servariont and cancellation policies at this salon and consent to my credit card on file being charged if I fail to give 24 hour notice for appointments.'], style: 'infoQuesStyle'
                },
                {
                    text:
                        [{ text: this.facialConsentFormGroup.value.checkbox_8 === true ? 'Yes, ' : '', style: 'infoAnsStyle' },
                            'I understand, have read and completed this questionnaire truthfully. I agree that this constitutes full disclosure, and that it supersedes any previous verbal or written disclosures. I understand that withholding information or providing misinformation may result in contraindications and/or irritation to the skin from treatments received. The treatments I receive here are voluntary and I release this skin care professional from liability and assume full responsibility thereof.',
                        ], style: 'infoQuesStyle'
                },
                {
                    text: 'Signature:  ',
                    style: 'signatureStyle'
                },
                {
                    image: this.signatureImage, style: 'infoAnsStyle'
                },
                { text: ['Date : ', { text: this.convertDate(formValue.date), style: 'infoAnsStyle' }], style: 'infoQuesStyle' },
            ],

            styles: {
                formLogo: {
                    alignment: 'center',
                    margin: [0, 0, 0, 30],
                },
                formHeader: {
                    bold: true,
                    color: '#2c425c',
                    fontSize: 18,
                    margin: [0, 0, 30, 15],
                },
                subHeader: {
                    bold: true,
                    color: '#2c425c',
                    fontSize: 13,
                    margin: [0, 0, 30, 15],
                },
                infoQuesStyle: {
                    color: '#2c425c',
                    fontSize: 12,
                    margin: [0, 0, 30, 12],
                },
                infoAnsStyle: {
                    color: '#2c425c',
                    fontSize: 12,
                    margin: [0, 0, 30, 12],
                    bold: true,
                },
                textAreaStyle: {
                    color: '#2c425c',
                    fontSize: 12,
                    margin: [0, 0, 0, 12],
                },
                textAreaHideStyle: {
                    margin: [0, 0, 0, 0]
                },
                textAreaAnsShow: {
                    color: '#2c425c',
                    fontSize: 12,
                    margin: [0, 0, 0, 12],
                    bold: true,
                },
                signatureStyle: {
                    color: '#2c425c',
                    fontSize: 12,
                    bold: true,
                },
            }
        }
        await this.loadPdfMaker();
        const pdfDocGenerator = this.pdfMake.createPdf(docDefinition)
        pdfDocGenerator.getBlob((getBlob) => {
            this.uploadImagesToS3(getBlob);
        });
    }

    convertDate(viewDate) {
        var date = new Date(viewDate),
            month = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2)
        return [month, day, date.getFullYear()].join("/");
    }

    onRadiomedicationChange(e) {
        if (e.value === 'Yes') {
            this.isChecked5 = true;
            this.facialConsentFormGroup.controls['input_14'].setValidators(Validators.required);
            this.facialConsentFormGroup.controls['input_14'].updateValueAndValidity();
        }
        else {
            this.isChecked5 = false;
            this.facialConsentFormGroup.controls.input_14.setValue('');
            this.facialConsentFormGroup.controls['input_14'].clearValidators();
            this.facialConsentFormGroup.controls['input_14'].updateValueAndValidity();
        }
    }

    onIssueChange(e) {
        if (e.value === 'Yes') {
            this.isChecked6 = true;
            this.facialConsentFormGroup.controls['input_15'].setValidators(Validators.required);
            this.facialConsentFormGroup.controls['input_15'].updateValueAndValidity();
        }
        else {
            this.isChecked6 = false;
            this.facialConsentFormGroup.controls.input_15.setValue('');
            this.facialConsentFormGroup.controls['input_15'].clearValidators();
            this.facialConsentFormGroup.controls['input_15'].updateValueAndValidity();
        }
    }

    onVitaminChange(e) {
        if (e.value === 'currently using' || e.value === 'last 30 days' || e.value === 'last 6 months') {
            this.isChecked2 = true;
            this.facialConsentFormGroup.controls['input_11'].setValidators(Validators.required);
            this.facialConsentFormGroup.controls['input_11'].updateValueAndValidity();
        }
        else {
            this.isChecked2 = false;
            this.facialConsentFormGroup.controls.input_11.setValue('');
            this.facialConsentFormGroup.controls['input_11'].clearValidators();
            this.facialConsentFormGroup.controls['input_11'].updateValueAndValidity();
        }
    }

    addFacialConsentFormData() {
        const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        this.facialConsentFormGroup = new FormGroup({
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl("", [Validators.required]),
            phone_number: new FormControl('', [Validators.required, Validators.minLength(14), Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)]),
            email: new FormControl("", [Validators.required, Validators.pattern(emailPattern)]),
            checkbox_1: new FormArray([]),
            checkbox_2: new FormArray([]),
            checkbox_3: new FormArray([]),
            checkbox_4: new FormArray([]),
            checkbox_5: new FormArray([]),
            checkbox_6: new FormControl('', [Validators.required]),
            checkbox_7: new FormControl('', [Validators.required]),
            checkbox_8: new FormControl('', [Validators.required]),
            radio_1: new FormControl('', [Validators.required]),
            radio_2: new FormControl('', [Validators.required]),
            radio_3: new FormControl('', [Validators.required]),
            radio_4: new FormControl('', [Validators.required]),
            radio_5: new FormControl('', [Validators.required]),
            radio_6: new FormControl('', [Validators.required]),
            radio_7: new FormControl('', [Validators.required]),
            radio_8: new FormControl('', [Validators.required]),
            radio_9: new FormControl('', [Validators.required]),
            input_1: new FormControl(''),
            input_2: new FormControl('', []),
            input_3: new FormControl('', []),
            input_4: new FormControl('', []),
            input_5: new FormControl('', []),
            input_6: new FormControl('', []),
            input_7: new FormControl('', []),
            input_8: new FormControl('', []),
            input_9: new FormControl('', []),
            input_10: new FormControl('', []),
            input_11: new FormControl(''),
            input_12: new FormControl('', []),
            input_13: new FormControl('', []),
            input_14: new FormControl(''),
            input_15: new FormControl(''),
            textarea_1: new FormControl("", [Validators.required, Validators.maxLength(150)]),
            textarea_2: new FormControl("", [Validators.maxLength(150)]),
            textarea_3: new FormControl("", [Validators.maxLength(150)]),
            date: new FormControl('', [Validators.required]),
        });
    }

    postForms(text) {
        sendDataToFlutter(text);
    }

    async uploadImagesToS3(blob) {
        const item = blob;
        return new Promise((resolve) => {
            const extensionName = ".pdf";
            const milliseconds = new Date().getTime();
            const resourceFileName = 'pdf_' + milliseconds + extensionName;
            this.formService.uploadImagesToS3(item, resourceFileName, extensionName, (status, response) => {
                if (status === 1) {
                    this.updateFormToS3(resourceFileName);
                    resolve({ status: true, data: item });
                } else {
                    resolve({ status: false, data: null });
                }
            });
        });
    }

    updateFormToS3(key) {
        const request = {
            status: 'Completed',
            pdf_s3_key_id: key
        }

        this.responseMessage = '';

        this.isIntakeForm ?
            this.formService.UpdateIntakeFormToS3Service(this.salonId, this.clientId, this.formId, request, (status, response) => {
                if (status === 200) {
                    this.isApiCalling = false;
                    this.isFormSubmitted = true;
                    this.postForms('Form submitted Successfully');
                    this.responseMessage = 'Your form has been submitted.'
                } else {
                    this.isApiCalling = false;
                    this.isFormSubmitted = true;
                    this.responseMessage = response.message
                }
            }) :
            this.formService.UpdateFormToS3Service(this.salonId, this.clientId, this.formId, request, (status, response) => {
                if (status === 200) {
                    this.isApiCalling = false;
                    this.isFormSubmitted = true;
                    this.postForms('Form submitted Successfully');
                    this.responseMessage = 'Your form has been submitted.'
                } else {
                    this.isApiCalling = false;
                    this.isFormSubmitted = true;
                    this.responseMessage = response.message
                }
            })
    }
}

function sendDataToFlutter(value) {
    Print.postMessage(value)
}
