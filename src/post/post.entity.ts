import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post{

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  content!: string

  @Column({default: false})
  isPublished!: boolean

  @Column({default: false})
  isApproved!: boolean

  @Column({unique: false , nullable: true})
  image!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne(() => User , (user) => user.posts)
  user!: User
}