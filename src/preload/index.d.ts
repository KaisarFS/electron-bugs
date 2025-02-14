import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  send: <T>(channel: string, data: T) => void
  receive: <T>(channel: string, func: (data: T) => void) => void
  removeListener: <T>(channel: string, func: (data: T) => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
