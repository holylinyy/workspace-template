import type { RouterContext } from '@koa/router'
import { to } from '../../utils'
import { createServerError, createResp } from '../../createResponse'
import { requestService } from './index.service'
import { ServerErrorCode } from '@/constants'

export const fetchAi = async (ctx: RouterContext) => {
  const { message } = ctx.request.body
  const [err, result] = await to(requestService(message))
  if (err) {
    const msg = (err as any)?.response?.data?.msg || err.message
    ctx.body = createServerError(msg, ServerErrorCode.UnknownError)
    return
  }
  console.log(123, result)
  ctx.body = createResp(result)
}
