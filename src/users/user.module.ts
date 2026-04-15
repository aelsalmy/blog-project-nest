import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UserProfile } from "./userProfile.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([User , UserProfile]) , AuthModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}