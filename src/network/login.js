import {request} from "./request"

export function getLoginData(LoginData){
	return request({
        method:'post',
				url:'login',
        LoginData
	})
}
