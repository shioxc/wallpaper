<template>
	<view>
		<view class="row">
			<view class="left">
				<uni-icons :type="icon" size="20" color="#28b389"></uni-icons>
				<view class="text">{{name}}</view>
			</view>
			<view class="right">
				<template v-if="showNumber">
					<view class="text">{{number}}</view>
				</template>
				<uni-icons type="right" size="15" color="#aaa"></uni-icons>
			</view>
			<navigator url="/pages/classlist/classlist?name=我的下载&type=download" class="overlay" v-if="name==='我的下载'"></navigator>
			<navigator url="/pages/classlist/classlist?name=我的评分&type=score" class="overlay" v-if="name==='我的评分'"></navigator>
			<button v-if="name==='联系客服'" open-type="contact" class="overlay">联系客服</button>
			<navigator url="/pages/notice/detail?id=6536358ce0ec19c8d67fbe82" class="overlay" v-if="name==='常见问题'"></navigator>
			<navigator url="/pages/notice/detail?id=653507c6466d417a3718e94b" class="overlay" v-if="name==='订阅更新'"></navigator>
		</view>
	</view>
</template>

<script setup>
	defineProps({
		icon:
		{
			type: String,
			default: ""
		},
		name:
		{
			type: String,
			default: ""
		},
		showNumber:
		{
			type:Boolean,
			default: false
		},
		number:
		{
			type:Number,
			default: 0
		}
	})
</script>

<style lang="scss" scoped>
	.row
	{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		height: 100rpx;
		border-bottom: 1px solid #eee;
		position: relative;
		transition:background 0.15s;
		background: white;
		&:active
		{
			background: #aaa;
		}
		&:last-child
		{
			border-bottom: 0;
		}
		.left
		{
			display: flex;
			align-items: center;
			.text
			{
				padding-left: 20rpx;
				color: #666;
			}
		}
		.right
		{
			display: flex;
			align-items: center;
			.text
			{
				font-size: 28rpx;
				color: #aaa;
			}
		}
		.overlay
		{
			position: absolute;
			inset: 0;
			font-size: 0;
			opacity: 0;
		}
	}

</style>