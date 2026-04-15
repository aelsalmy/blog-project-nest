import { IsBoolean, IsNumber, IsString, MinLength } from "class-validator";

export class PostDto {
  @IsString()
  @MinLength(5)
  content!: string

  @IsBoolean()
  isPublished!: boolean

  @IsNumber()
  userId!: number
}