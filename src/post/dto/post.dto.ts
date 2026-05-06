import { IsBoolean, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { User } from "src/users/user.entity";

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
  user!: User
}