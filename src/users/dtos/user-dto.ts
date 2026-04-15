import { IsEmail, IsNotEmpty, IsString , MinLength, ValidateNested } from "class-validator";
import { UpdateProfileDto } from "./update-profile.dto";
import { Type } from "class-transformer";


export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username!: string
  
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @ValidateNested()
  @Type(() => UpdateProfileDto)
  profile!: UpdateProfileDto
}