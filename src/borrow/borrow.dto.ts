import { IsNumber } from 'class-validator';

export class createBorrowDto {
  @IsNumber()
  post_id: number;
  @IsNumber()
  owner_id: number;
  @IsNumber()
  amount: number;
}