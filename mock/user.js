
import Mock from 'mockjs'
const API_CODE_OK = 0

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

export default [
  {
    url: "/mock/user/login",
    method: "post",
    response: config => {
      const { userName } = config.body
      const token = tokens[userName]
      if (!token) {
        return Mock.mock({
          'code': -1,
          'message': 'error',
        })
      }
      return Mock.mock({
        'code': API_CODE_OK,
        'message': 'success',
        'data': token
      })
    }
  },
  // get user info
  {
    url: '/mock/user/info',
    type: 'get',
    response: config => {
      // alert(config.query)
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return Mock.mock({
          'code': -1,
          'message': 'Login failed, unable to get user details.'
        })
      }
      return Mock.mock({
        'code': API_CODE_OK,
        'data': info
      })
    }
  },
  {
    url: '/mock/user/logout',
    type: 'post',
    response: _ => {
      return Mock.mock({
        code: API_CODE_OK,
        data: 'success'
      })
    }
  }
]