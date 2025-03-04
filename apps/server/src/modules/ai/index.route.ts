import Router from '@koa/router'
import { fetchAi } from './index.controller'

const router = new Router({
  prefix: '/ai',
})

router.post('/test', fetchAi)

export default router
