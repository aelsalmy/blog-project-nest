import { S3Service } from "src/image-upload/s3.service";
import { PostDto } from "./dto/post.dto";
import { Post } from "./post.entity";
import { Injectable } from "@nestjs/common";
import { UserMapper } from "src/users/user.mapper";

@Injectable()
export class PostMapper {

  constructor(
    private readonly s3Service: S3Service,
    private readonly userMapper: UserMapper
  ){}

  async toDto(post: Post){
    const dto = new PostDto()

    dto.id = post.id
    dto.content = post.content
    dto.isPublished = post.isPublished
    dto.userId = post.user.id
    dto.isApproved = post.isApproved
    dto.user = this.userMapper.toUserDto(post.user)

    dto.image = post.image ? (await this.s3Service.getSignedUrl(post.image)).url : null

    return dto
  }
}