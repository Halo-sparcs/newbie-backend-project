import { IsString, MinLength, MaxLength } from 'class-validator';

export class loginDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  user_id: string;
  @IsString();
  @MinLength(4)
  @MaxLength(20)
  user_pwd: string;
}
