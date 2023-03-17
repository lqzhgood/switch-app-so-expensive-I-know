<template>
<div id="app">
	<transition name="fade">
		<loading v-if="state.loading"></loading>
	</transition>
	<cheader :state="state" :games="games"></cheader>
	<div id="main">
		<card :games="filter" v-show="state.showType=='grid'"></card>
		<list :games="filter" v-show="state.showType=='list'" :state="state"></list>
	</div>
	<transition name="slide-fade">
		<ranking v-if="state.ranking_show" :state="state" :l_des="l_des" :h_des="h_des"></ranking>
	</transition>
	<div id="search">
		<div class="mdui-textfield mdui-textfield-expandable mdui-float-right mdui-textfield-expanded mdui-textfield-focus">
			<button class="mdui-textfield-icon mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">search</i></button>
			<input class="mdui-textfield-input" type="text" placeholder="Search" v-model.trim="key" id="searchBtn" v-focus/>
			<button class="mdui-textfield-close mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons"  @click="reKey()">close</i></button>
		</div>
	</div>
	<span id="updateAt" v-if="state.updateAt">更新时间：{{fmtData(updateAt)}}</span>
</div>
</template>

<script>
require('promise.prototype.finally').shim()
import utils from 'utils/utils.js'


import loading from "./components/loading/loading"
import cheader from "./components/cheader/cheader"
import card from "./components/card/card"
import list from "./components/list/list"
import ranking from "./components/ranking/ranking"



export default {
	name: 'app',
	mounted() {
		//do something after creating vue instance
		this.$nextTick(() => {
			// 开始点击搜索栏
			setTimeout(() => {
				// $("#search").trigger("click");
			}, 1000)
			this.$http.get('./static/db/games.json').then((data) => {
					this.games = data.data.data;
					this.updateAt = data.data.time;
					window.const.COUNTRYS = () => data.data.data[0].prices.map((v) => {
						return v.country
					})
					// 初始化 图表 数据
					this.countrys_count = [];
					data.data.data[0].prices.forEach((v) => {
						this.countrys_count.push({
							country: v.country,
							cHtml: v.cHtml,
							l_count: 0,
							h_count: 0
						})
					})

					data.data.data.forEach((v) => {
						// diy img size
						if (v.img) v.img = v.img.replace(/\?h=180\&/, "?h=240&").replace(/w=180$/, "w=240");
						// class to l h
						v.prices.forEach((p_c, i) => {
							if (p_c && p_c.price && v.l[0] && v.h[0]) {
								if (p_c.price == v.l[0].price) {
									p_c.class = 'l';
									this.countrys_count[i].l_count++;
								}
								if (p_c.price == v.h[0].price) {
									p_c.class = 'h';
									this.countrys_count[i].h_count++;
								}
							}
						})
					})
					this.l_des = JSON.parse(JSON.stringify(this.countrys_count)).sort((a, b) => {
						return b.l_count - a.l_count;
					})
					this.h_des = JSON.parse(JSON.stringify(this.countrys_count)).sort((a, b) => {
						return b.h_count - a.h_count;
					})
					this.l_des.forEach((v) => {
						v.width = `${ Math.round(v.l_count / this.l_des[0].l_count * 100)}%`
						v.count = v.l_count;
					})
					this.h_des.forEach((v) => {
						v.width = `${ Math.round(v.h_count / this.h_des[0].h_count * 100)}%`
						v.count = v.h_count;
					})
				})
				// .catch(err => {
				// 	console.log('err', err)
				// 	alert(`网络错误 请刷新页面 \n${err}`)
				// })
				.finally(() => {
					setTimeout(() => {
						this.state.loading = false;
						setTimeout(() => {
							this.state.updateAt = false;
						}, 10 * 1000)
					}, 500)
				})
		})
	},
	data: () => ({
		updateAt: '',
		games: [],
		countrys_count: [],
		l_des: [],
		h_des: [],
		key: '',
		state: {
			updateAt: true,
			showType: 'list',
			cry_list_show: false,
			ranking_show: false,
			loading: true
		}
	}),
	computed: {
		filter() {
			return this.games.filter((v) => {
				let txt = v.name.toLowerCase();
				return txt.includes(this.key.toLowerCase());
			})
		}
	},
	methods: {
		reKey() {
			setTimeout(() => {
				this.key = '';
			}, 300)
		},
		fmtData(time) {
			return utils.DateFormart('yyyy-MM-dd hh:mm:ss', new Date(time))
		}
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			}
		}
	},
	components: {
		loading,
		cheader,
		card,
		list,
		ranking
	}
}
</script>

<style>
@import "./assets/css/reset.css";

.clearfix:after {
	content: ".";
	display: block;
	height: 0;
	clear: both;
	visibility: hidden
}

.clearfix {
	*+height: 1%;
}


.fade-enter-active,
.fade-leave-active {
	transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}


.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all .3s;
}

.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateY(100px);
	opacity: 0;
}

* {
	margin: 0;
	padding: 0;
}

body {
	background: url("./assets/img/colored_body_top2.png") center top no-repeat #1b2838;
	padding-top: 50px;
}

#updateAt {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 10;
	color: rgb(20, 50, 73);
	background: rgba(255, 255, 255, 0.8);
	font-size: 14px;
	padding: 5px;
}


#search {
	position: fixed;
	right: 20px;
	bottom: 20px;
	z-index: 100;
}

#search .mdui-textfield-expandable {
	background: #fff;
	border-radius: 20px;
}
</style>
