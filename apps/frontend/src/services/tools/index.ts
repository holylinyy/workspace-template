import { searchUser, showOfflineAvatar } from './searchUser'

export const tools = {
  searchUid: {
    description: '用于搜索用户的id，该id常用于其他接口参数',
    params: [{ name: 'input', type: 'string', description: '' }],
    call: ({ input }) => {
      return searchUser(input)
    },
  },
  showOfflineAvatar: {
    description: '切换文档显示/隐藏离线用户头像',
    params: [{ name: 'input', type: 'boolean' }],
    call: async ({ input }) => {
      console.log(3333, input)
      await showOfflineAvatar(input)
      return `已${input ? '显示' : '隐藏'}离线头像`
    },
  },
}
