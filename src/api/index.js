import request from '@/utils/request';
const baseUrl = '/audit'

// 获取报表页面地址信息
export const getBaseTableUrl = params => {
  return request.post(`${baseUrl}/mead/dimQuery/queryDimInfo`, {
      ...params,
  });
}
// 
export const queryKnowledge = params => {
  return request.post(`/api/getUsers`, params);
};
export const getDictByField1Mock = params => {
  return request.post(`/api/getUsers`, {
    ...params,
  })
}
export const getSelectList = params => {
  return request.post(`/api/selectList`, {
    ...params,
  })
}
export const getUserInfo = params => {
  return request.post(`/api/userInfo`, {
    ...params,
  })
}
export const getUserInfoTest = params => {
  return request.post(`/vue-element-admin/user/login`, {
    ...params,
  })
}

// mock接口

//登录
export const login = params => {
  return request.post(`/mock/user/login`, {
    ...params,
  })
}
// 通过token获取用户信息
export const getInfo = params => {
  return request.get('/mock/user/info', {
    ...params
  })
}
