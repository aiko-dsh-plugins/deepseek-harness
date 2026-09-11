/** Minimal marker that selects the desktop custom-protocol API carrier. */

import { contextBridge, ipcRenderer } from 'electron'
import { DESKTOP_IPC, type DshDesktopMarketApi } from './ipc.ts'

const market: DshDesktopMarketApi = {
  protocolVersion: 1,
  list: () => ipcRenderer.invoke(DESKTOP_IPC.marketList) as ReturnType<DshDesktopMarketApi['list']>,
  request: request => ipcRenderer.invoke(DESKTOP_IPC.marketRequest, request) as ReturnType<DshDesktopMarketApi['request']>,
}

contextBridge.exposeInMainWorld('dshDesktop', { protocolVersion: 1, market })
