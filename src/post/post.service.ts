import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/user.entity';
import { PostMapper } from './post.mapper';
import { MailService } from 'src/mailing/mail.service';
import { ClientProxy } from '@nestjs/microservices';
import { S3Service } from 'src/image-upload/s3.service';
import { randomUUID } from 'crypto';
import { extname } from 'path';


@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    @Inject('RABBITMQ_SERVICE') private readonly emailQueue: ClientProxy,
    private readonly s3Service: S3Service,
    private readonly postMapper: PostMapper
  ){}

  async getAllPosts(page: number , limit: number){
    const [postPage , total] = await this.postRepository.findAndCount({
      //where: {isApproved: true},
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
      order:{
        updatedAt: "DESC"
      }
    })

    const postDtos = await Promise.all(postPage.map((post) => this.postMapper.toDto(post)))

    return {
      posts: postDtos,
      total,
      page,
      lastPage: Math.ceil(total / limit)
    }
  }

  async getPostById(postId: number){
    const post = await this.postRepository.findOne({
      where: {id: postId},
      relations: ['user']
    })

    if(!post){
      throw new NotFoundException('No Post with this id exists')
    }

    return await this.postMapper.toDto(post)
  }

  async createPost(userId: number , content: string){
    const user = await this.userRepository.findOneBy({id: userId})

    if(!user){
      throw new NotFoundException('User Not Found')
    }

    const newPost = this.postRepository.create({
      content: content,
      user: user
    })

    await this.postRepository.save(newPost)

    return await this.postMapper.toDto(newPost)
  }

  async updatePost(userId: number , postId:number , content: string){
    const oldPost = await this.postRepository.findOne({
      where: {id: postId},
      relations: ['user']
    })

    if(!oldPost){
      throw new NotFoundException('Post Not Found')
    }

    if(oldPost.user.id !== userId){
      throw new UnauthorizedException('Access Denied: You are not authorized to edit post')
    }

    oldPost.content = content

    await this.postRepository.save(oldPost)
  
    return await this.postMapper.toDto(oldPost)
  }

  async deletePost(userId: number, postId: number){
    const oldPost = await this.postRepository.findOne({
      where: {id: postId},
      relations: ['user']
    })

    if(!oldPost){
      throw new NotFoundException('Post Not Found')
    }

    if(oldPost.user.id !== userId){
      throw new UnauthorizedException('Access Denied: You are not authorized to delete post')
    }

    await this.postRepository.remove(oldPost)

    if (oldPost.image) {
      await this.s3Service.deleteFile(oldPost.image).catch(() => {})
    }

    return await this.postMapper.toDto(oldPost)
  }

  async publishPost(userId: number , postId: number){
    const post = await this.postRepository.findOne({
      where: {id: postId},
      relations: ['user']
    })

    if(!post){
      throw new NotFoundException('Post Not Found')
    }

    if(post.user.id !== userId){
      throw new UnauthorizedException('Access Denied: You are not authorized to publish post')
    }

    if(!post.isApproved){
      throw new BadRequestException('You can not publish a post that is not approved by an admin')
    }

    post.isPublished = true

    await this.postRepository.save(post)
  
    return await this.postMapper.toDto(post)
  }

  async findUserPosts(userId: number , page: number , limit: number){
    const user = await this.userRepository.findOne({
      where: {id: userId},
    })

    if(!user){
      throw new NotFoundException('User Not Found')
    }

    const [postPage , total] = await this.postRepository.findAndCount({
      where: {user: user},
      skip: (page - 1) * limit,
      take: limit,
      order:{
        updatedAt: "DESC"
      }
    })

    const postDtos = await Promise.all(postPage.map((post) => this.postMapper.toDto(post)))

    return {
      posts: postDtos,
      total,
      page,
      lastPage: Math.ceil(total / limit)
    }
  }

  async addPhotoToPost(userId:number , postId:number , file: Express.Multer.File){
    const post = await this.postRepository.findOne({
      where: {id: postId},
      relations: ['user']
    })

    if(!post){
      throw new NotFoundException('Post Not Found')
    }

    if(post.user.id !== userId){
      throw new UnauthorizedException('Access Denied: You are not authorized to access post')
    }

    const newFilename = `userId_${userId}/${randomUUID()}` + extname(file.originalname)

    try{
      await this.s3Service.uploadFile(file , newFilename)
    } catch(err: any){
      throw new InternalServerErrorException(err.message)
    }

    if (post.image) {
      await this.s3Service.deleteFile(post.image).catch(() => {})
    }

    post.image = newFilename
    await this.postRepository.save(post)

    return await this.postMapper.toDto(post)
  }

  async approvePost(postId: number){
    const post = await this.postRepository.findOne({
      where: {id: postId},
      relations: ['user']
    })

    if(!post){
      throw new NotFoundException('Post not found')
    }

    if(post.isApproved){
      throw new BadRequestException('Post already approved!')
    }

    post.isApproved = true

    await this.postRepository.save(post)

    this.emailQueue.emit('email_notifications' , {
      recepient: post.user.email,
      username: post.user.username,
      post: post
    })

    return await this.postMapper.toDto(post)
  }

  async testEmailSend(recepient: string){
    await this.mailService.testEmail(recepient)
  }
}
