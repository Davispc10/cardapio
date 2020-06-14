import { createConnection, Connection } from 'typeorm'

import databaseConfig from '../config/database'

class Database {
  constructor () {
    this.conectDB()
  }

  private async conectDB (): Promise<Connection> {
    return await createConnection(databaseConfig)
  }
}

export default new Database()
