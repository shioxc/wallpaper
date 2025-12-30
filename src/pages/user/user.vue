<template>
	<view class="userLayout pageBg">
		<view :style="{height: getNavBarHeight()+'px'}"></view>
		<view class="userInfo">
			<view class="avatar">
				<image src="/static/images/xxmLogo.png" mode="aspectFill"></image>
			</view>
			<view class="ip">{{userInfo.IP}}</view>
			<view class="address">来自: {{userInfo.address?.province||userInfo.address?.country}}</view>
		</view>
		<view class="section">
			<view class="list">
				<block v-for="(item,index) in detailList1" :key="index">
					<detail-row :icon="item.icon" :name="item.name" 
					:showNumber="item.showNumber" :number="item.number">
					</detail-row>
				</block>
			</view>
		</view>
		
		<view class="section">
			<view class="list">
				<block v-for="(item,index) in detailList2" :key="index">
					<detail-row :icon="item.icon" :name="item.name"
					:showNumber="item.showNumber" :number="item.number"></detail-row>
				</block>
			</view>
		</view>
	</view>
</template>

<script setup>
	import{ref} from 'vue';
	import {getStatusBarheight,getTitleBarHeight} from '@/utils/system.js';
	import { apiGetUserInfo } from '@/apis/apis';
	import {onLoad} from '@dcloudio/uni-app';
	const userInfo = ref({
	  IP: '',
	  address: {
	    province: '',
	    country: ''
	  }
	})
	onLoad(()=>{
		getUserInfo();
	})
	function getNavBarHeight()
	{
		// #ifdef H5
		return 0;
		// #endif
		return getTitleBarHeight()+getStatusBarheight();
	}
	const detailList1 = ref([
		{icon:'download-filled',name:'我的下载',number:0,showNumber:true},
		{icon:'star-filled',name:'我的评分',number:0,showNumber:true},
		{icon:'chatboxes-filled',name:'联系客服',number:0,showNumber:false},	
	])
	const detailList2 = ref([
		{icon:'notification-filled',name:'订阅更新',number:0,showNumber:false},
		{icon:'flag-filled',name:'常见问题',number:0,showNumber:false},
	])
	function getUserInfo()
	{
		apiGetUserInfo().then(res=>{
			const data = res.data || {}

			userInfo.value = {
			      IP: data.IP || '',
			      address: data.address || {
			        province: '',
			        country: ''
			      },
			      scoreSize: data.scoreSize || 0,
			      downloadSize: data.downloadSize || 0
			    }

			detailList1.value[1].number = userInfo.value.scoreSize
			detailList1.value[0].number = userInfo.value.downloadSize;
		});
	}
</script>

<style lang="scss" scoped>
	.userLayout
	{
		.userInfo
		{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 50rpx 0;
			.avatar
			{
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				overflow: hidden;
				image
				{
					width: 100%;
					height: 100%;
					
				}
			}
			.ip
			{
				font-size: 44rpx;
				margin: 20rpx 0 5rpx;
				color: #333;
			}
			.address
			{
				font-size: 28rpx;
				color: #aaa;
			}
		}
		.section
		{
			width: 690rpx;
			margin: 50rpx auto;
			border: 1px solid #eee;
			border-radius: 10rpx;
			box-shadow: 0 0 30rpx rgba(0,0,0,0.05);
		}
	}
</style>
