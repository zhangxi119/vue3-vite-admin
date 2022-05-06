
import Mock from 'mockjs'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}
let userInfo = Mock.mock({
  'code': 0,
  'message': 'success',
  'data': {
    'token': 'sdfsfefejgljdg'
  }
})
export default [
  {
    url: "/api/userInfo",
    method: "post",
    response: config => {
      const { user } = config.body
      if (user === 'zxx') {
        return userInfo
      }
      return {
        code: '0'
      }
    }
  },
]