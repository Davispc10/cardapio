import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, BaseEntity } from 'typeorm'

import Address from './Address'
import Category from './Category'
import File from './File'
import Product from './Product'
import Segment from './Segment'

@Entity()
export default class Business extends BaseEntity {
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

  @ManyToOne(() => Segment, segment => segment.businesses)
  segment: Segment

  @OneToMany(() => Address, address => address.business, {
    cascade: true
  })
  addresses: Address[]

  @OneToMany(() => Category, category => category.business, {
    cascade: true
  })
  categories: Category[]

  @OneToMany(() => Product, product => product.business, {
    cascade: true
  })
  products: Product[]

  @Column()
  valid: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (props: Omit<Business, 'id' | 'products' | 'categories' | 'addresses' | 'image' |'createdAt' | 'updatedAt'>) {
    super()
    Object.assign(this, props)
  }
}
