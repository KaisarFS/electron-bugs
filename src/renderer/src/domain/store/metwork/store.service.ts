import pgConn from '@renderer/lib/pglite/pglite-connection'
import { Store } from '../entity/store.entity'
import { StoreRepository } from '../storage/store.repository'

export class StoreService {
  public async getStoreByStoreCode(storeCode: string): Promise<Store | null> {
    const pg = await pgConn()
    const storeRepository = new StoreRepository(pg)
    const misc = await storeRepository.getStoreByStoreCode(storeCode)
    return misc
  }
}
