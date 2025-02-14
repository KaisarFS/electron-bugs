import { PGliteInterface, Results, Row } from '@electric-sql/pglite'

export const executeQuery = async <T>(
  pgConn: PGliteInterface,
  q: string,
  parameters?: (string | number)[]
): Promise<Row<T[]>> => {
  const results: Results<T> = await pgConn.query<T>(q, parameters)
  return results?.rows || []
}
