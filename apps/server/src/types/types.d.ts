import * as _Koa from 'koa'

declare module 'koa' {
  interface Request {
    body?: any
    rawBody: string
  }
}
