const SYSTEM_INFO = uni.getSystemInfoSync();
export const getStatusBarheight = ()=>SYSTEM_INFO.statusBarHeight||15;
export const getTitleBarHeight = ()=>
{
	if(uni.getMenuButtonBoundingClientRect())
	{
		const {top,height} = uni.getMenuButtonBoundingClientRect();
		const titleBarheight = height+(top-getStatusBarheight())*2;
		return titleBarheight;
	}
	else
	{
		return 40;
	}
};