import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class UpdateProfileDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  profession!: string

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  city!: string

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  country!: string
}