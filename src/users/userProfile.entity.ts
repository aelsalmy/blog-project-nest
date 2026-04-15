import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  profession!: string

  @Column()
  city!: string

  @Column()
  country!: string

  @OneToOne(() => User, user => user.userProfile)
  user!: User;
}