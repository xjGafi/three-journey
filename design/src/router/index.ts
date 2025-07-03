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
  {
    path: '/004',
    name: 'no004',
    callback: lazyLoader('no004'),
  },
  {
    path: '/005',
    name: 'no005',
    callback: lazyLoader('no005'),
  },
  {
    path: '/006',
    name: 'no006',
    callback: lazyLoader('no006'),
  },
  {
    path: '/007',
    name: 'no007',
    callback: lazyLoader('no007'),
  },
  {
    path: '/008',
    name: 'no008',
    callback: lazyLoader('no008'),
  },
  {
    path: '/009',
    name: 'no009',
    callback: lazyLoader('no009'),
  },
  {
    path: '/010',
    name: 'no010',
    callback: lazyLoader('no010'),
  },
  {
    path: '/011',
    name: 'no011',
    callback: lazyLoader('no011'),
  },
  {
    path: '/012',
    name: 'no012',
    callback: lazyLoader('no012'),
  },
]

// 注册路由
export const router = new Router({
  routeConfigs: routes,
})

window.$router = router
