import { CreateDateColumn, UpdateDateColumn, Column, Entity, AfterLoad, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export default class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  path: string

  url: string

  @AfterLoad()
  getUrl (): void {
    this.url = `${process.env.APP_URL}/files/${this.path}`
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor (file: File) {
    super()
    Object.assign(this, file)
  }
}
