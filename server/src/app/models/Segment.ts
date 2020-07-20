import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

import Business from './Business'

@Entity()
export default class Segment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  description: string

  @OneToMany(type => Business, business => business.segment)
  businesses: Business[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (segment: Segment) {
    Object.assign(this, segment)
  }
}
