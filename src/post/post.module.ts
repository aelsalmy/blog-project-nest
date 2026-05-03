import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { Post } from "./post.entity";
import { User } from "src/users/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { MailModule } from "src/mailing/mail.module";
import { RabbitMQModule } from "src/config/rabbitmq.module";
import { PostMapper } from "./post.mapper";
import { S3Service } from "src/image-upload/s3.service";

@Module({
  imports: [TypeOrmModule.forFeature([Post , User]) , AuthModule , MailModule, RabbitMQModule],
  controllers: [PostController],
  providers: [PostService , PostMapper , S3Service]
})
export class PostModule {}