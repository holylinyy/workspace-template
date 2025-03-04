import Koa from 'koa'
import './utils/dayjs'
import { useRotute } from './routes'
import { registerMiddleware } from './middleware'
import { handleGlobalError } from './handleGlobalError'
// import { init } from '@/core'
// import { schedule } from './schedule'
/**
 * 全局错误
 */
const start = async () => {
  const app = new Koa()
  registerMiddleware(app)
  handleGlobalError(app)
  // await init()
  useRotute(app)
  app.listen(3000)
  // schedule()
  console.log('server started at localhost:3000')
}

start()
