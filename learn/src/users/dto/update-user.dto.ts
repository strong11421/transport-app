import { IsString, MinLength ,IsEmail, IsNotEmpty } from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MinLength(3)
  name: string;
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

