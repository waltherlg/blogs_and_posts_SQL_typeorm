import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { CustomisableException } from '../exceptions/custom.exceptions';
import { Upload } from '@aws-sdk/lib-storage';
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
        accessKeyId: kyeId,
      },
    });
  }

  private async saveImageFile(key, buffer: Buffer, metadata) {
    const bucketParams = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
      Metadata: {
        format: metadata.format,
        size: metadata.size.toString(),
        width: metadata.width.toString(),
        height: metadata.height.toString(),
      },
    };

    try {
      // const command = new PutObjectCommand(bucketParams);
      // const response = await this.s3Client.send(command);
      // return response

      const upload = new Upload({
        client: this.s3Client,
        params: bucketParams,
      });

      upload.on('httpUploadProgress', (progress) => {});
      const uploadResult = await upload.done();
      return uploadResult;
    } catch (error) {
      throw new CustomisableException(
        'uploadFile',
        'unable upload this file',
        418,
      );
    }
  }

  private async getImageMetadata(key) {
    const bucketParams = {
      Bucket: bucketName,
      Key: key,
    };
    try {
      const command = new HeadObjectCommand(bucketParams);
      const metadata = await this.s3Client.send(command);
      return metadata;
    } catch (error) {
      throw new CustomisableException('metadata', 'File not found', 404);
    }
  }

  private async getImageFile(key: string) {
    const bucketParams = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(bucketParams);
      const data = await this.s3Client.send(command);
      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async saveBlogWallpaper(
    userId: string,
    blogId: string,
    bufer: Buffer,
    metadata,
  ) {
    const uploadKey = `content/images/${userId}/blogs/${blogId}_blog_wallpaper.png`;
    const uploadResult = await this.saveImageFile(uploadKey, bufer, metadata);
    return uploadResult.Key;
  }

  async getBlogWallpaper(userId: string, blogId: string) {
    const key = `content/images/${userId}/blogs/${blogId}_blog_wallpaper.png`;
    const blogWllpaper = await this.getImageFile(key);
    if (blogWllpaper) {
      return blogWllpaper;
    } else {
      return null;
    }
  }

  async getBlogMain(userId: string, blogId: string) {
    const key = `content/images/${userId}/blogs/${blogId}_blog_main.png`;
    const blogMain = await this.getImageFile(key);
    if (blogMain) {
      return blogMain.Metadata;
    } else {
      return null;
    }
  }

  async getBlogWallpaperKeyAndMetadata(userId: string, blogId: string) {
    const key = `content/images/${userId}/blogs/${blogId}_blog_wallpaper.png`;
    const blogWallpaperMetadata = await this.getImageFile(key);

    if (blogWallpaperMetadata) {
      blogWallpaperMetadata.Metadata.key = key;
      return blogWallpaperMetadata.Metadata;
    } else {
      return null;
    }
  }

  async getBlogMainKeyAndMetadata(userId: string, blogId: string) {
    const key = `content/images/${userId}/blogs/${blogId}_blog_main.png`;
    const blogMain = await this.getImageFile(key);

    if (blogMain) {
      blogMain.Metadata.key = key;
      return blogMain.Metadata;
    } else {
      return null;
    }
  }

  async saveBlogMain(userId: string, blogId: string, bufer: Buffer, metadata) {
    const uploadKey = `content/images/${userId}/blogs/${blogId}_blog_main.png`;
    const uploadResult = await this.saveImageFile(uploadKey, bufer, metadata);
    return uploadResult.Key;
  }

  async savePostMain(
    userId: string,
    blogId: string,
    postId: string,
    bufer: Buffer,
    metadata,
    size: PostMainSizeEnum,
  ) {
    const uploadKey = `content/images/${userId}/blogs/${blogId}/posts/${postId}_post_main_${size}.png`;
    const uploadResult = await this.saveImageFile(uploadKey, bufer, metadata);
    return uploadResult.Key;
  }
}
export enum PostMainSizeEnum {
  origin = 'origin',
  middle = 'middle',
  small = 'small',
}
