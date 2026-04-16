import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserProfile } from "./userProfile.entity";
import { RefreshToken } from "src/refreshToken/refreshToken.entity";
import { Post } from "src/post/post.entity";
import { Role } from "src/auth/role.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({unique: true , nullable: false})
  username!: string

  @Column({unique: true , nullable: false})
  email!: string

  @Column()
  hashedPassword!: string

  @ManyToMany(() => Role , Role => Role.users)
  @JoinTable({name: 'user_roles'})
  roles!: Role[]

  @CreateDateColumn()
  createdAt!: Date

  @OneToOne(() => UserProfile)
  @JoinColumn()
  userProfile!: UserProfile

  @OneToMany(() => RefreshToken , (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[]

  @OneToMany(() => Post , (post) => post.user)
  posts!: Post[]
}