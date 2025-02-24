import {
  Controller,
  Get,
  Param,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { LogService } from './log.service';
import { IsUserGuard } from '../auth/guards/isUser.guard';

export const SetField = (fieldName: string) => SetMetadata('fieldName', fieldName);

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get("all")
  async getAll() {
    return this.logService.getAll();
  }

  // @UseGuards(IsUserGuard)
  // @SetField("user_id")
  // @Get("alert/:user_id")
  // async alertLog(@Param('user_id') user_id: number) {
  //   return this.logService.alertLog(Number(user_id));
  // }

  @UseGuards(IsUserGuard)
  @SetField("user_id")
  @Get("left/:user_id/:last_id")
  async leftLog(
    @Param('user_id') user_id: number,
    @Param('last_id') last_id: number,) {
    return this.logService.getByBorrowerId(Number(last_id), Number(user_id));
  }
}
