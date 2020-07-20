import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import Address from './Address'
import Category from './Category'
import File from './File'
import Product from './Product'
import Segment from './Segment'

@Entity()
export default class Business {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: true })
  description: string

  @OneToOne(() => File)
  @JoinColumn()
  image: File

  @OneToOne(() => File)
  @JoinColumn()
  logo: File

  @Column({ nullable: true })
  payment: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  whatsapp: string

  @ManyToOne(type => Segment, segment => segment.businesses)
  segment: Segment

  @OneToMany(type => Address, address => address.business)
  adresses: Address[]

  @OneToMany(type => Category, category => category.business)
  categories: Category[]

  @OneToMany(type => Product, product => product.business)
  products: Product[]

  @Column()
  valid: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (business: Business) {
    Object.assign(this, business)
  }
}
