import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({unique:true , nullable: false})
  hashedToken!: string

  @CreateDateColumn()
  createdAt!: Date

  @Column()
  expiresAt!: Date

  @Column({default: false})
  isRevoked!: boolean

  @ManyToOne(() => User , (user) => user.refreshTokens)
  user!: User
}