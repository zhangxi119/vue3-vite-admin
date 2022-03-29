import axios from 'axios';
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus';
import {
  BASE_URL,
  API_CODE_OK,
  API_CODE_RELOGIN,
  API_CODE_PAGE_AUTH,
} from '@/constants/AppConstants';
import getUrlParams from '@/utils/getUrlParams';



// 添加参数
const addParam = (url, obj) => {
  const param = Object.keys(obj)
    .map(key => {
      if (obj[key] === undefined) return '';
      return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
    })
    .concat()
    .join('&');

  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}${param}`;
};

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: BASE_URL, // api 的 base_url
  timeout: 59990, // 请求超时时间
});

/**
 * axios请求拦截器
 * @param {object} config axios请求配置对象
 * @return {object} 请求成功或失败时返回的配置对象或者promise error对象
 * */
axiosInstance.interceptors.request.use(
  config => {
    let requestHeader = {
      'sso-redirect-page': encodeURIComponent(window.location.href),
    };
    if (config.url.includes('/sso/click')) {
      // 获取url里面的accesstoken
      const ssoAccessToken = getUrlParams('ssoAccessToken');
      requestHeader = {
        ...requestHeader,
        ssoAccessToken,
      };
    }
    // eslint-disable-next-line
    config.headers = Object.assign(config.headers, requestHeader);
    // eslint-disable-next-line
    // config.url += '?username=admin';

    return config;
  },
  error => {
    console.log(error); // for debug
    Promise.reject(error);
  }
);

/**
 * axios 响应拦截器
 * @param {object} response 从服务端响应的数据对象或者error对象
 * @return {object} 响应成功或失败时返回的响应对象或者promise error对象
 * */
axiosInstance.interceptors.response.use(
  response => {
    const { data } = response;
    if (response && response.status === 200 && response.data.code === '30002') {
      window.location.href = response.data.redirectUrl;
    } else if (response.status >= 200 && response.status < 400) {
      if (data && data.code === API_CODE_RELOGIN) {
        window.top.postMessage(
          {
            type: 'sessionTimeout',
          },
          window.sessionStorage.getItem('portalOrigin')
        );
      } else if (data && data.code === API_CODE_PAGE_AUTH) {
        console.log('=====response  data.code========', data.code, data.msg);
        ElMessage.error(data.msg);
        window.top.postMessage(
          {
            type: 'authReplaceToHome',
          },
          window.sessionStorage.getItem('portalOrigin')
        );
      }
    }
    return response;
  },
  error => {
    console.log(error, '响应拦截err'); // for debug
    const msg = `${
      error.code === 'ECONNABORTED' ? '请求超时' : '操作失败'
    }，请稍后再试！`;
    ElMessage.error(msg);
    // Message.error('服务器错误，请刷新重试或联系管理员！');
    return Promise.reject(error);
  }
);

/**
 * 请求发出后检查返回的状态码，统一捕获正确和错误的状态码，正确就直接返回response，错误就自定义一个返回对象
 * @param {object} response 响应对象
 * @return {object} 响应正常就返回响应数据否则返回错误信息
 * */
function checkStatus(response) {
  // 如果HTTP状态码正常，则直接返回数据
  if (
    response &&
    (response.status === 200 ||
      response.status === 304 ||
      response.status === 400)
  ) {
    return response; // 如果不需要除了data之外的数据，可以直接 return response.data;
  }

  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常', // 或者直接response.statusText
    data: {},
  };
}

/**
 * 检查完状态码后需要检查后如果成功了就需要检查后端的状态码处理网络正常时后台语言返回的响应
 * @param {object} res 是后台返回的对象或者自定义的网络异常对象，不是http 响应对象
 * @return {object} 返回后台传过来的数据对象，包含code,msg,data等属性，
 * */
function checkCode(response) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (response.status === -404) {
    console.log(response.msg);
  }
  if (response.data && response.data.code !== API_CODE_OK) {
    // console.log(response.data.msg);
  }
  return response;
}

const get = (url, params) =>
  axiosInstance
    .request({
      method: 'get',
      url: `${
        url
        // addParam(url, { userId: 'ADMIN' })
      //   process.env.NODE_ENV !== 'production'
      //   ? addParam(url, { userId: 'ADMIN' })
      // : url
        //  :addParam(url, { userId: '1' })
      }`,
      params,
      headers: {
        'X-PA-MIME-TYPE': 3,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => checkStatus(response))
    .then(response => checkCode(response))
    .then(response => response.data || response);
const getDirect = (url, param, params) =>
  axiosInstance
    .request({
      method: 'get',
      url: `${url}/${param}`,
      params,
      headers: {
        'X-PA-MIME-TYPE': 3,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => checkStatus(response))
    .then(response => checkCode(response))
    .then(response => response.data || response);

const post = (url, data) =>
  axiosInstance
    .request({
      method: 'post',
      url: `${
        // addParam(url, { userId: 'ADMIN' })
      //   process.env.NODE_ENV !== 'production'
      //   ? addParam(url, { userId: 'ADMIN' })
      // : url
        //  :addParam(url, { userId: '1' })
        url
      }`,
      data,
      headers: {
        'X-PA-MIME-TYPE': 3,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
    .then(response => checkStatus(response))
    .then(response => checkCode(response))
    .then(response => response.data || response);

const postDownLoad = (url, data) =>
  axiosInstance
    .request({
      method: 'post',
      url: `${
        url
        // addParam(url, { userId: 'ADMIN' })
        // process.env.NODE_ENV !== 'production'
        //   ? addParam(url, { userId: 'ADMIN' })
        // : url
        // :addParam(url, { userId: '1' })
      }`,
      data,
      responseType: 'blob', // 表明返回服务器返回的数据类型
      timeout: 59990, // 请求超时时间
      headers: {
        'X-PA-MIME-TYPE': 3,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
    .then(response => checkStatus(response))
    .then(response => checkCode(response))
    .then(response => {
      return response
    });

const postFormData = (url, data, time) =>
  axiosInstance
    .request({
      method: 'post',
      url: `${
        url
        // addParam(url, { userId: 'ADMIN' })
      //   process.env.NODE_ENV !== 'production'
      //   ? addParam(url, { userId: 'ADMIN' })
      // : url
        //  :addParam(url, { userId: '1' })
      }`,
      data,
      timeout: time || 59990, // 请求超时时间
      headers: {
        'X-PA-MIME-TYPE': 3,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
    .then(response => checkStatus(response))
    .then(response => checkCode(response))
    .then(response => response.data || response);

const deleteAxios = (url, data, time) =>
  axiosInstance
    .request({
      method: 'delete',
      url,
      data,
      timeout: time || 59990, // 请求超时时间
      headers: {
        'X-PA-MIME-TYPE': 3,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
    .then(response => checkStatus(response))
    .then(response => checkCode(response))
    .then(response => response.data || response);
export default {
  get,
  getDirect,
  post,
  postFormData,
  postDownLoad,
  axios,
  deleteAxios
};
