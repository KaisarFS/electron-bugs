import { Mutex, PGliteInterface } from '@electric-sql/pglite'
import { TableSyncConfig } from '../../config/table-sync.config'
import { SyncShapeToTableOptions } from '@electric-sql/pglite-sync'

const electricSyncUrl = import.meta.env.VITE_ELECTRIC_URL

type SyncStatus = 'initial-sync' | 'done'

export async function startSync(pg: PGliteInterface) {
  try {
    /**
     * Sync remote DB to local DB
     */
    await startSyncToDatabase(pg)
  } catch (error) {
    console.log('Error sync database: ', error)
  }
}

async function startSyncToDatabase(pg: PGliteInterface) {
  const syncStatusByTable: Record<string, boolean> = {}

  const tableNames = TableSyncConfig.REMOTE_DB_TABLE_SYNC

  const mutex = new Mutex()

  for (const tableName of tableNames) {
    await mutex.runExclusive(async () => {
      try {
        const syncOptions: SyncShapeToTableOptions = {
          shape: {
            url: electricSyncUrl,
            params: {
              table: tableName
            },
            onError: (error) => {
              console.error(`${tableName} shape error`, error)
            }
          },
          table: tableName,
          primaryKey: ['id'],
          shapeKey: tableName,
          // pertimbangan spec saat ini, dengan 250 row sekali commit
          commitGranularity: 250,
          // commitGranularity: 'up-to-date',
          commitThrottle: 1000,
          onInitialSync: async () => {
            syncStatusByTable[tableName] = true
            // await doPostInitialSync()
          }
        }

        const remoteToLocalSync = await pg.electric.syncShapeToTable(syncOptions)

        remoteToLocalSync.subscribe(
          () => {
            // if (!hasUserAtStart && !postInitialSyncDone) {
            updateSyncStatus('initial-sync', `Inserting ${tableName}...`, tableName)
            // }
          },
          (error) => {
            console.error(`${tableName} sync error`, error)
          }
        )
      } catch (error) {
        console.error(error)
        throw error
      }
    })
  }

  if (Object.values(syncStatusByTable).every((status) => status)) {
    updateSyncStatus('done', 'All tables synced successfully')
  }

  updateSyncStatus('done')
}

export function updateSyncStatus(newStatus: SyncStatus, message?: string, tableName?: string) {
  const currentStatus = JSON.parse(localStorage.getItem('syncStatus') || '{}') as Record<
    string,
    [SyncStatus, string?]
  >

  if (tableName) {
    currentStatus[tableName] = [newStatus, message]
  } else {
    currentStatus['global'] = [newStatus, message]
  }

  localStorage.setItem('syncStatus', JSON.stringify(currentStatus))

  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'syncStatus',
      newValue: JSON.stringify(currentStatus)
    })
  )
}
