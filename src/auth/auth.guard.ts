import { Injectable , CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Request } from 'express'
import { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId: number;
}

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private readonly authService: AuthService){}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
      throw new UnauthorizedException('Unauthorized Access')
    }

    const token = authHeader.split(' ')[1]

    if(!token){
      throw new UnauthorizedException('Unauthorized Access')
    }

    try{
      const payload = await this.authService.verifyAccessToken(token) as JwtPayload
      request.userId = payload.userId 
      return true
    }
    catch(err){
      throw new UnauthorizedException('Unauthorized Access')
    }
  }

}