import { PGlite, PGliteInterface } from '@electric-sql/pglite'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { live } from '@electric-sql/pglite/live'
import { electricSync } from '@electric-sql/pglite-sync'

const pgConn = async (): Promise<PGliteInterface> => {
  const dataDir = import.meta.env.VITE_INDEX_DB_DATA_DIR as string
  console.log('NODE_ENV', process.env.NODE_ENV)

  const electric = electricSync({
    debug: process.env.NODE_ENV !== 'production'
  })

  const db = await PGlite.create(dataDir, {
    extensions: {
      live,
      electric
    }
  })

  return db
}

export default pgConn
