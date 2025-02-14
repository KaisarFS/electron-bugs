/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import PouchDB from 'pouchdb'

// PouchDB.plugin(require('pouchdb-find'))
// PouchDB.plugin(require('pouchdb-quick-search'))

const instancePool = {}
const instanceRemotePool = {}

const couchDBConfig = {
  host: import.meta.env.COUCHDB_HOST,
  port: import.meta.env.COUCHDB_PORT,
  user: import.meta.env.COUCHDB_USER,
  pswd: import.meta.env.COUCHDB_PSWD
}

export const getConnection = (name: string) => {
  if (!instancePool[name] || instancePool[name] === undefined) {
    instancePool[name] = new PouchDB(name, { auto_compaction: true })
  }

  return instancePool[name]
}

export const getRemoteConnection = (name: string) => {
  if (!instanceRemotePool[name] || instanceRemotePool[name] === undefined) {
    const couchDbUri = `http://${couchDBConfig.user}:${couchDBConfig.pswd}@${couchDBConfig.host}:${couchDBConfig.port}/${name}`
    console.log('couchDbUri: ', couchDbUri)
    // todo: move secrets to env
    instanceRemotePool[name] = new PouchDB(couchDbUri, {
      auto_compaction: true
    })
  }

  return instanceRemotePool[name]
}
