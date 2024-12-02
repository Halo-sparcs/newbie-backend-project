import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { LogService } from './log.service';
import { createLogDto } from './log.dto';
import { IsUserGuard } from '../auth/guards/isUser.guard';
import { AuthorGuard } from '../auth/guards/authorGuard.guard';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @UseGuards(IsUserGuard)
  @Post('lend')
  create(@Body() createLogDto: createLogDto) {
    return this.logService.lend(createLogDto);
  }

  @Get('getBorrower/:borrower_id')
  getByBorrowerId(@Param('borrower_id') borrower_id: number) {
    return this.logService.getByBorrowerId(borrower_id);
  }

  @Get('getOwner/:owner_id')
  getByOwnerId(@Param('owner_id') owner_id: number) {
    return this.logService.getByOwnerId(owner_id);
  }

  @UseGuards(AuthorGuard)
  @SetMetadata('resourceType', 'log')
  @Patch('return/:log_id')
  return(@Param('log_id') log_id: number) {
    return this.logService.return(log_id);
  }
}
