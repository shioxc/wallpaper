<template>
	<view class="searchLayout">
		<view class="search">
			<uni-search-bar 
			@confirm="onSearch"
			@cancel="onClear"
			@clear="onClear"
			focus 
			placeholder="搜索"
			v-model="queryParams.keyword">
			</uni-search-bar>
		</view>
		
		
		<view>
			<view class="history" v-if="historySearch.length">
				<view class="topTitle">
					<view class="text">最近搜索</view>
					<view class="icon" @click="removeHistory">
						<uni-icons type="trash" size="25"></uni-icons>
					</view>
				</view>
				<view class="tabs">
					<view class="tab" v-for="tab in historySearch" :key="tab" @click="clickTab(tab)">{{tab}}</view>		
				</view>
			</view>
			
			<view class="recommend">
				<view class="topTitle">
					<view class="text">热门搜索</view>				
				</view>
				<view class="tabs">				
					<view class="tab" v-for="tab in recommendList" :key="tab" @click="clickTab(tab)">{{tab}}</view>
				</view>
			</view>
		</view>
		
		
		<view class="noSearch" v-if="!classList.length">
			<uv-empty mode="search" icon="/common/images/han.png"></uv-empty>
		</view>
		
		
		<view>
			<view class="list">
				<navigator :url="`/pages/preview/preview?id=${item._id}`"  class="item" 
				v-for="item in classList" :key="item._id">				
					<image :src="item.smallPicurl" mode="aspectFill"></image>				
				</navigator>
			</view>		
			<view class="loadingLayout" v-if="!hasmore || classList.length"><uni-load-more :status="!hasmore?'noMore':'loading'"/></view>
		</view>
		
		
	</view>
</template>

<script setup>
import {ref, watch} from "vue";
import {onLoad,onUnload,onReachBottom} from "@dcloudio/uni-app";
import UvEmpty from '@/uni_modules/uv-empty/components/uv-empty/uv-empty.vue'
import { apiSearch } from "../../apis/apis";
//查询参数
const queryParams = ref({	
	pageNum:1,
	pageSize:20,
	keyword:""
})

//搜索历史词
const historySearch = ref(uni.getStorageSync("historySearch")||[]);

//热门搜索词
const recommendList = ref(["美女","帅哥","宠物","卡通"]);

//没有更多
const noData = ref(false);
//没有搜索结果
const noSearch = ref(false);

//搜索结果列表
const classList = ref([]);
const hasmore = ref(true);
const loading = ref(false);
watch(()=>queryParams.value.keyword,(newValue,oldValue)=>{
	classList.value = [];
	hasmore.value = true;
	loading.value = false;
	queryParams.value.pageNum=1;
})
//点击搜索
const onSearch = ()=>{
	if(!queryParams.value.keyword.length)return;
	
	historySearch.value=[...new Set([queryParams.value.keyword,...historySearch.value])].slice(0,10);
	searchData();
	uni.setStorageSync("historySearch",historySearch.value);
}

//点击清除按钮
const onClear = ()=>{
	
}



//点击标签进行搜索
const clickTab = (value)=>{
	queryParams.value.keyword = value;
	onSearch();
}


//点击清空搜索记录
const removeHistory = ()=>{
	uni.showModal({
		title:"是否清空历史搜索？",
		success:res=>{
			if(res.confirm){
				uni.removeStorageSync("historySearch");
				historySearch.value = [];
			}
			
		}
	})
}
async function searchData()
{
	try
	{
		uni.showLoading({
			mask:true
		});
		const res = await apiSearch(queryParams.value);
		const list = res.data||[];
		if(list.length === 0)
		{
			hasmore.value = false;
			return;
		}
		classList.value.push(...res.data);
		uni.setStorageSync("storageClassList",classList.value);
	}
	finally
	{
		loading.value = false;
		uni.hideLoading();
	}
}

//触底加载更多
onReachBottom(()=>{
	queryParams.value.pageNum++;
	searchData();
})

//关闭有页面
onUnload(()=>{
	uni.removeStorageSync("storageClassList");
})


</script>

<style lang="scss" scoped>
.searchLayout{
	.search{
		padding:0 10rpx;
	}
	.topTitle{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color:#999;
	}
	.history{
		padding:30rpx;		
	}
	.recommend{
		padding:30rpx;
	}
	.tabs{
		display: flex;		
		align-items: center;
		flex-wrap: wrap;
		padding-top:20rpx;
		.tab{
			background: #F4F4F4;
			font-size: 28rpx;
			color:#333;
			padding:10rpx 28rpx;
			border-radius: 50rpx;
			margin-right: 20rpx;
			margin-top: 20rpx;
		}
	}	
	.list{
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap: 5rpx;
		padding:20rpx 5rpx;		
		.item{
			height: 440rpx;
			image{
				width: 100%;
				height: 100%;
				display: block;
			}			
		}		
	}
}
</style>
