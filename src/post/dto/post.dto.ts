import { IsBoolean, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { UserDto } from "src/users/dtos/user-dto";

export class PostDto {
  @IsString()
  @MinLength(5)
  content!: string

  @IsBoolean()
  isPublished!: boolean

  @IsBoolean()
  isApproved!: boolean

  @IsNumber()
  userId!: number

  @IsString()
  image!: string | null

  @IsNotEmpty()
  id!: number

  @IsNotEmpty()
  user!: UserDto
}