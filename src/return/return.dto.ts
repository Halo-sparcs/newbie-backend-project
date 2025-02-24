import { IsNumber } from 'class-validator';

export class createReturnDto {
  @IsNumber()
  log_id: number;
  @IsNumber()
  owner_id: number;
}
