<template>
<div id="card">
	<div class="mdui-container-fluid wrap">
		<div class="mdui-card mdui-shadow-2 card" v-for="v in games" :key="v.name" :title="v.description">
			<div class="sale" v-if="v.sale">-{{Math.round(100-v.sale.sale*100)}}%</div>
			<div class="comingsoon" v-if="new Date().getTime()<=new Date(v.release).getTime()">
				{{fmtData(v.release)}}
			</div>
			<div class="mdui-card-media" v-if="games.length>0">
				<!-- <img class="cover" :src="v.img" :srcset="v.img_srcset" /> -->
				<img class="cover" v-lazy="v.img" />
				<div class="mdui-card-media-covered mdui-card-media-covered-gradient">
					<!-- 卡片的标题和副标题 -->
					<div class="mdui-card-primary" @click="openurl(v.url)" :title="fmtData(v.release)">
						<div class="mdui-card-primary-title">{{v.name}}</div>
					</div>
					<div class="mdui-card-actions mdui-card-actions-stacked" v-if="v.l[0]">
						<p :title="'历史最低 - '+ v.vl.country + ' - ' +v.vl.time" v-if="v.vl">
							<i class="mdui-icon material-icons">&#xe889;</i>
							<span v-html="v.vl.cHtml"></span>
							<span class="price">￥{{v.vl.price}}</span>
						</p>
						<p :title="'当前价格 - '+ v.l[0].country + ' - ' +v.l[0].time">
							<i class="mdui-icon material-icons">&#xe227;</i>
							<span v-html="v.l[0].cHtml"></span>
							<span class="price">￥{{v.l[0].price}}</span>
						</p>
					</div>
					<div class="mdui-card-actions mdui-card-actions-stacked" v-if="!v.l[0]">
						<p class="release mdui-typo"><kbd>Coming Soon</kbd></p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import utils from 'utils/utils.js'
export default {
	name: "card",
	props: {
		games: {
			type: Array,
			required: true,
		}
	},
	data: () => ({

	}),
	methods: {
		openurl(url) {
			window.open(url);
		},
		fmtData(time) {
			return utils.DateFormart('yyyy-MM-dd', new Date(time))
		}
	}
}
</script>
<style>
#card .mdui-card-media-covered-gradient {
	background: linear-gradient(to top, rgba(0, 0, 0, .8), rgba(0, 0, 0, .6), rgba(0, 0, 0, 0));
}

#card .mdui-card-media img {
	display: inline-block;
	width: auto;
	vertical-align: middle;
}
</style>
<style scoped>
.mdui-container-fluid {
	padding: 8px 0 0 8px;
	font-size: 0px;
}

.mdui-card-primary {
	padding: 40px 16px 0px 16px;
	cursor: pointer;
	opacity: 0.8;
}

.mdui-card-primary-title {
	text-align: center;
	font-size: 18px;
	line-height: 20px;

}

.mdui-card-actions p {
	font-size: 14px;
	line-height: 1.2em;
	opacity: 0.7;
}

.mdui-card-primary:hover,
.mdui-card-actions p:hover {
	opacity: 1;
}

.mdui-card-actions p i {
	vertical-align: middle;
	font-size: 16px;
}

.mdui-card-media {
	height: 100%;
}

#card {
	color: #b8b6b4;
}

.wrap {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	transform: translate3d(0, 0, 0);
}

.card {
	flex: 0 0 240px;
	max-width: 240px;
	height: 240px;
	float: left;
	margin: 0 8px 8px 0;
	cursor: default;
	background: url("http://store.akamai.steamstatic.com/public/images/v6/home/background_spotlight.jpg");
	position: relative;
}

.card:hover .cover {
	filter: brightness(100%);
}


.comingsoon,
.sale {
	display: inline-block;
	position: absolute;
	top: 5px;
	z-index: 1;
	font-size: 14px;
	line-height: 18px;
	border-radius: 1px;
	box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.3);
}

.sale {
	right: 0px;
	background: #4C6B22;
	color: #a4d007;
	border-bottom-left-radius: 10px;
	border-top-left-radius: 10px;
	padding-left: 8px;
	padding-right: 4px;
}

.comingsoon {
	left: 0;
	background: #BF360C;
	color: #FFAB91;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	padding-right: 8px;
	padding-right: 4px;
}

.cover {
	max-width: 240px;
	max-height: 240px;
	filter: brightness(80%);
}


.release {
	text-align: center;
}

.price {
	float: right;
}

@media screen and (max-width: 750px) {
	.mdui-container-fluid {
		padding: 4px 0 0 4px;
		font-size: 0px;
	}
	.mdui-card-primary-title {
		font-size: 16px;
		line-height: 20px;
	}

	.card {
		flex: 0 0 calc(50vw - 6px);
		width: calc(50vw - 6px);
		height: calc(50vw - 6px);
		margin: 0 4px 4px 0;
	}
}
</style>
