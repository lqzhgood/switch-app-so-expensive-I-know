// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
	preLoad: 1.3,
	error: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3227542179,616024203&fm=200&gp=0.jpg',
	loading: 'http://img.zcool.cn/community/018cf6554251780000019ae970ca87.jpg',
	attempt: 1
})


Vue.config.productionTip = false
Vue.prototype.$http = axios

window.const = {
	DEFAULT_CRY() {
		return ['Japan', 'Mexico', 'United States', 'South Africa']
	}
}

window.$$ = mdui.JQ;
window.BUS = new Vue();

/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: '<App/>',
	components: { App }
})
