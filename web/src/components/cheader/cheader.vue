<template>
<div id="cheader">
	<span>Switch 游戏这么贵我知道</span>
	<div class="type">
		<!-- close -->
		<button v-show="state.showType=='list'" class="mdui-btn mdui-ripple mdui-color-theme-accent country" @click="state.cry_list_show = true">
			<i class="mdui-icon material-icons">&#xe153;</i>
		</button>
		<!-- type -->
		<button v-show="state.showType=='list'" @click="state.showType='grid'" class="mdui-btn mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">&#xe871;</i></button>
		<button v-show="state.showType=='grid'" @click="state.showType='list'" class="mdui-btn mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">&#xe896;</i></button>
		<button class="mdui-fab mdui-fab-mini mdui-ripple mdui-color-teal" @click="state.ranking_show=true"><i class="mdui-icon material-icons">equalizer</i></button>
	</div>
</div>
</template>
<script>
export default {
	name: "cheader",
	props: {
		state: Object,
		games: Array
	},
	data: () => ({})
}
</script>
<style  scoped>
#cheader {
	background: #171a21;
	color: #b8b6b4;
	padding: 0 40px;
	height: 50px;
	line-height: 50px;
	position: fixed;
	top: 0;
	left: 0;
	width: calc(100vw - 80px);
	z-index: 999;
}

#cheader button {
	min-width: 40px;
}

@media screen and (max-width: 750px) {
	#cheader {
		padding: 0 10px;
		width: calc(100vw - 20px);
	}
}

.type {
	float: right;
}
</style>
