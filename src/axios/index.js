import JsonP from 'jsonp';
import { Modal } from 'antd';
import axios from 'axios';
import utils from '../utils/utils';
import AV from 'leancloud-storage';
export default class Axios {
    
    static requestList(_this,url,params,isServer,sessionToken){
        var data = {
            params:params,
        }
        this.ajax({
            url,
            data,
            isServer,
            sessionToken
        }).then((data)=>{
            if(data || data.results){
                let list = (isServer?data.results:data.results.item_list).map((item,index) =>{
                    item.key = index;
                    return item;
                })
                _this.setState({
                    list,
                    // pagination: utils.pagination(data, (current)=>{
                    //     _this.params.page = current;
                    //     _this.requestList()
                    // })
                }) 
                console.log("list")
                console.log(list)
            }
        })

    }
    
    static jsonp(options){
        return new Promise((resolve,reject)=>{
            JsonP(options.url,{
              param:'callback'  
            },function(err,response){
                //to-do
                if(response.status === 'success'){
                    resolve(response);
                }else{
                    reject(response.messsage);
                }
            })
        })
    }

    static ajax(options){
        let loading;
        let baseApi;
        let beforeSend;
        if(options.data && options.data.isShowLoading !== false){
            loading = document.getElementById("ajaxLoading");
            loading.style.display = "block";
        }
        if(options.isServer){
            //服务端数据
            baseApi= 'https://o2sr0ojd.api.lncld.net/1.1/classes';
        }else{
            //Mock 数据 
            baseApi= 'https://easy-mock.com/mock/5c7908d505b5281aae96e696/mockapi';
        }
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:baseApi,
                timeout:5000,     //获取数据超过5秒报错
                headers: {
                    'X-LC-Id': options.isServer?'O2sR0ojdz2eP811aIwtlDUVH-gzGzoHsz':"",
                    'X-LC-Key': options.isServer?'vvtzU9hVqx8Jd8xiCIu4Ere0':"",
                    'X-LC-Session': options.sessionToken || ""
                },
                params:(options.data && options.data.params) || ''
            }).then((response)=>{
                if(options.data && options.data.isShowLoading !== false){
                    loading = document.getElementById("ajaxLoading");
                    loading.style.display = "none";
                }
                if(response.status == '200'){
                    let res = response.data;
                    resolve(res);
                }else{
                    reject(response.data)
                }
            }).catch(error => {
                //超时之后在这里捕抓错误信息.
                if (error.response) {
                    console.log(error);
                    console.log(error.response);
                    if(options.data && options.data.isShowLoading !== false){
                        loading = document.getElementById("ajaxLoading");
                        loading.style.display = "none";
                    }
                    if(error.response.status == 403){
                        Modal.info({
                            title:error.response.status,
                            content:`请求发生: 权限不足`
                        })
                    }else{
                        Modal.info({
                            title:error.response.status,
                            content:`请求发生: ${error.response.data.error}`
                        })
                    }
                    
                } else if (error.request) {
                    console.log(error.request)
                    console.log('error.request')
                    if(error.request.readyState == 4 && error.request.status == 0){
                        //我在这里重新请求
                        if(options.data && options.data.isShowLoading !== false){
                            loading = document.getElementById("ajaxLoading");
                            loading.style.display = "none";
                        }
                        Modal.info({
                            title:"提示",
                            content:"请求超时"
                        })
                    }
                } else {
                    console.log('Error', error.message);
                }
               
            });
        })
    }
}