import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/user.entity';
import { PostMapper } from './post.mapper';
import{ promises as fs } from 'fs';
import { MailService } from 'src/mailing/mail.service';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    @Inject('RABBITMQ_SERVICE') private readonly emailQueue: ClientProxy
  ){}

  async getAllPosts(page: number , limit: number){
    const [postPage , total] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user']
    })

    const postDtos = postPage.map((post) => PostMapper.toDto(post))

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

    return PostMapper.toDto(post)
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

    return PostMapper.toDto(newPost)
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
  
    return PostMapper.toDto(oldPost)
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

    return PostMapper.toDto(oldPost)
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
      throw new UnauthorizedException('Access Denied: You are not authorized to delete post')
    }

    if(!post.isApproved){
      throw new BadRequestException('You can not publish a post that is not approved by an admin')
    }

    post.isPublished = true

    await this.postRepository.save(post)
  
    return PostMapper.toDto(post)
  }

  async findUserPosts(userId: number){
    const user = await this.userRepository.findOne({
      where: {id: userId},
      relations: ['posts' , 'posts.user']
    })

    if(!user){
      throw new NotFoundException('User Not Found')
    }

    const userPostsDto = user.posts.map((post) => PostMapper.toDto(post))

    return userPostsDto
  }

  async addPhotoToPost(userId:number , postId:number , filepath: string){
    const post = await this.postRepository.findOne({
      where: {id: postId},
      relations: ['user']
    })

    if(!post){
      throw new NotFoundException('Post Not Found')
    }

    if(post.user.id !== userId){
      throw new UnauthorizedException('Access Denied: You are not authorized to delete post')
    }

    if(post.image){
      try{
        const filename = `./uploads/userId_${userId}/${post.image}`
        console.log(post.image)
        await fs.unlink(filename)
      } catch(err: any){
        throw new InternalServerErrorException(err.message)
      }
    }

    post.image = filepath

    await this.postRepository.save(post)

    return PostMapper.toDto(post)
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

    //await this.mailService.sendApprovalNotification(post.user.email , post.user.username , post)

    this.emailQueue.emit('email_notifications' , {
      recepient: post.user.email,
      username: post.user.username,
      post: post
    })

    return PostMapper.toDto(post)
  }

  async testEmailSend(recepient: string){
    await this.mailService.testEmail(recepient)
  }
}
