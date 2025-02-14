/* eslint-disable @typescript-eslint/no-explicit-any */
export const saveToPouchDB = async (db: any, payload: any): Promise<void> => {
  try {
    const doc = {
      _id: new Date().toISOString(),
      ...payload
    }
    const response = await db.put(doc)

    console.log('Data berhasil disimpan:', response)
  } catch (error) {
    console.error('Gagal menyimpan data:', error)
    throw error
  }
}

export const syncWithCouchDB = (db: any, remoteDB: any): void => {
  db.sync(remoteDB, {
    live: true,
    retry: true
  })
    .on('change', (change) => {
      console.log('Sinkronisasi berhasil:', change)
    })
    .on('error', (error) => {
      console.error('Sinkronisasi gagal:', error)
    })
}
