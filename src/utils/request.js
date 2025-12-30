
const BASE_URL = "https://tea.qingnian8.com/api/bizhi";
const ACCESSKEY = "101305";

export function request(config={})
{
	let
	{
		url,
		method="GET",
		header={},
		data={}
	} = config;
	url = BASE_URL+url;
	header['access-key'] = ACCESSKEY;
	return new Promise((resolve,reject)=>{
		uni.request({
			url,
			header,
			data,
			method,
			success: res =>{
				if(Number(res.data.errCode) === 0)
				{
					resolve(res.data);
				}
				else
				{
					reject(res.data);
				}
			},
			fail: err=>{
				reject(err.data);
			}
		})
	});
}