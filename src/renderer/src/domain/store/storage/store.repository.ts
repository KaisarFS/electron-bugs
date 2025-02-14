import { PGliteInterface, Results } from '@electric-sql/pglite'
import { Store } from '../entity/store.entity'

export class StoreRepository {
  private pgConn: PGliteInterface

  constructor(pgConn: PGliteInterface) {
    this.pgConn = pgConn
  }

  async getStoreByStoreCode(storeCode: string | undefined | null): Promise<Store | null> {
    if (!storeCode) return null

    const query = `SELECT * FROM tbl_store WHERE storecode= $1`
    const result: Results<Store> = await this.pgConn.query(query, [storeCode])

    if (result?.rows.length === 0) {
      return null
    }

    return result.rows[0]
  }
}
