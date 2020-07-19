import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Segment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  description: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (description: string) {
    this.description = description
  }
}
