import { Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';
import { createLogDto } from './log.dto';
import { Log } from '@prisma/client';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  async createLog(dto: createLogDto): Promise<void> {
    await this.logRepository.createLog(dto);
  }

  async updateLog(id: number): Promise<void> {
    await this.logRepository.updateLog(id);
  }

  async getLogById(id: number): Promise<Log> {
    return this.logRepository.getById(id);
  }

  // async alertLog(user_id: number): Promise<Log[]> {
  //   const borrowedList = await this.logRepository.getByBorrowerId(user_id);
  //
  //   const now = new Date();
  //
  //   const past = new Date(now);
  //   past.setDate(now.getDate() - 6);
  //
  //   const filteredList = borrowedList.filter((request) => {
  //     const borrowedAt = new Date(request.borrowed_at);
  //     return borrowedAt <= past; // if borrowedAt is much more past than past, alert.
  //   });
  //
  //   return filteredList;
  // }

  async getByBorrowerId(last_id: number, id: number): Promise<Log[]> {
    return this.logRepository.getByBorrowerId(last_id, id);
  }

  async getAll() {
    return this.logRepository.getAll();
  }
}
