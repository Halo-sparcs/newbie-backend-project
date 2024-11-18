import { IsString, IsNumber, MinLength, MaxLength, Matches } from 'class-validator';

export class userDto {
  @IsNumber()
  id: number;
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  user_id: string;
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  user_pwd: string;
  @IsString()
  place: string;
  @IsString()
  @Matches()
  contact: string;
}
