import { Context, Next } from 'koa'

export const responseWrap = async function (ctx: Context, next: Next) {
  await next()
  const body: any = ctx.body
  if (!body?.code || ctx.status !== 200) return
  const code: number = body.code
  if (code.toString().startsWith('400')) {
    ctx.status = 400
  }
  if (code.toString().startsWith('500')) {
    ctx.status = 500
  }
}
