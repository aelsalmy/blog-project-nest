import { IsBoolean, IsNumber, IsString, MinLength } from "class-validator";


export class UpdatePostDto {
  @IsString()
  @MinLength(5)
  content!: string

  @IsNumber()
  postId!: number
}