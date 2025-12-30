
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
				console.log(res.data);
				if(Number(res.data.errCode) === 0)
				{
					console.log(1);
					resolve(res.data);
				}
				else
				{
					console.log(2);
					reject(res.data);
				}
			},
			fail: err=>{
				console.log(2);
				reject(err.data);
			}
		})
	});
}