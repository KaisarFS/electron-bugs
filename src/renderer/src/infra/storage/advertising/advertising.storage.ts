import { PGliteInterface, Results } from '@electric-sql/pglite'
import { TblAdvertising } from '@renderer/domain/advertising/entity/advertising.entity'

export class AdvertisingStorage {
  private pgConn: PGliteInterface

  constructor(pgConn: PGliteInterface) {
    this.pgConn = pgConn
  }

  public async getAdvertisingId(id: string): Promise<TblAdvertising | null> {
    try {
      const query = `SELECT * FROM tbl_advertising WHERE id = $1`
      const result: Results<TblAdvertising> = await this.pgConn.query(query, [id])

      if (!result || result.rows.length === 0) {
        return null
      }

      return result.rows[0]
    } catch (error) {
      console.error(`Error fetching user with id: ${id}`, error)
      throw new Error('Failed to retrieve tbl_advertising data')
    }
  }
}
