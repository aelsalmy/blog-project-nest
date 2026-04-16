import { PostDto } from "./dto/post.dto";
import { Post } from "./post.entity";

export class PostMapper {
  static toDto(post: Post){
    const dto = new PostDto()

    dto.content = post.content
    dto.isPublished = post.isPublished
    dto.userId = post.user.id
    dto.image = post.image
    dto.isApproved = post.isApproved

    return dto
  }
}