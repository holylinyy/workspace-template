import type { Context } from 'koa'

export const ping = async function (ctx: Context, next) {
  if (/__ping__\/?$/.test(ctx.url)) {
    ctx.body = 'ok'
  } else {
    await next()
  }
}
