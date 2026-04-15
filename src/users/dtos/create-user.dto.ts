import { IsEmail, IsNotEmpty, IsString , MinLength, ValidateNested } from "class-validator";
import { UpdateProfileDto } from "./update-profile.dto";
import { Type } from "class-transformer";


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string
  
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @ValidateNested()
  @Type(() => UpdateProfileDto)
  profile!: UpdateProfileDto
}