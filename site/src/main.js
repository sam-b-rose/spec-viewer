import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  Aside,
  Card,
  Cascader,
  Container,
  Input,
  Main,
  Tree,
  Tag
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import store from './store'

locale.use(lang)
Vue.use(Aside)
Vue.use(Card)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Input)
Vue.use(Main)
Vue.use(Tag)
Vue.use(Tree)

library.add(faFolder)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
