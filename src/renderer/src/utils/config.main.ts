// import moment from 'moment'
import { listVersion } from './version'

export const VERSION = '2022.02.001'

export const getVersionInfo = (version: string) => {
  if (listVersion && listVersion.length > 0) {
    for (const key in listVersion) {
      const item = listVersion[key]
      if (item.version === version) {
        localStorage.setItem('versionInfo', item.info)
        return item.info
      }
    }
    if (listVersion[0] && listVersion[0].info) {
      localStorage.setItem('versionInfo', listVersion[0].info)
      return listVersion[0].info
    }
  }
  return null
}

export const name = 'www.k3mart.id'
export const version = VERSION
export const versionInfo = () => {
  return localStorage.getItem('versionInfo') ? localStorage.getItem('versionInfo') : null
}
export const prefix = 'smiPos'
export const footerText = 'K3MART'
// export const footerSubText = `K3MART © ${moment().format('YYYY')}`
export const disableMultiSelect = true
export const openPages = ['/', '/kasir', '/logout']
