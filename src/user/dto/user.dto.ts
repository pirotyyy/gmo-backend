import { IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsBoolean()
  isAdmin: boolean;
}
