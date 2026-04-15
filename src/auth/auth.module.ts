import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "src/refreshToken/refreshToken.entity";
import { User } from "src/users/user.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([User , RefreshToken])],
  providers: [AuthService , AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard, AuthService]
})
export class AuthModule {}