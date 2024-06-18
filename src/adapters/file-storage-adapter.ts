import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { CustomisableException } from '../exceptions/custom.exceptions';
import { Upload } from "@aws-sdk/lib-storage";
dotenv.config();
const accessKey = process.env.YANDEX_CLOUD_KEY;
const kyeId = process.env.YANDEX_CLOUD_KEY_ID;
const bucketName = process.env.YANDEX_CLOUD_BUCKET_NAME;

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
        ContentType: 'image/png'
    }

    // const command = new PutObjectCommand(bucketParams)
    try {
        // const uploadResult = await this.s3Client.send(command)
        // return uploadResult

        const upload = new Upload({
            client: this.s3Client,
            params: bucketParams
        });

        upload.on("httpUploadProgress", (progress) => {
            console.log(progress);
        });

        const uploadResult = await upload.done();
        return uploadResult;
    } catch (error) {
        console.log(error);
        throw new CustomisableException('uploadFile', 'unable upload this file', 418)
    }
}

async getImageMetadata(key){
    const bucketParams = {
        Bucket: bucketName,
        Key: key
    };
    try {
        const command = new HeadObjectCommand(bucketParams)
        const metadata = await this.s3Client.send(command)
        console.log("------ getImageMetadata ------- ", metadata);
        
        return metadata
        
    } catch (error) {
        throw new CustomisableException('metadata', 'File not found', 404);        
    }

}

private async getImageFile(key: string): Promise<Buffer | null> {
    const bucketParams = {
        Bucket: bucketName,
        Key: key
    };

    try {
        const command = new GetObjectCommand(bucketParams);
        const data = await this.s3Client.send(command);

        if (data.Body) {
            const streamToBuffer = (stream): Promise<Buffer> => {
                return new Promise((resolve, reject) => {
                    const chunks = [];
                    stream.on('data', (chunk) => chunks.push(chunk));
                    stream.on('end', () => resolve(Buffer.concat(chunks)));
                    stream.on('error', reject);
                });
            };
            return await streamToBuffer(data.Body);

        } else {
            return null
        }
    } catch (error) {
        console.log(error);
        throw new CustomisableException('getImageFile', 'Unable to retrieve the file', 418);
    }
}

async saveBlogWallpaper(
    userId: string,
    blogId: string,
    bufer: Buffer,
){
    const uploadKey = `content/images/${userId}/blogs/${blogId}_blog_wallpaper.png`
    const uploadResult = await this.saveImageFile(uploadKey, bufer)    
    return uploadResult.Key
}

async getBlogWallpaper(    
    userId: string,
    blogId: string,){
        const key = `content/images/${userId}/blogs/${blogId}_blog_wallpaper.png`
        const blogWllpaper = await this.getImageFile(key)
        if(blogWllpaper){
            return blogWllpaper
        } else {
            return null
        }
    }

    async getBlogMain(    
        userId: string,
        blogId: string,){
            const key = `content/images/${userId}/blogs/${blogId}_blog_main.png`
            const blogMain = await this.getImageFile(key)
            if(blogMain){
                return blogMain
            } else {
                return null
            }
        }

        

async saveBlogMain(
    userId: string,
    blogId: string,
    bufer: Buffer,
){    
    const uploadKey = `content/images/${userId}/blogs/${blogId}_blog_main.png`
    const uploadResult = await this.saveImageFile(uploadKey, bufer)    
    return uploadResult.Key
}



}
