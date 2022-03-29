import { getDictByField1 } from "../api/checkCenter";

// eslint-disable-next-line import/prefer-default-export
export function getDictField(params = []) {
  return new Promise((resolve, reject) => {
    const dictApis = []
    params.forEach(el => {
      dictApis.push(getDictByField1({field: el}))
    })
    Promise.all(dictApis).then(res => {
      res.forEach(resItem => {
        if(resItem.data) {
          // eslint-disable-next-line no-param-reassign
          resItem.data = resItem.data.map(el => {
            return {
              ...el,
              label: el.value,
              value: el.label
            }
          })
        }
      })
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
