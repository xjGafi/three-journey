import Router from '../plugins/Router'
import { lazyLoader } from '../utils'

export const pages = [
  { path: '/', name: 'home' },
  { path: '/001', name: 'no001' },
  { path: '/002', name: 'no002' },
  { path: '/003', name: 'no003' },
  { path: '/004', name: 'no004' },
  { path: '/005', name: 'no005' },
  { path: '/006', name: 'no006' },
  { path: '/007', name: 'no007' },
  { path: '/008', name: 'no008' },
  { path: '/009', name: 'no009' },
  { path: '/010', name: 'no010' },
  { path: '/011', name: 'no011' },
  { path: '/012', name: 'no012' },
  { path: '/013', name: 'no013' },
  { path: '/014', name: 'no014' },
  { path: '/015', name: 'no015' },
  { path: '/016', name: 'no016' },
  { path: '/017', name: 'no017' },
  { path: '/018', name: 'no018' },
  { path: '/019', name: 'no019' },
  { path: '/020', name: 'no020' },
  { path: '/021', name: 'no021' },
  { path: '/022', name: 'no022' },
  { path: '/023', name: 'no023' },
  { path: '/024', name: 'no024' },
  { path: '/025', name: 'no025' },
  { path: '/026', name: 'no026' },
  { path: '/027', name: 'no027' },
  { path: '/028', name: 'no028' },
  { path: '/029', name: 'no029' },
  { path: '/030', name: 'no030' },
  { path: '/031', name: 'no031' },
  { path: '/032', name: 'no032' },
  { path: '/033', name: 'no033' },
  { path: '/034', name: 'no034' },
  { path: '/035', name: 'no035' },
  { path: '/036', name: 'no036' },
  { path: '/037', name: 'no037' },
  { path: '/038', name: 'no038' },
  { path: '/039', name: 'no039' },
  { path: '/040', name: 'no040' },
  { path: '/041', name: 'no041' },
  { path: '/042', name: 'no042' },
  { path: '/043', name: 'no043' },
  { path: '/044', name: 'no044' },
  { path: '/045', name: 'no045' },
]

const routes = pages.map(page => ({
  ...page,
  callback: lazyLoader(page.name),
}))

// 注册路由
export const router = new Router({
  routeConfigs: routes,
})

window.$router = router
