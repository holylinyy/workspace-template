import Koa from 'koa'
import v1 from './v1'

export const useRotute = (app: Koa) => {
  app.use(v1.routes())
}
