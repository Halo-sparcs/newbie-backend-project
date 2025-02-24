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
import { BorrowService } from './borrow.service';
import { createBorrowDto } from './borrow.dto';
import { Borrow } from '@prisma/client';
import { IsUserGuard } from '../auth/guards/isUser.guard';

export const SetField = (fieldName: string) => SetMetadata('fieldName', fieldName);


@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @UseGuards(IsUserGuard) // anyone can borrow
  @Post('create')
  async createBorrow(@Request() req, @Body() body: createBorrowDto): Promise<Borrow> {
    return this.borrowService.createBorrow(Number(req.user.user_id), body);
  }

  @UseGuards(IsUserGuard)
  @SetField('borrower_id')
  @Get('getByBorrower/:borrower_id/:last_id')
  async getByBorrower(
    @Param('borrower_id') borrower_id: number,
    @Param('last_id') last_id: number,
  ): Promise<Borrow[]> {
    return this.borrowService.getByBorrower(Number(last_id), Number(borrower_id));
  }

  @UseGuards(IsUserGuard)
  @SetField('owner_id') // if owner_id is not user's id -> banned
  @Get('getByOwner/:owner_id/:last_id')
  async getByOwner(
    @Param('owner_id') owner_id: number,
    @Param('last_id') last_id: number,
  ): Promise<Borrow[]> {
    return this.borrowService.getByOwner(Number(last_id), Number(owner_id));
  }

  @UseGuards(IsUserGuard)
  @Delete(':id/:confirmed') // In this case, both borrower and owner can delete borrowlist.
  async deleteBorrower(
    @Request() req,
    @Param('id') id: number,
    @Param('confirmed') confirmed: boolean,
  ): Promise<void> {
    await this.borrowService.deleteBorrow(Number(req.user.user_id), Number(id), Boolean(confirmed));
  }
}
