import { createConnection, Connection, getConnection } from 'typeorm'

import databaseConfig from '@config/database'
import Address from '@models/Address'
import Business from '@models/Business'
import Category from '@models/Category'
import File from '@models/File'
import Product from '@models/Product'
import Segment from '@models/Segment'
import User from '@models/User'

class PostgresMock {
  private database: Connection

  async connect (): Promise<void> {
    this.database = await createConnection(databaseConfig)
  }

  async disconect (): Promise<void> {
    return await this.database.close()
  }

  async clearDatabase (): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .execute()
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Address)
      .execute()
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Category)
      .execute()
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Business)
      .execute()
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Segment)
      .execute()
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(File)
      .execute()
    // await getConnection()
    //   .createQueryBuilder()
    //   .delete()
    //   .from(Product)
    //   .execute()
  }
}

export default new PostgresMock()
