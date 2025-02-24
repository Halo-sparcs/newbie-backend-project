import { Controller, Get, Query } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('upload-url')
  async getUploadUrl(@Query('fileType') fileType: string) {
    return await this.s3Service.getUploadUrl(fileType);
  }

  @Get('delete-url')
  async getDeleteUrl(@Query('key') key: string) {
    return await this.s3Service.getDeleteUrl(key);
  }

  @Get('file-url')
  async getFileUrl(@Query('key') key: string) {
    return await this.s3Service.getFileUrl(key);
  }
}
