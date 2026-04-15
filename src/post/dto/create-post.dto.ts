import { IsBoolean, IsString, MinLength } from "class-validator";


export class CreatePostDto {
  @IsString()
  @MinLength(5)
  content!: string
}