import { UserDto } from "./dtos/user-dto";
import { User } from "./user.entity";

export class UserMapper {
  toUserDto(user: User){
    const dto: UserDto = new UserDto()
    dto.email = user.email
    dto.username = user.username
    dto.profile = user.userProfile

    return dto
  }
}