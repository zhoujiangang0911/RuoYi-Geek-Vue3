import { getConfigKey } from '@/api/system/config'

export default {
  /**
   * 网页标题
   */
  title: import.meta.env.VITE_APP_TITLE,
  /**
   * 主题颜色
   */
  theme: await getConfigKey("sys.index.theme").then(res => res.msg),
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: await getConfigKey("sys.index.sideTheme").then(res => res.msg),
  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示顶部导航
   */
  topNav: await getConfigKey("sys.index.topNav").then(res => res.msg === 'true'),

  /**
   * 是否显示 tagsView
   */
  tagsView: await getConfigKey("sys.index.tagsView").then(res => res.msg === 'true'),

  /**
   * 是否固定头部
   */
  fixedHeader: await getConfigKey("sys.index.fixedHeader").then(res => res.msg === 'true'),

  /**
   * 是否显示logo
   */
  sidebarLogo: await getConfigKey("sys.index.sidebarLogo").then(res => res.msg === 'true'),

  /**	
   * 是否显示动态标题
   */
  dynamicTitle: await getConfigKey("sys.index.dynamicTitle").then(res => res.msg === 'true'),

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
