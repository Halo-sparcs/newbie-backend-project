import { IsString, IsNumber } from 'class-validator';

/*
  id Int @id @default(autoincrement())
  log Log @relation(fields: [log_id], references: [id], name: "reviewoflogx")
  log_id Int
  rate Int
  comment String
  reviewer Users @relation(fields: [reviewer_id], references: [id], name: "reviewofuser")
  reviewer_id Int
  target Users @relation(fields: [target_id], references: [id], name: "targetedreview")
  target_id Int
 */

export class createReviewDto {
  @IsNumber()
  log_id: number;
  @IsNumber()
  rate: number;
  @IsString()
  comment: string;
  @IsNumber()
  reviewer_id: number;
  @IsNumber()
  target_id: number;
}

export class updateReviewDto {
  @IsNumber()
  rate: number;
  @IsString()
  comment: string;
}
