function getParamsString() {
  const url = document.location.toString();
  const arrUrl = url.split('?');
  if (arrUrl.length > 1) {
    const para = arrUrl[1];
    return decodeURIComponent(para);
  }
  return '';
}

/**
 * 获取URL参数
 * @param {String} key 非必要参数  需要返回的参数值
 * @returns {Object} 当入参没有Key的时候 返回所有参数
 * @returns {String} 当入参有Key的时候 返回对应参数的值
 */
const getUrlParams = key => {
  const str = getParamsString();
  const paramsList = str.split('&');
  const params = {};
  paramsList.forEach(e => {
    const arr = e.split('=');
    params[arr[0]] = arr[1] || '';
  });
  if (key) {
    return params[key] || '';
  }
  return params;
};

export default getUrlParams;
