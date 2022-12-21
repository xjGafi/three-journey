import Router from '../plugins/Router'
import { lazyLoader } from '../utils'

const routes = [
  {
    path: '/',
    name: 'home',
    callback: lazyLoader('home'),
  },
  {
    path: '/error',
    name: 'error',
    callback: lazyLoader('error'),
  },
  {
    path: '/001',
    name: 'no001',
    callback: lazyLoader('no001'),
  },
  {
    path: '/002',
    name: 'no002',
    callback: lazyLoader('no002'),
  },
  {
    path: '/003',
    name: 'no003',
    callback: lazyLoader('no003'),
  },
]

// 注册路由
export const router = new Router({
  routeConfigs: routes,
})

window.$router = router
