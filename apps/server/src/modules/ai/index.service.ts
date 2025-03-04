import { to, getSystemPrompt } from '@ai/utils'
import axios from 'axios'

const MAX_TOKENS = 2048
type Message = { role: 'user' | 'system' | 'assistant'; content: string }
const tools = {
  searchUid: {
    description: '用于执行数学计算，例如加法、乘法、平方根等。',
    params: [{ name: 'input', type: 'string', description: '' }],
    call: ({ input }) => {
      return eval(input)
    },
  },
  weather: {
    description:
      '用于查询指定城市的当前天气。参数：[{name: "city", type: "string", description: "城市名称"}]',
    params: [{ name: 'city', type: 'string', description: '城市名称' }],
    call: async ({ city }) => {
      // 模拟天气 API 调用
      const weatherData = {
        北京: '晴天，气温 15°C',
        三亚: '多云，气温 28°C',
      }
      return weatherData[city] || '未知城市'
    },
  },
}

async function callTool(action, actionInput) {
  const toolName = action
  if (!tools[toolName]) {
    throw new Error(`未知的工具：${toolName}`)
  }
  return await tools[toolName].call(actionInput)
}

function parseModelResponse(response) {
  const lines = response.split('\n')
  const result: any = {}

  lines.forEach((_line) => {
    const line = _line.trim().replace('：', ':')
    if (line.startsWith('action:')) {
      result.action = line.replace('action:', '').trim()
    } else if (line.startsWith('action_input:')) {
      result.actionInput = JSON.parse(line.replace('action_input:', '').trim())
    }
  })
  return result
}

function extractFinalAnswer(response) {
  const lines = response.split('\n')
  let finalAnswer = ''

  lines.forEach((_line) => {
    const line = _line.trim().replace('：', ':')
    if (line.startsWith('final_answer:')) {
      finalAnswer = line.replace('final_answer:', '').trim()
    }
  })

  return finalAnswer
}

// 解析并调用工具
async function processModelResponse(response) {
  const parsed = parseModelResponse(response)
  if (parsed.action && parsed.actionInput) {
    const observation = await callTool(parsed.action, parsed.actionInput)
    return {
      message: `observation：${JSON.stringify(observation)}`,
    }
  }
  const finalAnswer = extractFinalAnswer(response)
  if (finalAnswer) {
    return {
      message: '',
      final_answer: finalAnswer,
    }
  }
  return {
    message: '',
  }
}

const withKSOToken = async (messages) => {
  const url = 'http://aigc-gateway-test.ksord.com/api/v2/llm/chat'

  const body = {
    stream: false,
    provider: 'azure',
    model: 'gpt-35-turbo',
    version: '0125',
    base_llm_arguments: {
      max_tokens: MAX_TOKENS,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
    messages,
  }

  const result = await axios.post(url, body, {
    headers: {
      'AI-Gateway-Uid': '9040',
      'AI-Gateway-Product-Name': 'saas_test',
      'AI-Gateway-Intention-Code': 'saas_test_estimate',
      Authorization: 'Bearer ',
    },
  })
  return await result.data
}

const callAi = async (content: Message[]): Promise<any> => {
  const systemPrompt = await getSystemPrompt(tools)

  const messages: Message[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...content,
  ]

  const [_err, completion] = await to(withKSOToken(messages))
  if (_err) {
    console.error(_err)
  }
  return completion
}

export const requestService = async (content: string): Promise<any> => {
  let result: undefined | { message?: string; final_answer?: string } = {
    message: '',
  }
  const message: Message[] = [{ role: 'user', content: content }]
  do {
    result.message = ''
    const [_err, completion] = await to(callAi(message))
    const modelResponse = completion?.choices[0]?.text
    if (!modelResponse) {
      return {
        final_answer: '服务异常',
      }
    }
    result = await processModelResponse(modelResponse)
    if (result?.message) {
      message.push({ role: 'assistant', content: result.message })
    } else if (result?.final_answer) {
      return {
        final_answer: result.final_answer,
      }
    }
  } while (result?.message)
}
