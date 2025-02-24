import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3 = new AWS.S3();
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  // 업로드를 위한 pre-signed URL 생성 (PUT)
  async getUploadUrl(fileType: string): Promise<{ key: string; url: string }> {
    // 확장자 추출 (예: image/jpeg -> jpeg)
    const extension = fileType.split('/')[1];
    const key = `${uuid()}.${extension}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60, // URL 유효기간 60초
      ContentType: fileType,
    };
    const url = await this.s3.getSignedUrlPromise('putObject', params);
    return { key, url };
  }

  // 삭제를 위한 pre-signed URL 생성 (DELETE)
  async getDeleteUrl(key: string): Promise<{ url: string }> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60, // URL 유효기간 60초
    };
    const url = await this.s3.getSignedUrlPromise('deleteObject', params);
    return { url };
  }

  async getFileUrl(key: string): Promise<{ url: string }> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 600,
    };
    const url = await this.s3.getSignedUrlPromise('getObject', params);
    return { url };
  }
}
