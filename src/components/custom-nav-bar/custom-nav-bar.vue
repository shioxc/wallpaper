<template>
	<view class="layout">
		<view class="navbar">
			<view class="statusBar" :style="{height:statusHeight+'px'}"></view>
			<view class="titleBar" :style="{height:titleHeight+'px'}">
				<view class="title">{{title}}</view>
				<navigator url="/pages/search/search" class="search">
					<uni-icons class="icon" type="search" size="18" color="#888"></uni-icons>
					<text class="text">搜索</text>
				</navigator>
			</view>
		</view>
		
		<view class="fill" :style="{height:titleHeight+statusHeight+'px'}">
			
		</view>
	</view>
</template>

<script setup>
	import {computed, ref} from 'vue';
	import {getStatusBarheight,getTitleBarHeight} from '@/utils/system.js';
	defineProps({
		title:
		{
			type:String,
			default:"壁纸"
		}
	})
	
	const titleHeight = computed(()=>getTitleBarHeight());
	const statusHeight = computed(()=>getStatusBarheight());
</script>

<style lang="scss" scoped>
	.layout
	{
		.navbar
		{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 100;
			background:
			linear-gradient(to bottom,transparent ,#fff 400rpx),
			linear-gradient(to right,#beecd8,#F4E2D8);
			.statusBar
			{
			}
			.titleBar
			{
				display: flex;
				padding: 0 30rpx;
				align-items: center;
				.title
				{
					font-size: 35rpx;
					font-weight: 700;
					color: #000;
				}
				.search
				{
					width: 220rpx;
					height: 50rpx;
					border-radius: 60rpx;
					background: rgba(255,255,255,0.4);
					border: 1px solid #fff;
					color: #999;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					margin-left: 30rpx;
					.icon
					{
						margin-left: 5rpx;	
					}
					.text
					{
						padding-left: 10rpx;
					}
				}
			}
		}
		.fill
		{
			
		}
	}
</style>