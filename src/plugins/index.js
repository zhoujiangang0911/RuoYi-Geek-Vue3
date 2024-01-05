import Tab from './tab'
import Auth from './auth'
import Cache from './cache'
import Modal from './modal'
import Download from './download'
import Socket from './socket'

export const tab = Tab;
export const auth = Auth;
export const modal = Modal;
export const download = Download
export const cache = Cache
export const socket = Socket
export default function installPlugins(app){
  // 页签操作
  app.config.globalProperties.$tab = tab
  // 认证对象
  app.config.globalProperties.$auth = auth
  // 缓存对象
  app.config.globalProperties.$cache = Cache
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 下载文件
  app.config.globalProperties.$download = download
}
