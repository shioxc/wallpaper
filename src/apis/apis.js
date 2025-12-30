import { request } from "../utils/request";

export function apiGetDayRandom()
{
	return request({url:"/randomWall"});
}
export function apiGetBanner()
{
	return request({url:"/homeBanner"});
}
export function apiGetNotice()
{
	return request({url:"/wallNewsList"});
}
export function apiGetClassify(data={})
{
	return request({
		url:"/classify",
		data
		})
}
export function apiGetClassList(data={})
{
	return request({
		url:"/wallList",
		data
	})
}
export function apiGetSetupScore(data={})
{
	return request({
		url:"/setupScore",
		data
	})
}
export function apiWriteDownload(data={})
{
	return request({
		url:"/downloadWall",
		data
	})
}
export function apiGetUserInfo(data={})
{
	return request({
		url:"/userInfo",
		data
	})
}
export function apiGetHistoryList(data={})
{
	return request({
		url:"/userWallList",
		data
	})
}
export function apiGetNoticeDetail(data={})
{
	return request({
		url:"/wallNewsDetail",
		data
	})
}
export function apiSearch(data={})
{
	return request({
		url:"/searchWall",
		data
	})
}