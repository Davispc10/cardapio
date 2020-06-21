import bcrypt from 'bcryptjs'
import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, BeforeInsert } from 'typeorm'

import File from './File'

export enum UserRole {
  OWNER = 'O',
  ADMIN = 'A'
}

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: true })
  lastName: string

  @Column({ unique: true, nullable: false })
  username: string

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: false })
  valid: boolean

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OWNER
  })
  role: UserRole

  @OneToOne(() => File)
  @JoinColumn()
  avatar: File

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  hashPassword (): void {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  checkPassword (password: string): boolean {
    return bcrypt.compareSync(password, this.password)
  }

  constructor (user: User) {
    Object.assign(this, user)
  }

  oldPassword: string

  confirmPassword: string
}

export default User