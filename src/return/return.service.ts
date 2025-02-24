import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { ReturnRepository } from './return.repository';
import { LogService } from '../log/log.service';
import { createReturnDto } from './return.dto';
import { Return } from '@prisma/client';

@Injectable()
export class ReturnService {
  constructor(
    private readonly returnRepository: ReturnRepository,
    private readonly logService: LogService,
  ) {}

  async createReturn(user_id: number, dto: createReturnDto): Promise<Return> {
    const log = await this.logService.getLogById(dto.log_id);

    if (log.borrower_id !== user_id) {
      throw new ForbiddenException("You don't have permission to create a return for this log.");
    }
    return this.returnRepository.createReturn(user_id, dto);
  }

  async deleteReturn(user_id: number, id: number, confirmed: boolean): Promise<void> {
    const returnRequest = await this.returnRepository.getById(id);

    if (!returnRequest) {
      throw new BadRequestException("Return not found");
    }

    if (user_id !== returnRequest.owner_id) {
      throw new ForbiddenException("You don't have permission to delete this BorrowRequest");
    }

    if (confirmed) {
      await this.logService.updateLog(returnRequest.log_id); // writing log
    }

    const result = await this.returnRepository.deleteReturn(id);
    if (result) {
      return;
    }
    else {
      throw new BadRequestException(`Return with id ${id} not found`);
    }
  }

  async getByOwnerId(last_id: number, owner_id: number): Promise<Return[]> {
    return this.returnRepository.getByOwnerId(last_id, owner_id);
  }
}
