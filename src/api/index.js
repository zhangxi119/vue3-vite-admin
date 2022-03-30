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