import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { ServiceResponse } from 'src/utils/enums';
import * as AWS from 'aws-sdk';

@Injectable({
    providedIn: 'root',
})

export class FormService {
    constructor(
        protected httpClient: HttpClient
    ) { }

    UpdateFormToS3Service(salonId: number, clientId: number, formId: number, request, callback) {
        const url = environment.api_end_point + 'salon/' + salonId + '/client/' + clientId + '/form/' + formId;

        this.httpClient.put(url, request).subscribe((data) => {
            if (data['statusCode'] === 200) {
                callback(ServiceResponse.success, data);
            } else {
                callback(ServiceResponse.error, data);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    UpdateIntakeFormToS3Service(salonId: number, clientId: number, formId: number, request, callback) {
        const url = environment.api_end_point + 'salon/' + salonId + '/client/' + clientId + '/form/' + formId + '/intake';

        this.httpClient.put(url, request).subscribe((data) => {
            if (data['statusCode'] === 200) {
                callback(ServiceResponse.success, data);
            } else {
                callback(ServiceResponse.error, data);
            }
        },
            (error: HttpErrorResponse) => {
                callback(ServiceResponse.error, error.error);
            });
    }

    uploadImagesToS3(selectedFile: any, resourceFileName, type: string, callback) {

        const folderName = type === '.mp4' ? "videos" : type === '.MP4' ? "videos" : type === '.pdf' ? 'pdf' : "images";
        const AWSService = AWS;
        AWSService.config.region = environment.region;
        AWSService.config.credentials = new AWSService.CognitoIdentityCredentials({
            IdentityPoolId: environment.identityPoolId
        });
        const s3 = new AWSService.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: environment.bucketName }
        });
        var file = new File([selectedFile], "filename");

        s3.upload(
            {
                Key: folderName + '/' + resourceFileName,
                Bucket: environment.bucketName,
                Body: file,
                ACL: 'public-read'
            },
            function(err, data) {
                if (err) {
                    callback(0, 'There was an error uploading your file');
                } else {
                    callback(1, data);
                }
            }
        );

    }

}