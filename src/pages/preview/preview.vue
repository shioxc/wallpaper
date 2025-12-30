<template>
	<view class="preview">
		<swiper circular :current="curIndex" @change="swiperChange">
			<block v-for="(item,index) in classlist" :key="item._id">
				<swiper-item>
					<image v-if="renderChecker.has(index)" @click="maskChange" :src="item.picurl" mode="aspectFill"></image>
				</swiper-item>
			</block>
		</swiper>
		
		<view class="mask" v-if="maskState">
			<view class="goBack" :style="{top:getStatusBarheight()+'px'}" @click="goBack">
				<uni-icons type="back" size="20" color="#fff"></uni-icons>
			</view>
			<view class="count">{{curIndex+1}}/{{classlist.length}}</view>
			<view class="time">
				<uni-dateformat :date="now" format="hh:mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="now" format="MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">
				<view class="box" @click="clickInfo">
					<uni-icons type="info" size="28"></uni-icons>
					<text class="text">信息</text>
				</view>
				<view class="box" @click="clickScore">
					<uni-icons type="star" size="28"></uni-icons>
					<text class="text">{{curInfo.score}}分</text>
				</view>
				<view class="box" @click="clickDownload">
					<uni-icons type="download" size="26"></uni-icons>
					<text class="text">下载</text>
				</view>
			</view>
		</view>
		
		<uni-popup ref="infoPopup" type="bottom" :safe-area="false">
			<view class="infoPopup">
				<view class="popHeader">
					<view></view>
					<view class="title">壁纸信息</view>
					<view class="close" @click="clickToclose">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>
				
				<scroll-view scroll-y>
					<view class="content">
						<view class="row">
							<view class="label">壁纸ID:</view>
							<text selectable class="value">{{curInfo._id}}</text>
						</view>
						<!-- <view class="row">
							<view class="label">分类:</view>
							<text selectable class="value class">明星美女</text>
						</view> -->
						<view class="row">
							<view class="label">发布者:</view>
							<text selectable class="value">{{curInfo.nickname}}</text>
						</view>
						<view class="row">
							<view class="label">评分:</view>
							<view class="value rateBox">
								<uni-rate readonly :value="curInfo.score" size="16"></uni-rate>
								<text class="score">{{curInfo.score}}分</text>
							</view>
						</view>
						<view class="row">
							<view class="label">摘要:</view>
							<text selectable class="value">{{curInfo.description}}</text>
						</view>
						<view class="row">
							<view class="label">标签:</view>
							<view class="value tabs">
								<block v-for="item in curInfo.tabs">
									<view class="tab">{{item}}</view>
								</block>
							</view>
						</view>
						<view class="copyright">
							版权声明：本图片来自用户投稿，非商业使用，用于免费学习交流，
							如侵犯了您的权益，您可以拷贝壁纸id至举报平台，邮箱123456789@qq.com，管理将删除侵权壁纸，维护您的权益
						</view>
						<view class="safe-area-inset-bottom"></view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
		<uni-popup ref="scorePopup" :is-mask-click="false">
			<view class="scorePopup">
				<view class="popHeader">
					<view></view>
					<view class="title">壁纸评分</view>
					<view class="close" @click="clickScoreClose">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>
				<view class="content">
					<uni-rate v-model="userScore" @change="onChange" allowHalf :readonly="isScore"></uni-rate>
					<text class="text">{{userScore}}分</text>
				</view>
				<view class="footer">
					<button @click="submitScore" :disabled="!userScore||isScore" type="default" size="mini" plain>确认评分</button>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script setup>
	import {computed, onMounted, onUnmounted, ref} from 'vue';
	import {getStatusBarheight,getTitleBarHeight} from '@/utils/system.js'
	import {onLoad,onShow,onHide,onUnload} from '@dcloudio/uni-app';
	import { apiGetSetupScore,apiWriteDownload } from '@/apis/apis';
	const now = ref(new Date());
	const userScore = ref(0);
	const curId = ref(0);
	const classlist =ref([]);
	const storageClassList=uni.getStorageSync("storageClassList")||[];
	const curIndex = ref(0);
	const isScore = ref(false);
	const curInfo = computed(() => {
		return classlist.value[curIndex.value] || {}
		});
	let timer =null;
	
	//可再加缓存+LRU
	const renderChecker = computed(()=>{
		const len = classlist.value.length;
		if(!len)return new Set();
		const cur = curIndex.value;
		return new Set([
			cur,
			(cur+1)%len,
			(cur-1+len)%len
		])
	})
	
	onLoad((e)=>{
		curId.value = e.id;
		classlist.value=storageClassList.map(item=>{
			return{
				...item,
				picurl:item.smallPicurl.replace("_small.webp",".jpg")
			}
		});
		curIndex.value = classlist.value.findIndex(item=>curId.value === item._id);
	})
	onShow(()=>{
		timer = setInterval(()=>{
			now.value = new Date();
		},10000);
	})
	onHide(()=>{
		clearInterval(timer);
	})
	onUnload(()=>{
		clearInterval(timer);
		uni.removeStorageSync("StorageClassList");	
	})
	
	const maskState = ref(true);
	function maskChange()
	{
		maskState.value = !maskState.value;
	}
	
	const infoPopup = ref(null);
	function clickInfo()
	{
		infoPopup.value.open();
	}
	function clickToclose()
	{
		infoPopup.value.close();
	}
	
	const scorePopup = ref(null);
	function clickScore()
	{
		if(curInfo.value.userScore)
		{
			isScore.value=true;
			userScore.value = curInfo.value.userScore;
		}
		scorePopup.value.open();
	}
	function clickScoreClose()
	{
		scorePopup.value.close();
		userScore.value = 0; 
		isScore.value = false;
	}
	
	async function submitScore()
	{
		const{
			classid,
			_id:wallId
		} = curInfo.value;
		uni.showLoading({
			title:"加载中"
		})
		const res = await apiGetSetupScore({
			classid,
			wallId,
			userScore:userScore.value
		});
		uni.hideLoading();
		if(res.errCode === 0 )
		{
			uni.showToast({
				title:"评分成功",
				icon:"none"
			});
			classlist.value[curIndex.value].userScore = userScore.value;
			uni.setStorageSync("storageClassList",classlist.value);
			clickScoreClose();
		}
	}
	function onChange(e) {
		userScore.value = e.value
	}
	function goBack()
	{
		uni.navigateBack({
			success: () => {
				
			},
			fail: (err) => {
				uni.reLaunch({
					url:"/pages/index/index"
				})
			}
		});
	}
	function swiperChange(e)
	{
		curIndex.value = e.detail.current;
	}
	
	async function clickDownload()
	{
		// #ifdef H5
		uni.showModal({
			content:"保存壁纸",
			showCancel:false
		})
		// #endif
		// #ifndef H5
		try
		{
			uni.showLoading({
				title:"下载中",
				mask:true
			})
			const{
				classid,
				_id:wallId
			} = curInfo.value; 
			const res = await apiWriteDownload({
				classid,
				wallId
			});
			if(res.errCode != 0)return;
			
			uni.getImageInfo({
				src:curInfo.value.picurl,
				success: (res) => {
					uni.saveImageToPhotosAlbum({
						filePath:res.path,
						success:(res)=>{
							uni.showToast({
								title:"保存成功",
								icon:"none"
							})
						}
					})
				},
				fail:err=>{
					if(err.errMsg == 'saveImageToPhotosAlbum:fail cancel')
					{
						uni.showToast({
							title:"保存失败",
							icon:"none"
						})
						return;
					}
				},
				complete: () => {
					uni.hideLoading();
				}
			})
		}catch(err)
		{
			uni.hideLoading();
			uni.showToast({
				title:"保存失败",
				icon:"none"
			})
			return;
			console.log(err.message);
		}
		// #endif
	}
	
</script>

<style lang="scss">
	.preview
	{
		width: 100%;
		height: 100vh;
		position: relative;
		swiper
		{
			width: 100%;
			height: 100%;
			image
			{
				width: 100%;
				height: 100%;
			}
		}
		.mask
		{
			&>view
			{
				position: absolute;
				left:0;
				margin: auto;
				color: #fff;
				right: 0;
				width:fit-content;
			}
			.goBack
			{
				width: 60rpx;
				height: 60rpx;
				background: rgba(0,0, 0, 0.5);
				left: 30rpx;
				margin-left: 0;
				border-radius: 100px;
				top: 0;
				backdrop-filter: blur(10rpx);
				border: 1px solid rgba(255, 255, 255, 0.3);
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.count
			{
				
				top:10vh;
				background: rbga(0,0,0,0.3);
				font-size: 28rpx;
				border-radius: 40rpx;
				padding:8rpx 28rpx;
				margin: auto;
				backdrop-filter: blur(10rpx);
			}
			.time
			{
				font-size: 140rpx;
				top:calc(10vh + 80rpx);
				font-weight: 100;
				line-height: 1em;
				text-shadow: 0 4rpx rgba(0,0,0,0.3);
			}
			.date
			{
				font-size: 34rpx;
				top: calc(10vh + 230rpx);
				text-shadow: 0 2rpx rgba(0,0,0,0.3);
			}
			.footer
			{
				bottom: 10vh;
				width: 65vw;
				height: 120rpx;
				border-radius: 120rpx;
				background: rgba(255,255,255,0.8);
				display: flex;
				color: #000;
				justify-content: space-around;
				align-items: center;
				box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);
				backdrop-filter: blur(20rpx);
				.box
				{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 2rpx 12rpx;
					.text
					{
						font-size: 26rpx;
						color:$text-font-color-2;
					}
				}
			}
		}
		.popHeader
		{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title
			{
				color: $text-font-color-2;
				font-size: 26rpx;
			}
			.close
			{
				padding: 6rpx;
			}
		}
		.infoPopup
		{
			background: #fff;
			padding: 30rpx;
			border-radius: 30rpx 30rpx 0 0;
			overflow: hidden;
			scroll-view
			{
				max-height: 60vh;
				.content
				{
					.row
					{
						display: flex;
						padding: 16rpx 0;
						font-size: 32rpx;
						line-height: 1.7em;
						.label
						{
							color:$text-font-color-3;
							width: 140rpx;
							text-align: right;
							font-size: 30rpx;
							margin:0 20rpx 0 0 ;
						}
						.value
						{
							flex: 1;
							width: 0;
						}
						.rateBox
						{
							display: flex;
							align-items: center;
							.score
							{
								font-size: 26rpx;
								color: $text-font-color-2;
								padding-left: 10rpx;
							}
						}
						.tabs
						{
							display: flex;
							flex-wrap: wrap;
							.tab
							{
								border-radius: 40rpx;
								border: 1px solid $brand-theme-color;
								font-size: 22rpx;
								padding: 10rpx 30rpx;
								line-height: 1em;
								margin: 0 10rpx 10rpx 0;
								color: $brand-theme-color;
							}
						}
						.class
						{
							color:$brand-theme-color;
						}
					}
					.copyright
					{
						font-size: 28rpx;
						background: #F6F6F6;
						padding: 20rpx;
						color: #666;
						border-radius: 10rpx;
						margin: 20rpx 0;
						line-height: 1.6em;
					}
				}
			}
		}
		.scorePopup
		{
			background: #fff;
			padding: 30rpx;
			width: 70vw;
			border-radius: 30rpx;
			.content
			{
				padding: 30rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				.text
				{
					color: #FECA3E;
					padding-left: 10rpx;
					width: 80rpx;
					line-height: 1em;
					text-align: right;
				}
			}
			.footer
			{
				padding: 10rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
	}
</style>