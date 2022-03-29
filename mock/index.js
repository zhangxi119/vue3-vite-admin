import Mock from 'mockjs'
let mockData = Mock.mock({
  'code': 0,
  'message': 'success',
  'data': {
    'total': 18,
    'pageNum': 1,
    'pageSize': 10,
    'list|18': [
      {
        'param_01': '@id()', 
        'param_02': 'MOCK随机数据', 
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
})
export default [
  {
      url: "/api/getUsers",
      method: "post",
      response: () => {
          return {
              code: 0,
              message: "ok",
              data: mockData,
          }
      }
  }
]