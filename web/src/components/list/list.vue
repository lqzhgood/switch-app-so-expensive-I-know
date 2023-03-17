<template>
<div id="list">
	<transition name="slide-fade">
		<div class="cry-list" v-if="games[0] && state.cry_list_show">
			<!-- close -->
			<button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple close" @click="close"><i class="mdui-icon material-icons">close</i></button>
			<!-- quick -->
			<div class="quick">
				<button class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple" @click="selectAll">全选</button>
				<button class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-color-theme-accent mdui-ripple" @click="selectDefult">日墨美非</button>
			</div>
			<div class="hr"></div>
			<!-- select -->
			<div class="select">
				<label class="mdui-checkbox" v-for="v in games[0].prices" :key="v.country">
			  <input type="checkbox"  :value="v.country" v-model="countrys_ft"/>
			  <i class="mdui-checkbox-icon"></i>
			  <span v-html="v.cHtml" class="cry"></span>
		</label>
			</div>
		</div>
	</transition>
	<div class="wrap">
		<ul class="row title" v-if="games[0] && games[0].prices">
			<li class="cell cover">封面</li>
			<li class="cell info">信息</li>
			<li class="cell country" v-for="c in games[0].prices" :key="c.key" v-html="c.cHtml" :title="c.country" v-if="showCountry(c.country)"></li>
		</ul>
		<ul class="row" v-for="v in games" :key="v.name" :title="v.description">
			<!-- <dt class="cell cover"><img v-lazy="v.img" :srcset="v.img_srcset" alt=""></dt> -->
			<dt class="cell cover"><img v-lazy="v.img" alt=""></dt>
			<li class="cell info">
				<div class="detail">
					<p class="name" :title="v.name" @click="openurl(v.url)">{{v.name}}</p>
					<p class="tag"> </p>
					<p class="release" :class="{comingsoon:new Date().getTime()<=new Date(v.release).getTime()}">{{fmtData(v.release)}}</p>
				</div>
				<div class="money">
					<div class="saleWrap">
						<p class="sale" :title="v.sale.now.country + ' - ' + v.sale.now.price + ' - ' +v.sale.now.time " v-if="v.sale && v.sale.now.price == v.l[0].price">
							-{{Math.round(100-v.sale.sale*100)}}%
						</p>
					</div>
					<div class="priceWrap" v-if="v.l[0]">
						<p class="hisPrice" :title="'历史最低 - '+ v.vl.country + ' - ' +v.vl.time" v-if="v.vl">
							<i class="mdui-icon material-icons">&#xe889;</i>
							<span v-html="v.vl.cHtml" class="country"></span>
							<span class="price">￥{{v.vl.price}}</span>
						</p>
						<p class="nowPrice" :title="'当前价格 - '+ v.l[0].country + ' - ' +v.l[0].time">
							<i class="mdui-icon material-icons">&#xe227;</i>
							<span v-html="v.l[0].cHtml" class="country"></span>
							<span class="price">￥{{v.l[0].price}}</span>
						</p>
					</div>
					<div class="priceWrap na" v-else>
						N/A
					</div>
				</div>
			</li>
			<li class="cell country" :class="{'l':p.class=='l','h':p.class=='h'}" v-for="p in v.prices" :title="p.country" v-if="!state.cry_list_show && showCountry(p.country)">
				<span v-if="p.price!='N/A'">￥</span>{{p.price}}
			</li>
		</ul>
	</div>
</div>
</template>
<script>
import utils from 'utils/utils.js'

export default {
	name: "list",
	created() {
		let lc_cry = localStorage.countrys_s;
		if (lc_cry) {
			this.countrys_s = JSON.parse(lc_cry);
		} else {
			this.countrys_s = window.const.DEFAULT_CRY();
		}
	},
	props: {
		state: Object,
		games: Array,
	},
	data: () => ({
		countrys_s: [],
		countrys_s_tmp: []
	}),
	computed: {
		countrys_ft: {
			get() {
				if (this.countrys_s.length == 0) {
					this.countrys_s = window.const.DEFAULT_CRY();
				}
				return this.countrys_s
			},
			set(v) {
				this.countrys_s = v;
				localStorage.countrys_s = JSON.stringify(v);
				return;
			}
		}
	},
	methods: {
		openurl(url) {
			window.open(url);
		},
		fmtData(time) {
			return utils.DateFormart('yyyy-MM-dd', new Date(time))
		},
		showCountry(cry) {
			if (this.state.cry_list_show) {
				return false;
			}
			return this.countrys_s.includes(cry)
		},
		close() {
			this.state.cry_list_show = false
		},
		selectAll() {
			this.countrys_ft = window.const.COUNTRYS();
		},
		selectDefult() {
			this.countrys_ft = window.const.DEFAULT_CRY();
		}
	}
}
</script>
<style media="screen">
#list .wrap .country img {
	vertical-align: middle;
}
</style>
<style scoped>
#list {
	font-size: 0;
	width: 100vw;
	height: calc( 100vh - 50px);
	overflow: auto;
}

#list::-webkit-scrollbar {
	/*background-color: #fff !important;*/
	height: 10px;
	width: 10px;
	border-radius: 5px;
	cursor: pointer;
}

#list::-webkit-scrollbar-track {
	/*background-color: #fff !important;*/
}

#list::-webkit-scrollbar-thumb {
	/*background-color: #FF8A65 !important;*/
	background: linear-gradient(135deg, #3d6c8d 0%, #2e5470 100%);
}

.cry-list {
	position: absolute;
	z-index: 999;
	top: 20px;
	padding: 10px;
	margin-bottom: 20px;
	left: 5vw;
	width: 90vw;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	align-items: center;
	align-content: space-around;
	color: rgba(0, 0, 0, 0.8);
	background: linear-gradient( to bottom, #e3eaef 5%, #c7d5e0 95%);
	box-shadow: 0 0 12px #000000;
	font-size: 16px;
	box-sizing: border-box;
}

.cry-list .close {
	position: absolute;
	right: -16px;
	top: -16px;
	background-color: #ff4081 !important;
	color: #fff;
	box-shadow: 0 0 12px #000000;
}

.cry-list .quick {
	text-align: center;
	width: 100%;
}

.cry-list .quick button {
	color: #fff;
	background-color: #ff4081 !important;
}

.cry-list .quick button:first-child {
	margin-right: 20px;
}

.cry-list .hr {
	height: 1px;
	background-color: #fff;
	margin: 10px 10px 5px;
	width: 100%;
}


.cry-list label {
	margin: 0 10px;
}

.cry-list .cry {
	width: 80px;
	display: inline-block;
}

.cry-list .mdui-checkbox-icon:after {
	border: 2px solid rgba(0, 0, 0, 0.8);
}


.wrap {
	display: inline-block;
	position: relative;
}

.row {
	background: rgba( 0, 0, 0, 0.2);
	white-space: nowrap;
	display: inline-block;
	position: relative;
	min-width: 100%;
	border-top: 1px solid rgba(0, 0, 0, 0.5);
}

.row.title {
	height: 30px;
	line-height: 30px;
	color: #acdbf5;
	text-align: left;
	background: rgb(20, 50, 73) linear-gradient( to bottom, rgba(42, 71, 94, 1.0) 5%, rgba(42, 71, 94, 0.0) 70%);
	position: sticky;
	top: 0;
	z-index: 2;
}

.row.title .cell {
	height: 30px;
	line-height: 30px;
}

.row.title .cell.cover,
.row.title .cell.info {
	text-align: center;
}

.row.title .cover {
	background: rgb(20, 50, 73) linear-gradient( to bottom, rgba(42, 71, 94, 1.0) 5%, rgba(42, 71, 94, 0.0) 70%);
}

.row.title:hover {
	background: #143249 linear-gradient(180deg, #2a475e 5%, rgba(42, 71, 94, 0) 70%);
}

.row:hover {
	/*background: linear-gradient( to right, #c6e6f8 5%, #95bcd3 95%);*/
	background: rgba( 0, 0, 0, 0.4);
}


.cell {
	display: inline-block;
	height: 80px;
	vertical-align: top;
	box-sizing: border-box;
	margin-right: 10px;
	font-size: 14px;
}

.cell.country {
	line-height: 80px;
	height: 80px;
	width: 70px;
	text-align: right;
	padding-right: 5px;
	margin-right: 5px;
	color: #acdbf5;
}

.cell.country.l {
	background-color: rgba(185, 246, 202, 0.9);
	color: #000;
}

.cell.country.h {
	background-color: rgba(245, 198, 203, 0.9);
	color: #000;
}


.cover {
	text-align: center;
	width: 80px;
	height: 80px;
	position: sticky;
	left: 0;
	top: 0;
	background: rgb(20, 50, 73) linear-gradient( to bottom, rgba(42, 71, 94, 1.0) 5%, rgba(42, 71, 94, 0.0) 70%);
	z-index: 1;
}

.cover img {
	max-width: 100%;
	max-height: 100%;
}

.info {
	width: 420px;
}

.info .detail {
	padding-top: 7px;
	width: 220px;
	display: inline-block;
	height: 80px;
	box-sizing: border-box;
}

.info .name {
	width: 220px;
	height: 34px;
	line-height: 16px;
	font-size: 14px;
	color: #c7d5e0;
	transition: color 0.25s;
	overflow: auto;
	white-space: normal;
	display: flex;
	align-items: center;
	align-content: flex-start;
	vertical-align: top;
	cursor: pointer;


	/*text-overflow: ellipsis;*/
	/*display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	white-space: normal;*/
}

.info .tag,
.info .release {
	font-size: 12px;
	line-height: 16px;
	color: #384959;
	height: 16px;
	overflow: hidden;
	white-space: normal;
}

.info .release.comingsoon {
	background: #BF360C;
	color: #FFAB91;
	display: inline-block;
}

.money {
	float: right;
}

.info .saleWrap {
	height: 80px;
	display: table-cell;
	vertical-align: middle;
	padding-right: 10px;
}


.info .sale {
	background: #4C6B22;
	color: #a4d007;
	font-size: 14px;
	padding: 2px 4px;
}

.info .priceWrap {
	font-size: 14px;
	width: 140px;
	height: 80px;
	display: table-cell;
	vertical-align: middle;
	text-align: left;
	line-height: 18px;
	color: #acdbf5;
}

.info .priceWrap.na {
	text-align: center;
}

.info .priceWrap i {
	font-size: 14px;
	vertical-align: middle;
}

.info .priceWrap .price {
	float: right;
}

.info .hisPrice {
	opacity: 0.6;
}
</style>
