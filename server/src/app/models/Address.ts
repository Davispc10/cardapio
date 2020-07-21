import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

import Business from './Business'

@Entity()
export default class Address {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  street: string

  @Column({ nullable: false })
  city: string

  @Column({ nullable: false })
  state: string

  @Column({ nullable: false })
  postalCode: string

  @Column({ nullable: false })
  locality: string

  @Column({ nullable: true })
  number: string

  @ManyToOne(type => Business, business => business.addresses)
  business: Business

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (street: string, city: string, state: string, postalCode: string, locality: string, number: string) {
    this.street = street
    this.city = city
    this.state = state
    this.postalCode = postalCode
    this.locality = locality
    this.number = number
  }
}
