import { ServerErrorCode, ClientErrorCode } from './constants'

export type Resp = ReturnType<typeof createResp<string>>
export type I18nErrorRespType = Resp | undefined

export const createResp = <T = any>(body: T, code = 0, message = '') => {
  if (code && !message) {
    throw new Error('code 不为0时, message必须有值')
  }
  return {
    code,
    result: body,
    message,
  }
}
export const createSuccessResp = () => {
  return createResp('ok')
}

export const createClientError = (message: string, code: ClientErrorCode) => {
  if (code < 4000001 || code >= 5000000) {
    throw new Error(`createClientError: ${code} - 不符合预期`)
  }
  return createResp('', code, message)
}

export const createServerError = (message: string, code: ServerErrorCode) => {
  if (code < 5000001 || code >= 6000000) {
    throw new Error(`createServerError: ${code} - 不符合预期`)
  }
  return createResp('', code, message)
}
