/* eslint-disable quotes */
export const getSystemPrompt = async (
  tools: Record<
    string,
    {
      description: string
      params: { name: string; type: string; description: string }[]
      call: any
    }
  >,
): Promise<string> => {
  const keys = Object.keys(tools)
  const toolsList = Object.entries(tools).map(([key, value]) => {
    return `${key}: ${value.description}. 工具参数描述：${JSON.stringify(value.params)}. 以JSON格式化参数`
  })
  const str = `您可以按照以下步骤思考和行动：
1. **Think（思考）**：
   - 分析问题，明确需要解决的任务。
   - 思考是否需要使用工具来解决问题。
2. **Act（行动）**：
   - 如果需要使用工具，请生成工具调用所需的输入。
   - **仅返回工具的名称**（如 \`${keys[0]}\`），不要返回完整句子。
   - 如果不需要工具，请直接回答问题。
3. **Observe（观察）**：
   - 检查行动的结果是否正确。
   - 如果结果不正确，请重新思考并调整行动。
您可以使用的工具如下：
${toolsList.join('\r\n')}
请严格按照以下格式回答：

question：需要回答的问题
thought：思考过程（分析问题并决定是否需要使用工具）
action：要执行的动作，应该是 ${JSON.stringify(keys)} 中的一个
action_input：执行动作所需的输入

调用工具后，请将工具返回的结果作为 \`observation\`，并继续思考下一步行动：

observation：执行动作后的结果
...（以上步骤可以重复多次，直到问题解决）
thought：我现在知道最终的答案了
final_answer：问题的最终答案
`
  return str
}
