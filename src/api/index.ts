import request from '@/utils/request';
const baseUrl = '/audit'


// 获取table表数据\新增\删除
export const getTableList = params => {
  return request.post(`/mock/table/list`, params);
};
// 获取筛选条件下拉数据
export const getSelectList = params => {
  return request.post(`/mock/dict/list`, {
    ...params,
  })
}

// mock接口

// 登录
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
// 退出登录
export const logout = params => {
  return request.post(`/mock/user/logout`, {
    ...params,
  })
}