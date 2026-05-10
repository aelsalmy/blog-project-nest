import { Controller, Get, HttpStatus, Param, Query, Post, Res, UseGuards, Req, Body, Put, Delete, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { PostService } from './post.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { AuthRequest } from 'src/auth/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/enumns/roles.enum';
import { memoryStorage, MulterError } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('posts')
export class PostController {

  constructor(private readonly postService: PostService){}

  @Get()
  async getAllPosts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() resp: Response
  ){
    const posts = await this.postService.getAllPosts(Number(page) , Number(limit))

    resp.status(HttpStatus.OK).json(posts)
  }

  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Req() req: AuthRequest , @Body() body: CreatePostDto , @Res() resp: Response){
    const {content} = body
    const userId = req.userId

    const newPost = await this.postService.createPost(userId , content)  

    resp.status(HttpStatus.CREATED).json(newPost)
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updatePost(
    @Req() req: AuthRequest , 
    @Body() body: CreatePostDto , 
    @Res() resp: Response,
    @Param('id') postId: string
  ){
    const {content} = body
    const userId = req.userId
    
    const updatedPost = await this.postService.updatePost(userId , Number(postId) , content)

    resp.status(HttpStatus.OK).json(updatedPost)
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deletePost(
    @Req() req: AuthRequest , 
    @Res() resp: Response,
    @Param('id') postId: string
  ){
    const userId = req.userId
    
    const deletedPost = await this.postService.deletePost(userId , Number(postId))

    resp.status(HttpStatus.OK).json(deletedPost)
  }

  @UseGuards(AuthGuard)
  @Post('/:id')
  async publishPost(
    @Req() req: AuthRequest , 
    @Res() resp: Response,
    @Param('id') postId: string
  ){
    const userId = req.userId
    
    const publishedPost = await this.postService.publishPost(userId , Number(postId))

    resp.status(HttpStatus.OK).json(publishedPost)
  }

  @UseGuards(AuthGuard)
  @Get('/user/myPosts')
  async getUserPosts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: AuthRequest , 
    @Res() resp: Response
  ){
    const userId = req.userId
    
    const userPosts = await this.postService.findUserPosts(userId , Number(page) , Number(limit))

    resp.status(HttpStatus.OK).json(userPosts)
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', { 
      storage: memoryStorage(), 
      limits: { fileSize: 5 * 1024 * 1024 } ,
      fileFilter: ( _ , file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new MulterError('LIMIT_UNEXPECTED_FILE'), false)
        }
        cb(null, true)
      }
    }))
    
  @Post(':id/image')
  async uploadImage(
    @Req() req: AuthRequest , 
    @Res() resp: Response,
    @Param('id') postId: string
  ){
    const userId = req.userId
    const file = req.file

    if (!file) return resp.status(HttpStatus.BAD_REQUEST).json({ message: 'No file provided' })

    const newPost = await this.postService.addPhotoToPost(userId , Number(postId) , file!)

    resp.status(HttpStatus.OK).json(newPost)
  }

  @UseGuards(AuthGuard , RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/test')
  testAdmin(@Res() resp: Response){
    this.postService.testEmailSend('test@email.com')

    resp.status(HttpStatus.OK).json({message: 'done'})
  }

  @UseGuards(AuthGuard , RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/approve/:id')
  async approvePost(
    @Res() resp: Response,
    @Param('id') postId: string
  ){
    const approvedPost = await this.postService.approvePost(Number(postId))

    resp.status(HttpStatus.OK).json(approvedPost)
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string , @Res() resp: Response){
    const post = await this.postService.getPostById(Number(id))
    
    resp.status(HttpStatus.OK).json(post) 
  }
}