import { createStore } from 'vuex'
import getters from './getters'
// const modulesFiles = require.context('./modules', true, /\.js$/)
const modulesFiles = import.meta.globEager("./modules/*.js") 
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
let modules = {}
for(const modulePath in modulesFiles) {
  let moduleAllName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  let moduleName = moduleAllName.replace('modules/', '')
  modules[moduleName] = modulesFiles[modulePath]?.default ?? {}
}
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})


export default createStore({
  getters,
  modules
})