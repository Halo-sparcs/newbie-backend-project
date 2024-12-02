import { IsNumber } from 'class-validator';

export class createLogDto {
  @IsNumber()
  post_id: number;
  @IsNumber()
  amount: number;
  @IsNumber()
  borrower_id: number;
}
