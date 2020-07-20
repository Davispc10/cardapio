import { CreateDateColumn, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

import Business from './Business'
import Product from './Product'

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  description: string

  @ManyToOne(type => Business, business => business.categories)
  business: Business

  @OneToMany(type => Product, product => product.category)
  products: Product[]

  @Column({ nullable: false })
  valid: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (category: Category) {
    Object.assign(this, category)
  }
}
