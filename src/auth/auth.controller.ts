import { Controller, HttpStatus, Post , Res , Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response , Request } from 'express';
import { RefreshToken } from 'src/refreshToken/refreshToken.entity';
import { UserLoginDto } from 'src/users/dtos/user-login.dto';


@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @Post('login')
  async userLogin(@Body() body: UserLoginDto , @Res() resp: Response){

    const {username , password} = body

    const {accessToken , refreshToken} = await this.authService.userLogin(username , password)

    resp.cookie("refreshToken" , refreshToken ,{
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7*24*60*60*1000
    }).status(HttpStatus.OK)
      .json({accessToken: accessToken})
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request , @Res() resp: Response){
    const {tokenId , token , userId} = req.cookies['refreshToken']

    const newAccessToken = await this.authService.renewAccessToken(userId , tokenId , token)
    const newRefreshToken = await this.authService.renewRefreshToken(userId , tokenId , token)

     resp.cookie("refreshToken" , newRefreshToken ,{
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7*24*60*60*1000
    }).status(HttpStatus.OK)
      .json({accessToken: newAccessToken})
  }

  @Post('signout')
  async userSignout(@Req() req: Request , @Res() resp: Response){
    const {tokenId , token , userId} = req.cookies['refreshToken']

    await this.authService.revokeRefreshToken(tokenId)

    resp.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    }).status(HttpStatus.OK)
      .json({message: "User Signed Out Successfully"})
  }

}
