import { IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class userDto {
  @IsNumber()
  id: number;
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  user_id: string;
  @IsString()
  @MinLength(4)
  user_pwd: string;
  @MinLength(4)
  username: string;
  @IsString()
  place: string;
  @IsString()
  contact: string;
}

export class createUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  user_id: string;
  @IsString()
  @MinLength(8)
  user_pwd: string;
  @IsString()
  @MinLength(4)
  username: string;
  @IsString()
  place: string;
  @IsString()
  contact: string;
}
