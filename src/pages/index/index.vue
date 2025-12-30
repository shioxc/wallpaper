<template>
	<view class="homeLayout pageBg">
		<custom-nav-bar title="推荐"></custom-nav-bar>
		<view class="banner">
			<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" 
			indicator-active-color="#fff" autoplay>
				<block v-for="item in bannerList" :key="item._id">
					<swiper-item>
						<navigator v-if="item.target === 'miniProgram'" :url="item.url"  
						class="like"
						target="miniProgram"
						:app-id="item.appid">
							<image :src="item.picurl" mode="aspectFill"></image>
						</navigator>
						<navigator v-else :url="`/pages/classlist/classlist?${item.url}`"
						class="like">
							<image :src="item.picurl" mode="aspectFill"></image>
						</navigator>
					</swiper-item>
				</block>
			</swiper>
		</view>
		
		<view class="notice">
			<view class="left">
				<uni-icons type="sound-filled" size="20" color="#28b389"></uni-icons>
				<text class="text">公告</text>
			</view>
			<view class="center">
				<swiper vertical autoplay interval="1500" duration="300" circular>
					<block v-for="item in noticeList" :key = item._id>
						<swiper-item>
							<navigator :url="`/pages/notice/detail?id=${item._id}`">{{item.title}}</navigator>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<view class="right">
				<uni-icons type="right" size="16" color="#333"></uni-icons>
			</view>
		</view>
		
		<view class="select">
			<common-title>
				<template #name>每日推荐</template>
				<template #custom>
					<view class="date">
						<uni-icons type="calendar" size="18" color="#28b389"></uni-icons>
						<view class="text">
							<uni-dateformat :date="now" format="dd日" ></uni-dateformat>
						</view>
					</view>
				</template>
			</common-title>
			<view class="content">
				<scroll-view direction="horizontal" scroll-x>
					<block v-for="item in randomList" :key="item._id">
						<view class="box" @click="goPreview(item._id)">
							<image :src="item.smallPicurl" mode="aspectFill"></image>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
		
		<view class="theme">
			<common-title>
				<template #name>专题精选</template>
				<template #custom>
					<navigator url="" class="more">More+</navigator>
				</template>
			</common-title>
			<view class="content">
				<block v-for="item in classifyList" :key="item._id">
					<theme-item :item = "item"></theme-item>
				</block>
				<theme-item :isMore="true"></theme-item>
			</view>
		</view>
		
	</view>
</template>

<script setup>
import { ref,computed, onMounted, onUnmounted } from 'vue';
import {onLoad,onShow,onHide,onUnload,onShareAppMessage} from '@dcloudio/uni-app';
import { apiGetBanner,apiGetClassify,apiGetDayRandom,apiGetNotice } from '../../apis/apis';
	const now = ref(new Date());
	const randomList = ref([]);
	const bannerList = ref([]);
	const noticeList = ref([]);
	const classifyList = ref([]);
	let timer = null;
	onShow(()=>
	{
		timer = setInterval(()=>{
			now.value = new Date();
		},300000);
	});
	onHide(()=>{
		clearInterval(timer);
	});
	onUnload(()=>{
		clearInterval(timer);
	});
	onLoad(()=>
	{
		getDayRandom();
		getBanner();
		getNotice();
		getClassify();
	});
	const getDayRandom = async ()=>
	{
		try
		{
			const res=await apiGetDayRandom();
			randomList.value = res.data;
		}
		catch(err)
		{
			randomList.value = [];
		}
	}
	async function getBanner()
	{
		try
		{
			const res=await apiGetBanner();
			bannerList.value = res.data;
		}
		catch(err)
		{
			bannerList.value = [];
		}
	}
	async function getNotice()
	{
		try
		{
			const res=await apiGetNotice();
			noticeList.value = res.data;
		}
		catch(err)
		{
			noticeList.value = [];
		}

	}
	async function getClassify()
	{
		try
		{
			const res = await apiGetClassify({select:true});
			classifyList.value = res.data;
		}
		catch(err)
		{
			classifyList.value = [];
		}
	}
	onShareAppMessage((e)=>{
		return{
			title:"壁纸",
			path:"/pages/index/index"
		}
	});
	function goPreview(id)
	{
		uni.setStorageSync("storageClassList",randomList.value);
		uni.navigateTo({
			url:"/pages/preview/preview?id="+id
		})
	}
	
</script>

<style lang="scss" scoped>
	.homeLayout
	{
		.banner
		{
			width: 750rpx;
			padding: 30rpx 0;
			swiper
			{
				width: 750rpx;
				height: 340rpx;
				&-item
				{
					width: 100%;
					height: 100%;
					padding: 0 30rpx;
					.like
					{
						width: 100%;
						height: 100%;
						image
						{
							width: 100%;
							height: 100%;
							border-radius: 10rpx;
						}
					}
				}
			}
		}
		.notice
		{
			width: 690rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: #f9f9f9;
			margin: 0 auto;
			display: flex;
			border-radius: 80rpx;
			.left
			{
				width:140rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				.text
				{
					color: $brand-theme-color;
					font-weight: 600;
					font-size: 28rpx;
				}
			}
			.center
			{
				flex: 1;
				swiper
				{
					height: 100%;
					&-item
					{
						height: 100%;
						font-size: 30rpx;
						color: #666;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
			.right
			{
				width: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		.select
		{
			padding-top: 50rpx;
			.date
			{
				color: #28b389;
				display: flex;
				align-items: center;
				.text
				{
					margin-left: 5rpx;
				}
			}
			.content
			{
				width:720rpx;
				margin-left: 30rpx;
				margin-top: 30rpx;
				scroll-view
				{
					white-space: nowrap;
					.box
					{
						navigator
						{
							height: 100%;
						}
						width: 220rpx;
						height: 430rpx;
						display: inline-block;
						margin-right: 15rpx;
						image
						{
							width:100%;
							height:100%;
							border-radius: 10rpx;
						}
					}
					.box:last-child{margin-right: 30rpx;}
				}
			}
		}
		.theme
		{
			padding: 50rpx 0;
			.more
			{
				font-size: 32rpx;
				color: #886;
			}
			.content
			{
				margin-top: 30rpx;
				padding: 0 30rpx;
				display: grid;
				gap:15rpx;
				grid-template-columns: repeat(3,1fr);
			}
		}
	}
</style>
