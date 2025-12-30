<template>
	<view class="classLayout pageBg">
		<custom-nav-bar title="分类"></custom-nav-bar>
		<view class="classify">
			<block v-for="item in classifyList" :key="item._id">
				<theme-item :item="item"></theme-item>
			</block>
		</view>
	</view>
</template>

<script setup>
	import{apiGetClassify} from '@/apis/apis.js';
	import{onLoad} from '@dcloudio/uni-app';
	import {ref} from 'vue'
	const classifyList = ref([]);
	onLoad(()=>{
		getClassify();
	});
	async function getClassify()
	{
		try
		{
			const res = await apiGetClassify({
				pageSize:100
			});
			classifyList.value = res.data;
		}
		catch(err)
		{
			classifyList.value = [];
		}
	}
</script>

<style lang="scss" scoped>
	.classLayout
	{
		.classify
		{
			padding:30rpx;
			display: grid;
			gap: 15rpx;
			grid-template-columns: repeat(3,1fr);
		}
	}
</style>
