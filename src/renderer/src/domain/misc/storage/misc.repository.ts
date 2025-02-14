import { PGliteInterface, Results } from '@electric-sql/pglite'
import { Misc } from '../entity/misc.entity'

export class MiscRepository {
  private pgConn: PGliteInterface

  constructor(pgConn: PGliteInterface) {
    this.pgConn = pgConn
  }

  async getMiscUserRoleByMiscName(miscCode: string | undefined | null): Promise<Misc | null> {
    if (!miscCode) return null

    const query = `SELECT * FROM tbl_misc WHERE misccode =  'USERROLE' and miscname = $1`
    const result: Results<Misc> = await this.pgConn.query(query, [miscCode])

    if (result?.rows.length === 0) {
      return null
    }

    return result.rows[0]
  }
}
