import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Response } from 'express';
import type { AuthRequest } from 'src/auth/auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user-dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService){}

  @Post()
  async createUser(@Body() body: CreateUserDto, @Res() resp: Response){
    const {username , email , password , profile} = body

    const newUser: UserDto = await this.usersService.registerUser(username , email , password , profile)

    resp.status(HttpStatus.CREATED).json({message: 'User Created Successfully' , user: newUser})
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getUserProfile(@Req() request: AuthRequest , @Res() resp: Response){
    const userId = request.userId

    const userProfile = await this.usersService.getUserProfile(userId)

    console.log(userProfile)

    resp.status(HttpStatus.OK).json(userProfile)
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateUserProfile(@Req() request: AuthRequest , @Res() resp: Response){
    const userId = request.userId
    const {profession , city , country} = request.body

    const updatedProfile = await this.usersService.updateUserProfile(userId , profession , city , country)

    resp.status(HttpStatus.OK).json(updatedProfile)
  }
}
