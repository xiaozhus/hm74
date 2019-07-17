// 封装一个vue的插件， 完成当前文件夹在所有的组件全局注册
// 导入这个模块，使用vue.use(使用这个模块) vue 会调用install函数  默认传入vue 对象
import MyBread from '@/components/my-bread.vue'
export default {
  install (Vue) {
    // 使用vue对象去做业务即可
    // 进行组件的注册
    Vue.component(MyBread.name, MyBread)
    // 进行注册
  }
}
