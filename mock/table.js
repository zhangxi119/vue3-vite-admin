/*
 * @Author: zhangxi 380313641@qq.com
 * @Date: 2022-04-27 10:03:14
 * @LastEditors: zhangxi
 * @LastEditTime: 2022-10-18 15:26:59
 * @FilePath: \vue3-vite-admin\mock\table.js
 * @Description: 
 */
import Mock from 'mockjs'
import { deepClone } from '../src/utils/utils'
import responseData from './responseData'
let tabelList = Mock.mock(
  {
    'total': 18,
    'pageNum': 1,
    'pageSize': 10,
    'list|10': [
      {
        'param_01': '@id()', 
        'param_02': 'MOCKK随机数据MOCKK随机数据MOCKK随机数据MOCKK随机数据MOCKK随机数据MOCKK随机数据MOCKK随机数据MOCKK随机数据MOCKK随机数据MOCKK随机数据', 
        'param_03': '@date(yyyy-mm-dd)', 
        'param_04': '@city(true)',
        'param_05': /^1[0-9]{10}$/,
        'param_06': '@cname(2,3)',
        'param_07': '@boolean()',
        'param_08': '@email()',
        'param_09': '@cname(2,3)',
        'param_10': '@cname(2,3)',
        'param_11|1-100.2': 1,
        'param_12': '@cname(2,5)',
        'param_13': '@date(yyyy-mm-dd)',
        'param_14': '@cname(2,4)',
        'param_15': '@cname(2,4)',
        'param_16': '@cname(2,4)',
        'param_17': '@cname(2,4)',
        'param_18': '@cname(2,4)',
        'param_19': '@cname(2,4)',
        'param_20': '@cname(2,4)',
        'rid': '@id()',
        'number|1-100': 1, 
      },
    ]
  }
)
let tableSearch = Mock.mock({
  'total': 18,
  'pageNum': 1,
  'pageSize': 10,
  'list|5': [
    {
      'codeName': '@cname(2,5)',
      'code': '@id()',
      'param_01': '@id()', 
      'param_02': 'MOCK随机数据', 
      'param_03': '@date(yyyy-mm-dd)', 
      'param_04': '@city(true)',
      'param_05': /^1[0-9]{10}$/, 
    },
  ]
})
export default [
  // table表数据
  {
    url: "/mock/table/list",
    method: "post",
    response: () => {
        let res = deepClone(responseData)
        res.data = tabelList
        return res
    }
  },
  // 筛选条件数据
  {
    url: "/mock/dict/list",
    method: "post",
    response: () => {
      let res = deepClone(responseData)
      res.data = tableSearch
      return res
    }
  },
]