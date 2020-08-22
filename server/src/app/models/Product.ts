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

  @ManyToOne(() => Business, business => business.products)
  business: Business

  @ManyToOne(() => Category, category => category.products)
  category: Category

  @Column({ nullable: false })
  valid: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (props: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    super()
    Object.assign(this, props)
  }
}
