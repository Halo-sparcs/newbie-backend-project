import {
  Body,
  Controller,
  Request,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ReturnService } from './return.service';
import { createReturnDto } from './return.dto';
import { Return } from '@prisma/client';
import { IsUserGuard } from '../auth/guards/isUser.guard';

export const SetField = (fieldName: string) => SetMetadata('fieldName', fieldName);

@Controller('return')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @UseGuards(IsUserGuard)
  @Post('create')
  async createReturn(@Request() req, @Body() body: createReturnDto): Promise<Return> {
    console.log(body, Number(req.user.user_id));
    return this.returnService.createReturn(Number(req.user.user_id), body);
  }

  @UseGuards(IsUserGuard)
  @SetField('id')
  @Get('returnView/:id/:last_id')
  async getByOwnerId(
    @Param('id') id: number,
    @Param('last_id') last_id: number): Promise<Return[]> {
    return this.returnService.getByOwnerId(Number(last_id), Number(id));
  }

  @UseGuards(IsUserGuard)
  @Delete(':id/:confirmed')
  async deleteByOwnerId(
    @Request() req,
    @Param('id') id: number,
    @Param('confirmed') confirmed: string,
  ): Promise<void> {
    await this.returnService.deleteReturn(Number(req.user.user_id), Number(id), (confirmed === "true"));
  }
}
