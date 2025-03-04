import fetch from '../../fetch'

export const searchUser = async (input) => {
  return fetch
    .get(
      'https://plussvr.wps.cn/svr/v1/adm/companies/694174544/members/search',
      {
        params: {
          dept_id: '634153494621888512',
          recursive: true,
          offset: 0,
          limit: 1,
          searchname: input,
          status: 'active',
        },
      },
    )
    .then((res) => {
      return res.data.members[0].id
    })
}

export const showOfflineAvatar = async (input: boolean) => {
  // https://365.kdocs.cn/3rd/plussvr/cmgr/v1/adm/companies/694174544/configs/batch
  return fetch
    .patch(
      'https://plussvr.wps.cn/cmgr/v1/adm/companies/694174544/configs/batch',
      {
        configs: [
          {
            key: 'show_offline_user_access_record',
            value: input ? 'enable' : 'disable',
          },
        ],
      },
    )
    .then((res) => {
      const p = new Promise((resolve) => {
        setTimeout(() => {
          resolve(res.data)
        }, 3000)
      })
      return p
    })
}
