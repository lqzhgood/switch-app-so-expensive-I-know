<template>
<div id="ranking">
	<button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple close" @click="state.ranking_show=false"><i class="mdui-icon material-icons">close</i></button>
	<h3 class="title">价格表 - <span v-if="key=='l'">最便宜的国家</span><span v-if="key=='h'">最贵的国家</span></h3>
	<div class="wrap">
		<div class="skillbar clearfix list-complete-item" v-for="v in list" :key="null">
			<div class="skillbar-title" style="background: #2980b9;">
				<span v-html="v.cHtml" :title="v.country"></span>
			</div>
			<div class="content">
				<div class="skillbar-bar" style="background: #3498db;" :style="{'width':v.width}"></div>
				<div class="skill-bar-percent">{{v.count}}</div>
			</div>
		</div>
	</div>
	<div class="sort">
		<button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple" @click="key='h'" v-if="key=='l'">
            <i class="mdui-icon material-icons">arrow_upward</i>
        </button>
		<button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple" @click="key='l'" v-if="key=='h'">
            <i class="mdui-icon material-icons">arrow_downward</i>
        </button>
	</div>

</div>
</template>
<script>
export default {
	name: "ranking",
	props: {
		l_des: Array,
		h_des: Array,
		state: Object
	},
	data: () => ({
		key: 'l',
		color: [{}]
	}),
	computed: {
		list() {
			switch (this.key) {
			case 'l':
				return this.l_des;
				break;
			case 'h':
				return this.h_des;
				break;
			}
		}
	},
	methods: {
		shuffle: function () {
			this.list = _.shuffle(this.list)
		}
	}
}
</script>
<style scoped>
#ranking {
	position: fixed;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	background: #fff;
	z-index: 99999;
}

.title {
	width: 100%;
	text-align: center;
	margin: 10px 0;
}

.close {
	position: fixed;
	right: 16px;
	top: 16px;
	background-color: #ff4081!important;
	color: #fff;
	box-shadow: 0 0 12px #000000;
	z-index: 100000;
}

.sort {
	position: fixed;
	right: 16px;
	bottom: 16px;
	z-index: 100000;
}

.sort button {
	background-color: #009688!important;
	color: #fff;
	box-shadow: 0 0 12px #000000;
}

.wrap {
	padding: 0 10px;
	box-sizing: border-box;
	font-family: 'Ubuntu', sans-serif;
	max-width: 960px;
	width: 100%;
	height: 90%;
	margin: 20px auto;
	overflow: auto;
}

.wrap p {
	color: #525252;
	font-size: 12px;
}

.skillbar {
	position: relative;
	display: block;
	margin-bottom: 15px;
	width: 100%;
	background: #eee;
	height: 35px;
	border-radius: 3px;
	-moz-border-radius: 3px;
	-webkit-border-radius: 3px;
	-webkit-transition: 0.4s linear;
	-moz-transition: 0.4s linear;
	-ms-transition: 0.4s linear;
	-o-transition: 0.4s linear;
	transition: 0.4s linear;
	-webkit-transition-property: width, background-color;
	-moz-transition-property: width, background-color;
	-ms-transition-property: width, background-color;
	-o-transition-property: width, background-color;
	transition-property: width, background-color;
}

.skillbar-title {
	position: absolute;
	top: 0;
	left: 0;
	width: 110px;
	font-weight: bold;
	font-size: 13px;
	color: #ffffff;
	background: #6adcfa;
	-webkit-border-top-left-radius: 3px;
	-webkit-border-bottom-left-radius: 4px;
	-moz-border-radius-topleft: 3px;
	-moz-border-radius-bottomleft: 3px;
	border-top-left-radius: 3px;
	border-bottom-left-radius: 3px;
}

.content {
	margin-left: 110px;
}

.skillbar-title span {
	display: block;
	background: rgba(0, 0, 0, 0.1);
	padding: 0 20px;
	height: 35px;
	line-height: 35px;
	-webkit-border-top-left-radius: 3px;
	-webkit-border-bottom-left-radius: 3px;
	-moz-border-radius-topleft: 3px;
	-moz-border-radius-bottomleft: 3px;
	border-top-left-radius: 3px;
	border-bottom-left-radius: 3px;
	text-align: right;
}

.skillbar-bar {
	height: 35px;
	width: 0px;
	background: #6adcfa;
	border-radius: 3px;
	-moz-border-radius: 3px;
	-webkit-border-radius: 3px;
	transition: all 1s;
}

.skill-bar-percent {
	position: absolute;
	right: 10px;
	top: 0;
	font-size: 11px;
	height: 35px;
	line-height: 35px;
	color: #ffffff;
	color: rgba(0, 0, 0, 0.4);
}
</style>
