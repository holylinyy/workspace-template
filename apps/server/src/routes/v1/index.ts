import Router from '@koa/router'
import aiRoute from '@/modules/ai/index.route'
const router = new Router({
  prefix: '/api/v1',
})

const list: any[] = [aiRoute]
list.forEach((item) => {
  router.use(item.routes())
})

export default router
