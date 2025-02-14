import { MembersTypes } from '@renderer/presentation/entity/membersTypes.entiy'
import localStorage from './localStorage'

const getDistPriceName = (fromStock: string): string => {
  const listPrice: MembersTypes[] = localStorage.getMemberTypes()
  const selectedDist = listPrice.filter((filtered) => filtered.sellPrice === fromStock)

  if (selectedDist && selectedDist[0]) {
    return `${selectedDist[0].typeName}`
  }

  return fromStock
}

export { getDistPriceName }
