import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UserProfile } from "./userProfile.entity";
import { AuthModule } from "src/auth/auth.module";
import { MailModule } from "src/mailing/mail.module";
import { Role } from "src/auth/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User , UserProfile, Role]) , AuthModule , MailModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}