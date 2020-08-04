import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, BaseEntity } from 'typeorm'

import Business from './Business'
import Category from './Category'
import File from './File'

@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  description: string

  @OneToOne(() => File)
  @JoinColumn()
  image: File

  @Column({ nullable: true })
  price: number

  @Column({ nullable: true })
  obs: string

  @ManyToOne(type => Business, business => business.products)
  business: Business

  @ManyToOne(type => Category, category => category.products)
  category: Category

  @Column({ nullable: false })
  valid: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (product: Product) {
    super()
    Object.assign(this, product)
  }
}
