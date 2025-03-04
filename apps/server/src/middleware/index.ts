import Koa from 'koa'
import { ping } from './ping'
import { responseWrap } from './responseWrap'
import bodyParse from './koa-body'
import cors from '@koa/cors'

const middlewares = [ping, responseWrap, bodyParse(), cors()]

export const registerMiddleware = (app: Koa) => {
  middlewares.forEach((m) => app.use(m))
}
