import Axios from "axios"
import {DOMAIN,TOKEN} from '../util/settings/config'

export class baseService {
    //put json về phía backend
    put = (url,model) => {
        return  Axios({
            url:`${DOMAIN}${url}`,
            method:'PUT',
            data:model,
            headers: {'Authorization': 'Bearer ' + localStorage.getItem(TOKEN)} //JWT
        }) 
    }

    post = (url,model) => {
        return Axios({
            url:`${DOMAIN}${url}`,
            method:'POST',
            data:model,
            headers: {'Authorization': 'Bearer ' + localStorage.getItem(TOKEN)} //JWT
        }) 
    }

    // upload cap nhat hinh trong phim 
    post0 = (url,form) => {
        return Axios({
            url:`${DOMAIN}${url}`,
            method:'POST',
            data:form,
            headers: {
                'Content-Type': `multipart/form-data`,
                'Authorization': 'Bearer ' + localStorage.getItem(TOKEN)
            },
        }).then((res) =>{
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

    

    get = (url) => {
        return Axios({
            url:`${DOMAIN}${url}`,
            method:'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem(TOKEN)} //token yêu cầu từ backend chứng minh user đã đăng nhập rồi
        })
    }

    delete = (url) => {
        return Axios({
            url:`${DOMAIN}${url}`,
            method:'DELETE',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem(TOKEN)} //token yêu cầu từ backend chứng minh user đã đăng nhập rồi
        })
    }
}