import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/user.entity';
import { UserMapper } from 'src/users/user.mapper';
import { PostMapper } from './post.mapper';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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
      throw new NotFoundException('Access Denied: You are not authorized to delete post')
    }

    if(post.user.id !== userId){
      throw new UnauthorizedException('')
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
}
