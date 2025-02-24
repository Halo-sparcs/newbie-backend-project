import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BorrowRepository } from './borrow.repository';
import { LogService } from '../log/log.service';
import { createBorrowDto } from './borrow.dto';
import { Borrow } from '@prisma/client';

@Injectable()
export class BorrowService {
  constructor(
    private readonly borrowRepository: BorrowRepository,
    private readonly logService: LogService,
  ) {}

  async createBorrow(id: number, dto: createBorrowDto): Promise<Borrow> {
    return this.borrowRepository.createBorrow(id, dto);
  }

  async deleteBorrow(user_id: number, id: number, confirmed: boolean): Promise<void> {
    const borrowRequest = await this.borrowRepository.getById(user_id);
    if (!borrowRequest) {
      throw new BadRequestException("Borrow not found");
    }
    if (user_id !== borrowRequest.owner_id) {
      if (confirmed) {
        throw new ForbiddenException("You don't have permission to delete this borrow"); // it means that user is borrower (or none)
      }
      if (user_id !== borrowRequest.borrower_id) {
        throw new ForbiddenException("You don't have permission to access this borrow"); // user is neither borrower nor owner
      }
    }
    if (confirmed) { // writing log
      await this.logService.createLog({
        borrower_id: borrowRequest.borrower_id,
        amount: borrowRequest.amount,
        post_id: borrowRequest.post_id,
        owner_id: borrowRequest.owner_id,
      });
    }
    await this.borrowRepository.deleteBorrow(borrowRequest.post_id, id);
  }

  async getByBorrower(last_id: number, borrower_id: number): Promise<Borrow[]> {
    return this.borrowRepository.getByBorrower(last_id, borrower_id);
  }

  async getByOwner(last_id: number, owner_id: number): Promise<Borrow[]> {
    return this.borrowRepository.getByOwnerId(last_id, owner_id);
  }
}
