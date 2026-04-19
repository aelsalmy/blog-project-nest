import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./role.decorator";

@Injectable()
export class RolesGuard implements CanActivate{

  constructor(private reflector:Reflector){}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const rolesNeeded = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if(!rolesNeeded){
      return true
    }

    const body = context.switchToHttp().getRequest()    
    const hasAccess =  rolesNeeded.some((role) => body.roles.includes(role))

    if(hasAccess){
      return true
    }
    else{
      throw new ForbiddenException('You do not have access to this resource')
    }
  }
}