import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { Post } from "./post.entity";
import { User } from "src/users/user.entity";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post , User]) , AuthModule],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}