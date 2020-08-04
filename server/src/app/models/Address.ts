import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm'

import Business from './Business'

@Entity()
export default class Address extends BaseEntity {
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

  constructor (address: Address) {
    super()
    Object.assign(this, address)
  }
}
