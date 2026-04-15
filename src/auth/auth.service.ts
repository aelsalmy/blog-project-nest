import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt'
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken'
import { RefreshToken } from 'src/refreshToken/refreshToken.entity';
import crypto from 'crypto'

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ){}

  async userLogin(username:string , password: string){
    const user = await this.userRepository.findOneBy({username})

    if(!user){
      throw new BadRequestException('Invalid Credentials')
    }

    const isPasswordCorrect = await bcrypt.compare(password , user.hashedPassword)

    if(!isPasswordCorrect){
      throw new BadRequestException('Invalid Credentials')
    }

    const newAccessToken = await this.createAccessToken(user.id)
    const newRefreshToken = await this.createRefreshToken(user.id)

    return {accessToken: newAccessToken , refreshToken: newRefreshToken}
  }

  async renewAccessToken(userId: number , tokenId:number , refreshToken: string){
    const validRefreshToken = await this.validateRefreshToken(tokenId , refreshToken)

    if(!validRefreshToken){
      throw new UnauthorizedException('Invalid Token')
    }

    const user = await this.userRepository.findOneBy({id: userId})

    if(!user){
      throw new BadRequestException('Invalid userId')
    }

    const newAccessToken = await this.createAccessToken(userId)

    return newAccessToken
  }
  
  async renewRefreshToken(userId: number , tokenId:number , refreshToken: string){
    const validRefreshToken = await this.validateRefreshToken(tokenId , refreshToken)

    if(!validRefreshToken){
      throw new UnauthorizedException('Invalid Token')
    }

    await this.revokeRefreshToken(tokenId)

    const newRefreshToken = await this.createRefreshToken(userId)

    return newRefreshToken
  }

  async revokeRefreshToken(tokenId: number){
    const token = await this.refreshTokenRepository.findOneBy({id: tokenId})

    if(!token){
      throw new UnauthorizedException('Token not valid')
    }

    token.isRevoked = true

    const revokedToken = await this.refreshTokenRepository.save(token)

    return revokedToken
  }

  async verifyAccessToken(token: string){
    try{
      const accessTokenValid = jwt.verify(token , process.env.JWT_SECRET!)
      
      return accessTokenValid
    } catch(err) {
      throw new UnauthorizedException('Access Token Invalid')
    }
  }

  private async validateRefreshToken(tokenId: number , inToken: string){
    const token = await this.refreshTokenRepository.findOneBy({id: tokenId})

    if(!token){
      throw new UnauthorizedException('Invalid Token')
    }

    const isTokenValid = await bcrypt.compare(inToken , token.hashedToken)

    if(!isTokenValid){
      return false
    }
    if(token.isRevoked){
      return false
    }
    if(new Date(token.expiresAt) < new Date(Date.now())){
      return false
    }

    return true
  }

  private async createRefreshToken(userId: number){
    const token = crypto.randomBytes(64).toString('hex')

    const hashedToken = await bcrypt.hash(token , 12)

    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const user = await this.userRepository.findOneBy({id: userId})

    if(!user){
      throw new NotFoundException('User Id not Valid')
    }

    const newRefreshToken = this.refreshTokenRepository.create({
      hashedToken: hashedToken,
      expiresAt: expiryDate,
      user: user
    })

    await this.refreshTokenRepository.save(newRefreshToken)

    return {userId:userId , tokenId: newRefreshToken.id , token: token}
  }

  private async createAccessToken(userId: number){
    const jwtToken = jwt.sign({userId: userId} , process.env.JWT_SECRET! , {
      expiresIn: '15m'
    })

    return jwtToken
  }

}
