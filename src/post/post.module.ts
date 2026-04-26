import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { Post } from "./post.entity";
import { User } from "src/users/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { MailModule } from "src/mailing/mail.module";
import { RabbitMQModule } from "src/config/rabbitmq.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post , User]) , AuthModule , MailModule, RabbitMQModule],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}