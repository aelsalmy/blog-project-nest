import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import bcrypt from 'bcrypt'
import { UserProfile } from './userProfile.entity';
import { UserMapper } from './user.mapper';
import { MailService } from 'src/mailing/mail.service';
import { Role } from 'src/auth/role.entity';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile) private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly mailService: MailService,
    private readonly userMapper: UserMapper
  ){}

  async registerUser(username: string , email: string , password: string , profile: UpdateProfileDto){

    const duplAcc = await this.userRepository.findOne({
      where: [
        {email: email},
        {username: username}
      ]
            
    })

    if(duplAcc){
      if(duplAcc.username === username){
        throw new BadRequestException('Account with same username exists')
      }
      else{
        throw new BadRequestException('Account with same email exists')
      }
    }

    const hashedPassword = await bcrypt.hash(password , 12)

    const newUserProfile = this.userProfileRepository.create({
      profession: profile.profession,
      city: profile.city,
      country: profile.country
    })
    
    await this.userProfileRepository.save(newUserProfile)

    const userRole = await this.roleRepository.findOne({
      where: {name: 'User'}
    })

    const newUser = this.userRepository.create({
      username: username,
      email: email,
      hashedPassword: hashedPassword,
      userProfile: newUserProfile,
      roles: [userRole!]
    })

    await this.userRepository.save(newUser)

    await this.mailService.sendWelcomeMail(newUser.email , newUser.username)

    return this.userMapper.toUserDto(newUser)
  }

  async getUserProfile(userId: number){
    const user = await this.userRepository.findOne({
      where: {id: userId},
      relations: ['userProfile']
    })

    if(!user){
      throw new NotFoundException('User Not Found')
    }

    return user.userProfile
  }

  async getUserAccount(userId: number){
    const user = await this.userRepository.findOne({
      where: {id: userId},
      relations: ['userProfile']
    })

    if(!user){
      throw new NotFoundException('User Not Found')
    }

    return this.userMapper.toUserDto(user)
  }

  async updateUserProfile(userId: number , profession: string , city: string , country: string){
    const user = await this.userRepository.findOne({
      where: {id: userId},
      relations: ['userProfile']
    })

    if(!user){
      throw new NotFoundException('Profile not found')
    }

    const userProfile = user.userProfile

    console.log(userId , profession , city , country)

    if(profession)
      userProfile.profession = profession
    if(city)
      userProfile.city = city
    if(country)
      userProfile.country = country

    console.log(userProfile)

    const newProfile = await this.userProfileRepository.save(userProfile)

    console.log('new:' , newProfile)

    return newProfile
  }
}
