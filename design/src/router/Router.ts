interface Routes {
  [key: string]: any
}

export interface Route {
  name: string
  path: string
  callback: Function
}

interface Options {
  routeConfigs: Array<Route>
}

// 构造函数
class Router {
  routeConfigs: Array<Route>
  currentPath: string
  routes: Routes
  private beforeHandler: Function
  private afterHandler: Function

  constructor(options: Options) {
    this.routeConfigs = options.routeConfigs
    this.currentPath = ''
    this.routes = {} // 保存注册的所有路由

    this.beforeHandler = () => {} // 切换前
    this.afterHandler = () => { } // 切换后

    this.init = this.init.bind(this)
    this.register = this.register.bind(this)
    this.assign = this.assign.bind(this)
    this.replace = this.replace.bind(this)
    this.refresh = this.refresh.bind(this)
    this.beforeEach = this.beforeEach.bind(this)
    this.afterEach = this.afterEach.bind(this)

    this.init()
  }

  init() {
    // 批量注册路由
    this.routeConfigs.forEach((route) => {
      const { path, callback } = route
      this.register(path, callback)
    })

    // 首次加载
    window.addEventListener(
      'load',
      this.assign.bind(this, location.pathname),
      false,
    )

    window.addEventListener(
      'popstate',
      (event: PopStateEvent) => this.refresh.call(this, event.state.path),
      false,
    )
  }

  // 注册每个视图
  register(path: string, callback: Function) {
    if (typeof callback === 'function')
      this.routes[path] = callback

    else
      console.error('🤯 register(): callback is not a function')
  }

  // 跳转到 path
  assign(path: string) {
    history.pushState({ path }, '', path)
    this.refresh(path)
  }

  // 替换为 path
  replace(path: string) {
    history.replaceState({ path }, '', path)
    this.refresh(path)
  }

  // 通用处理 path 调用回调函数
  refresh(path: string) {
    if (this.currentPath === path)
      return

    try {
      // 判断路由是否被注册
      // eslint-disable-next-line no-prototype-builtins
      const hasOwnProperty = this.routes.hasOwnProperty(path)
      if (hasOwnProperty) {
        // 路由的回调函数执行前触发
        this.beforeHandler()

        // 执行路由的回调函数
        this.routes[path].call(this)
        this.currentPath = path

        // 路由的回调函数执行后触发
        this.afterHandler()
      }
      else {
        throw new Error(`${path} is not registered.`)
      }
    }
    catch (error) {
      console.error('🤯 refresh():', error)
      this.assign('/error')
    }
  }

  // path 切换之前
  beforeEach(callback: Function) {
    if (typeof callback === 'function')
      this.beforeHandler = callback

    else
      console.error('🤯 beforeEach(): callback is not a function')
  }

  // path 切换之后
  afterEach(callback: Function) {
    if (typeof callback === 'function')
      this.afterHandler = callback

    else
      console.error('🤯 afterEach(): callback is not a function')
  }
}

export default Router
