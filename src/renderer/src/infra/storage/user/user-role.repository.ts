import { PGliteInterface, Results } from '@electric-sql/pglite'
import { TblUserRole } from '@renderer/domain/user/entity/user-role.entity'

export class UserRoleRepository {
  private pgConn: PGliteInterface

  constructor(pgConn: PGliteInterface) {
    this.pgConn = pgConn
  }

  async getUserRoleByUserId(userId: string): Promise<TblUserRole | null> {
    const query = `SELECT * FROM tbl_user_role WHERE userid = $1`
    const result: Results<TblUserRole> = await this.pgConn.query(query, [userId])

    if (result?.rows.length === 0) {
      return null
    }

    return result.rows[0]
  }
}
