import { IsString, IsNumber } from 'class-validator';

export class createPostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  image: string;
  @IsNumber()
  amount: number;
}

export class updatePostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  image: string;
  @IsNumber()
  amount: number;
}