import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 职责1：导入项目需要依赖的资源 (包  css ...)
// 职责2: 初始化根实例  new Vue() 选项  render  作用是把某一个App组件渲染在你指定的容器  (.$mount ('#app))

new Vue({
  render: h => h(App)
}).$mount('#app')
