import { S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class S3StorageAdapter {
    constructor() {
        const REGION = 'us-east-1';
        const s3Client = new S3Client
    }
}