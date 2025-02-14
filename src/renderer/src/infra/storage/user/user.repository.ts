import { PGliteInterface, Results } from '@electric-sql/pglite'
import { TblUser } from '@renderer/domain/user/entity/user.entity'

export class UserRepository {
  private pgConn: PGliteInterface

  constructor(pgConn: PGliteInterface) {
    this.pgConn = pgConn
  }

  /**
   * Retrieves a user by userId.
   */
  public async getUserByUserId(userId: string): Promise<TblUser | null> {
    try {
      const query = `SELECT * FROM tbl_user WHERE userid = $1`
      const result: Results<TblUser> = await this.pgConn.query(query, [userId])

      if (!result || result.rows.length === 0) {
        return null
      }

      return result.rows[0]
    } catch (error) {
      console.error(`Error fetching user with userId: ${userId}`, error)
      throw new Error('Failed to retrieve user data')
    }
  }
}
