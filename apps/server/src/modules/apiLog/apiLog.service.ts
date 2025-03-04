import { logsDir } from '@/constants'
import dayjs from 'dayjs'
import fs from 'fs-extra'
import axios from 'axios'
import { groupBy } from 'lodash'

export const checkIfNeedWarn = async (opts: {
  min: number
  timestamp: number
}) => {
  const { min, timestamp } = opts
  check500Error(min)
  checkIfCustomDomainError(min, timestamp)
}

const getLogList = async (min: number): Promise<any[]> => {
  const date = dayjs.tz().format('YYYY-MM-DD')
  const hour = dayjs.tz().format('HH')
  const dir = `${logsDir}/${date}/${hour}`

  const startOfMinute =
    dayjs.tz().startOf('hour').add(min, 'minute').unix() * 1000
  const filepath = `${dir}/${min}-${startOfMinute}.json`

  const isExists = await fs.exists(filepath)
  if (!isExists) return []
  const {
    data: { list = [] },
  } = JSON.parse(await fs.readFile(filepath, 'utf8'))
  const result = list
    .map((item) => {
      const obj = item.content.reduce((acc, cur) => {
        acc[cur.Key] = cur.Value
        return acc
      }, {})
      if (obj.namespace !== 'apiRequestLog') return
      const res = JSON.parse(obj.message)
      res.__parentNode = item
      return res
    })
    .filter((e) => Boolean(e))
  return result
}

const check500Error = async (min: number) => {
  const res = await getLogList(min)
  if (!res.some((e) => e?.responseStatus === 500)) return
  const e = res.find((e) => e.responseStatus === 500)
  const content = [
    '## 企业自定义域名告警',
    '环境: 企业管理后台-production',
    '报警内容：接口报500',
    `接口信息：${e.url}`,
    `页面信息：${e.currentPageUrl}`,
    `是否自定义域名企业: ${e.customDomain ? '是' : '否'}`,
    `requestId: ${e?.headers?.requestId}`,
    `response: ${JSON.stringify(e?.responseData)}`,
    `发生时间：${dayjs.tz(e.__parentNode.appear_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`,
    '备注：<at email="yuanhaolin@wps.cn"></at>',
  ].join('\n\n')
  sentMsg(content)
}

const checkIfCustomDomainError = async (min: number, timestamp: number) => {
  const regexpArr = [
    '/cmgr/v1/adm/companies/\\d+/group/login-configs/batch',
  ].map((s) => new RegExp(s))
  const res = (await getLogList(min))
    .filter((e) => {
      return !regexpArr.some((reg) => reg.test(e.url))
    })
    .filter((e) => e.customDomain)
  console.log(3333, res)
  if (!res.length) return
  const statusMap = groupBy(res, 'responseStatus')
  const text = Object.keys(statusMap).map(
    (key) => `响应状态-${key}: ${statusMap[key].length}`,
  )
  const content = [
    '## 企业自定义域名告警',
    '环境: 企业管理后台-production',
    ...text,
    `发生时间：${dayjs.tz(timestamp).format('YYYY-MM-DD HH:mm')}`,
  ].join('\n\n')
  sentMsg(content)
}

const sentMsg = async (content: string) => {
  return axios.post(
    'https://xz.wps.cn/api/v1/webhook/send?key=1b354eeafe8d6eea4bc38208c242ea4e',
    {
      msgtype: 'markdown',
      markdown: {
        text: content,
      },
    },
  )
}
