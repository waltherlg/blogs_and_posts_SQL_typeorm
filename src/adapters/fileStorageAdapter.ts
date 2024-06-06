import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import * as dotenv from 'dotenv';
import { CustomisableException } from "../exceptions/custom.exceptions";
dotenv.config();
const accessKey = process.env.YANDEX_CLOUD_KEY
const kyeId = process.env.YANDEX_CLOUD_KEY_ID
const bucketName = process.env.YANDEX_CLOUD_BUCKET_NAME

@Injectable()
export class S3StorageAdapter {
    s3Client: S3Client;
    constructor() {
        const REGION = 'us-east-1';
        this.s3Client = new S3Client({
            region: REGION,
            endpoint: 'https://storage.yandexcloud.net',
            credentials: {
                secretAccessKey: accessKey,
                accessKeyId: kyeId
            }
        })
    }

  private async saveImageFile(
    key,
    buffer: Buffer
){
    const bucketParams = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: 'images/png'
    }

    const command = new PutObjectCommand(bucketParams)
    try {
        const uploadResult = await this.s3Client.send(command)
        return uploadResult
    } catch (error) {
        console.log(error);
        throw new CustomisableException('uploadFile', 'unable upload this file', 418)
    }
    


}  

async saveBlogWallpaper(
    userId: string,
    blogId: string,
    bufer: Buffer,
){
    const uploadKey = `content/images/${userId}/blogs/${blogId}_wallpaper.png`
    const uploadResult = await this.saveImageFile(uploadKey, bufer)
    return uploadResult
}
}

