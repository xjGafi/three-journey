import home from '../views/home'
import error from '../views/error'
import no001 from '../views/no001'
import no002 from '../views/no002'
import Router from './Router'

const routes = [
  {
    path: '/',
    name: 'home',
    callback: home,
  },
  {
    path: '/error',
    name: 'error',
    callback: error,
  },
  {
    path: '/001',
    name: 'no001',
    callback: no001,
  },
  {
    path: '/002',
    name: 'no002',
    callback: no002,
  },
]

// 注册路由
export const router = new Router({
  routeConfigs: routes,
})

window.$router = router
