<template>
	<view class="classlist">
		<view class="loadingLayout" v-if="!classList.length&&hasmore">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view class="content">
			<block v-for="item in classList" :key="item._id">
				<navigator :url="`/pages/preview/preview?id=${item._id}`" class="item">
					<image :src="item.smallPicurl" mode="aspectFill"></image>
				</navigator>
			</block>
		</view>
		<view class="loadingLayout" v-if="classList.length || !hasmore">
			<uni-load-more :status="hasmore?'loading':'noMore'"></uni-load-more>
		</view>
		<view class="safe-area-inset-bottom"></view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { apiGetClassList, apiGetHistoryList } from '@/apis/apis';
import{onLoad,onReachBottom,onShareAppMessage} from '@dcloudio/uni-app';
	const classList = ref([]);
	const hasmore = ref(true);
	const loading = ref(false);
	let queryParams = {
		pageNum:1,
		pageSize:12
	};
	
	let pageNamer;
	onLoad((e)=>{
		const {
			id=null,
			name=null,
			type=null
		} = e;
		if(type)queryParams.type=type;
		if(id)queryParams.classid = id;
		pageNamer = name;
		getClassList();
		uni.setNavigationBarTitle({
			title:name
		})
	});
	onReachBottom(()=>{
		if(!loading.value&&hasmore.value)
		{
			queryParams.pageNum++;
			getClassList();
		}
	})
	async function getClassList()
	{
		try{
			loading.value = true;
			let res;
			if(queryParams.classid)res = await apiGetClassList(queryParams);
			if(queryParams.type)res = await apiGetHistoryList(queryParams);
			const list = res.data||[];
			if(list.length < 12)
			{
				hasmore.value = false;
				
			}
			classList.value.push(...res.data);
			uni.setStorageSync("storageClassList",classList.value);
		}
		catch(err)
		{
			classList.value = [];
		}
		finally
		{
			loading.value = false;
		}
	}
	onShareAppMessage((e)=>{
		return{
			title:"分类列表",
			path:"/pages/classlist/classlist?id="+queryParams.classid+"&name="+pageNamer
		}
	});
</script>

<style lang="scss" scoped>
	.classlist
	{
		.content
		{
			display: grid;
			grid-template-columns: repeat(3,1fr);
			gap:5rpx;
			padding:5rpx;
			.item
			{
				height: 440rpx;
				image
				{
					width:100%;
					height:100%;
					display: block;
				}
			}
		}
	}
</style>