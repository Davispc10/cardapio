import { createConnection, Connection } from 'typeorm'

// import databaseConfig from '@config/database'

import databaseConfig from '@config/database'

class PostgresMock {
  private database: Connection

  async connect (): Promise<void> {
    this.database = await createConnection(databaseConfig)
  }

  async disconect (): Promise<void> {
    return await this.database.close()
  }
}

export default new PostgresMock()
