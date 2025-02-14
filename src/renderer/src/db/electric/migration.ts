import type { PGliteInterface } from '@electric-sql/pglite'
import m1 from '../migration-client/initial-tables-v2-1.sql?raw'
// import m2 from '../migration-client/initial-tables-v2-2.sql?raw'
// import m3 from '../migration-client/initial-tables-v2-3.sql?raw'

// export async function migrate(pg: PGliteInterface) {
//   try {
//     await pg.exec(m1)
//     // await pg.exec(m2)
//     // await pg.exec(m3)
//   } catch (error) {
//     console.log('Error migrate', error)
//   }
// }

export async function migrate(pg: PGliteInterface) {
  try {
    await pg.exec(m1)  // This runs the SQL file
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log("Skipping existing index creation");
    } else {
      console.log("Error migrate", error);
    }
  }
}

