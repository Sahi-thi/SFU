import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AmazonService {

    constructor() {
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
