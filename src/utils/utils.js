// import { IAssistant } from 'tymh-pk';
// import { API_CODE_OK } from '@/constants/AppConstants';



// 请求结果是否成功
export const isApiSuccess = result => result && result.code === 0;

// 验证结果是否正确
export const checkResult = result => {
  if (result.msg === '该角色存在菜单互斥，不能同时授权给用户！') {
    return false;
  }
  const code = isApiSuccess(result);
  if (!code) {
    msgError(result.msg);
  }
  return code;
};

// 日期格式化
export const dateFormat = (date = '', fmt = 'yyyy-MM-dd') => {
  if (date !== null) {
    // author: meizz
    if (typeof date === 'string') {
      return date;
    }
    const newDate = new Date();
    newDate.setTime(date);
    const o = {
      'M+': newDate.getMonth() + 1, // 月份
      'd+': newDate.getDate(), // 日
      'h+': newDate.getHours(), // 小时
      'm+': newDate.getMinutes(), // 分
      's+': newDate.getSeconds(), // 秒
      'q+': Math.floor((newDate.getMonth() + 3) / 3), // 季度
      S: newDate.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      // eslint-disable-next-line
      fmt = fmt.replace(
        RegExp.$1,
        `${newDate.getFullYear()}`.substr(4 - RegExp.$1.length),
      );
    }
    Object.keys(o).forEach(k => {
      if (new RegExp(`(${k})`).test(fmt)) {
        // eslint-disable-next-line
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
        );
      }
    });
    return fmt;
  }
  return '';
};

// 将时间戳转为固定时间格式
export const formatUnixTime = (unixTimeStr, format = 'yyyy-MM-dd hh:mm:ss') => {
  const issafariBrowser =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  let unixDate = null;
  if (issafariBrowser) {
    unixDate = new Date(
      unixTimeStr
        .replace(/-/g, '/')
        .replace(/T/g, ' ')
        .replace('.000+0000', ''),
    );
  } else {
    unixDate = new Date(unixTimeStr);
  }
  // eslint-disable-next-line
  if (isNaN(unixDate * 1)) {
    return unixTimeStr || '';
  }
  return dateFormat(unixDate, format);
};

// 格式化金额
export const fmoney = (s = 0, n = 0) => {
  // 判断不为空
  if (!s && typeof s !== 'number') {
    return '';
  }
  // eslint-disable-next-line
  s = `${parseFloat(s).toFixed(n)}`;
  const l = s
    .split('.')[0]
    .split('')
    .reverse();
  const r = s.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i += 1) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
  }
  const result = t
    .split('')
    .reverse()
    .join('');
  return r ? `${result}.${r}` : result;
};

// 生成随机数
export const getRandomString = (length = 16) => {
  const $chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz0123456789';
  const maxPos = $chars.length;
  let retStr = '';
  for (let i = 0; i < length; i += 1) {
    retStr += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return retStr;
};

// 生成guid
export const guid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// 去除特殊符号
export const replaceSpecialSymbols = (param = {}, symbols = ['%']) => {
  const temp = {
    ...param,
  };
  Object.keys(temp).forEach(key => {
    if (temp[key]) {
      if (typeof temp[key] === 'string') {
        symbols.forEach(symbol => {
          temp[key] = temp[key].replace(new RegExp(symbol, 'g'), '#');
        });
      } else if (typeof temp[key] === 'object' && !Array.isArray(temp[key])) {
        temp[key] = replaceSpecialSymbols(temp[key]);
      }
    }
  });
  return temp;
};

// 前端序号格式化
export const formatPageIndex = (pageInfo, index) =>
  (pageInfo.currentPage - 1) * pageInfo.size + index + 1;

// 获取数据下所有关于column的数据列表
const getAllValueColumns = (
  res = [],
  data = {},
  column = 'menuId',
  moreColumn = 'children',
) => {
  const val = data[column];
  if (val) {
    res.push(val);
  }
  if (data[moreColumn] && data[moreColumn].length) {
    data[moreColumn].forEach(v => {
      getAllValueColumns(res, v, column, moreColumn);
    });
  }
};

// 优化树形数据搜索方法，当匹配某一个选项，则默认选择其下面的子选项
export const treeFilterMethod = (
  keyword,
  curData,
  labelColumn = 'menuName',
  valueColumn = 'menuId',
  moreColumn = 'children',
) => {
  // 缓存关键字和过滤后的valueColumn数据
  if (keyword === '' || treeFilterMethod.cacheKeyword !== keyword) {
    treeFilterMethod.cacheKeyword = '';
    treeFilterMethod.cacheKeys = [];
  }
  treeFilterMethod.cacheKeyword = keyword;
  // 没有关键字全部返回
  if (!keyword) return true;
  // 如果能从缓存中匹配到key，则直接返回
  if (
    treeFilterMethod.cacheKeys &&
    treeFilterMethod.cacheKeys.length &&
    treeFilterMethod.cacheKeys.indexOf(curData[valueColumn]) !== -1
  ) {
    return true;
  }
  // 包含关键字则缓存keys
  const isExist = curData[labelColumn].includes(keyword);
  if (isExist) {
    const cachedKeys = [];
    getAllValueColumns(cachedKeys, curData, valueColumn, moreColumn);
    treeFilterMethod.cacheKeys = [...treeFilterMethod.cacheKeys, ...cachedKeys];
  }
  return isExist;
};
treeFilterMethod.cacheKeyword = '';
treeFilterMethod.cacheKeys = [];

// 树形数据高亮格式化
export const treeRenderContent = (
  createElement,
  keyword,
  node,
  isHighlight = true,
) => {
  const lab = node.label;
  let resultLabel = [lab];
  if (isHighlight && keyword !== '' && lab !== '' && lab.includes(keyword)) {
    const keywordLabelArr = lab.split(keyword);
    const arrLen = keywordLabelArr.length;
    resultLabel = [];
    keywordLabelArr.forEach((v, i) => {
      resultLabel.push(v);
      if (i < arrLen - 1) {
        resultLabel.push(
          createElement(
            'span',
            {
              attrs: {
                style: 'color:#0160C0;',
              },
            },
            keyword,
          ),
        );
      }
    });
  }
  return createElement(
    'span',
    {
      attrs: {
        class: 'el-tree-node__label',
      },
    },
    [...resultLabel],
  );
};

const msgSender = ({
                     type = '',
                     path = '',
                     label = '',
                     query = {},
                     token = '',
                   }) => {
  if (type) {
    window.top.postMessage(
      {
        type,
        path,
        label,
        query,
        token,
      },
      '/',
    );
  }
};

export const postMsg = msgSender;

// 菜单排序
export const sortMenuOrder = menu =>
  menu.sort(
    (m1, m2) => parseInt(m1.menuOrder, 10) > parseInt(m2.menuOrder, 10) || -1,
  );

// 通知portal打开新标签
export const openNewTab = params => {
  if (params.path) {
    msgSender({
      type: 'openNewView',
      path: params.path,
      label: params.label,
      query: params.query || {},
    });
  }
};

// 通知portal下载文件
export const download = path => {
  if (path) {
    msgSender({
      type: 'download',
      path,
    });
  }
};

// 获取指定页面的信息
export const getRouterOptions = params => {
  // params =>  vm , name, path (name和path传其一即可)
  const routes = params.vm.$router.options.routes[0];
  const routesList = routes.children;
  const hostPath = routes.path;
  let findRes = null;
  if (params.name) {
    // eslint-disable-next-line
    findRes = routesList.filter(v => v.name === params.name)[0];
  }
  if (params.path) {
    const realPath = params.path.split('?')[0];
    // eslint-disable-next-line
    findRes = routesList.filter(v => realPath.indexOf(v.path) !== -1)[0];
  }
  if (!findRes) {
    return {};
  }
  return {
    path: `${hostPath}/${findRes.path}`,
    name: findRes.name,
    label: findRes.meta.title || '',
  };
};

// 根据code信息查找codeName，用于字典表数据
export const getDictNameByCode = (code = '', dictList = []) =>
  (dictList.find(v => v.code === code) || {}).codeName || '';

// 简单实现的deepCopy
export const deepCopy = o => {
  if (o instanceof Array) {
    const n = [];
    for (let i = 0; i < o.length; i += 1) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  }
  if (o instanceof Object) {
    const n = {};
    // for (const i in o) {
    //   n[i] = deepCopy(o[i]);
    // }
    Object.keys(o).forEach(i => {
      n[i] = deepCopy(o[i]);
    });

    return n;
  }
  return o;
};

export const getUnique = () => {
  return Math.random().toString(36).slice(-8);
};


export const moveToAnimation = (targetElement, currentY, targetY) => {
    const needScrollTop = targetY - currentY;
    const targetEl = targetElement || window
  // eslint-disable-next-line no-underscore-dangle
    let _currentY = currentY;
    setTimeout(() => {
      const dist = Math.ceil(needScrollTop / 10);
      _currentY += dist;
      if (Math.abs(needScrollTop) > 10) {
        moveToAnimation(targetElement, _currentY, targetY);
      } else {
        targetEl.scrollTop = _currentY
      }
    }, 10);
  };

// 下载文件
export const  downloadFile = (blobData, fileName) => {
  const blob = new Blob([blobData])
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = fileName // 这里填保存成的文件名
  a.click()
  URL.revokeObjectURL(a.href)
  a.remove();
}

// 防抖
export const debounce = (fn, delay) => {
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
// 节流
export const throttle = (fn, delay) => {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last > delay) {
      last = now
      fn.apply(this, args)
    }
  }
}
// 深拷贝
export const deepClone = (obj, cache = new WeakMap()) => {
  if (typeof obj !== 'object') return obj
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (cache.get(obj)) return cache.get(obj)

  let cloneObj = new obj.constructor()
  cache.set(obj, cloneObj)
  console.log(cache)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], cache)
    }
  }
  return cloneObj
}

// 通过名称获取cookie值
export const getCookie = name => `;${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();

/**
 * js数值计算 示例：funCalc([1.02,3,4]),处理js计算精度问题
 * @param {*} arrList 参数数组
 * @param {*} operator 操作符：1加法 2乘法
 * @param {*} precision 精度 默认2位
 */
 export const funCalc = (arrList, operator = 1, precision = 2) => {
  if (arrList.length === 0) return 0;
  // 计算最大数度值,避免精度丢失，先扩大位数，再缩小
  let mPow = Math.pow(10, precision); // 默认2位小数
  let total = 0;
  if (operator == 2) {
    total = 1;
    mPow = 1;
  }
  for (const item of arrList) {
    let tem = 0;
    if (item) {
      tem = parseFloat(item) ?? 0; // parseFloat处理，转化失败时给0
      tem = !isNaN(tem) ? tem : 0; // 处理 NaN 情况
    }
    switch (operator) {
      case 1:
        total += tem * mPow;
        break;
      case 2:
        total *= tem * mPow;
        break;
      default:
        total += tem * mPow;
    }
  }
  // toFixed部分浏览器会用问题，toFixed它是一个四舍六入五成双的诡异的方法(也叫银行家算法)，"四舍六入五成双"含义：对于位数很多的近似数，当有效位数确定后，其后面多余的数字应该舍去，只保留有效数字最末一位，这种修约（舍入）规则是“四舍六入五成双”，也即“4舍6入5凑偶”这里“四”是指≤4 时舍去，"六"是指≥6时进上，"五"指的是根据5后面的数字来定，当5后有数时，舍5入1；当5后无有效数字时，需要分两种情况来讲：①5前为奇数，舍5入1；②5前为偶数，舍5不进。（0是偶数）
  const res = (total / mPow).toFixed(precision);
  // // 修复toFixed
  // const res = parseInt(total + 0.5, 10) / times;
 
  return res;
}