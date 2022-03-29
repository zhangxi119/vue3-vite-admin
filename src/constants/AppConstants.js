let baseURL = '';
if (process.env.NODE_ENV !== 'production') {
  baseURL = `${window.location.origin}`;
  // const orogin = `http://30.23.111.34`;
  // baseURL = `${orogin}/api/`;
} else {
  baseURL = `${window.location.origin}`;
}
export const BASE_URL = baseURL;
export const API_CODE_OK = 0;
export const API_CODE_ERROR = '000001';
// 在执行角色传递，判断角色是否越权(resultCode为30002表示用户越权，显示message的信息)
export const API_CODE_AUTH = '30002';
// 在执行角色菜单分配时候，判断是否菜单互斥
export const API_CODE_CONFLICT = '30004';
// 用户登录失效状态
export const API_CODE_RELOGIN = '4100011';
// 用户水平越权状态码
export const API_CODE_PAGE_AUTH = '90002';


export const showExportBtns = false
