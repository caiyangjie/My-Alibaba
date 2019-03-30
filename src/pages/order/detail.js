import React, { Component } from 'react';
import { Card, Button, Table, Form, Select, Modal, message, DatePicker } from 'antd';
import axios from './../../axios';
import Utils from './../../utils/utils';
import './detail.less';
const FormItem = Form.Item;
const { Option } = Select;
class Detail extends Component {

    constructor(props){
        super(props);

        this.state={}
    }

    componentWillMount(){
        let orderId = this.props.match.params.orderId;
        if(orderId){
            this.getDetaiInfo(orderId)
        }
    }

    getDetaiInfo = (orderId) =>{
        axios.ajax({
            url:"/order/detail",
            data:{
                params:{
                    orderId: orderId
                }
            }
        }).then((res)=>{
            if(res.code == 0){
                this.setState({
                    orderInfo:res.result
                })
                this.renderMap(res.result);
            }
        })
    }

    //初始化地图插件
    renderMap = (result) =>{
        //因为模块化开发,无法获取到第三方没有通过 npm 安装的插件,无法获取到 public 静态资源中的 BMap 插件所以会报错,
        //使用window对象则不会报错,模块运行遇到window则会运行而不会报错
        this.map = new window.BMap.Map('orderDetailMap',{  
            enableMapClick:false  //地图的点击事件
        })
        //添加地图控件
        this.addMapControl();
        //调用路线图的绘制方法
        this.drawBikeRoute(result.position_list)
        //调用绘制服务区方法
        this.drawServiceArea(result.area)
    }

    //添加地图控件
    addMapControl = () =>{
        let map = this.map;
        //因为模块化开发,无法获取到第三方没有通过 npm 安装的插件,无法获取到 public 静态资源中的 BMap 插件所以会报错,
        //使用window对象则不会报错,模块运行遇到window则会运行而不会报错
        map.addControl(new window.BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_LEFT}));
        map.addControl(new window.BMap.NavigationControl({anchor: window.BMAP_ANCHOR_TOP_LEFT}));
    }

    //绘制用户的行驶路线
    drawBikeRoute = (positionList)=>{
        let map = this.map;
        let startPoint = "";
        let endPoint = "";
        if(positionList.length > 0){
            //第一个坐标点也就是起始坐标点
            let first = positionList[0]
            let last = positionList[positionList.length - 1]
            //生成起始坐标点
            startPoint = new window.BMap.Point(first.lon,first.lat)
            //设置起始点的图片,第一个设置src,第二个设置控件大小,第三个设置 Icon 大小
            let startIcon = new window.BMap.Icon('/assets/start_point.png',new window.BMap.Size(36,42),{
                imageSize:new window.BMap.Size(36,42), //图标的大小
                anchor: new window.BMap.Size(18,21),  //中心点
            })
            //绘制点
            let startMarker = new window.BMap.Marker(startPoint, { icon: startIcon });
            //生成点
            this.map.addOverlay(startMarker);

            //生成结束坐标点
            endPoint = new window.BMap.Point(last.lon,last.lat)
            //设置结束点点的图片,第一个设置src,第二个设置控件大小,第三个设置 Icon 大小
            let endIcon = new window.BMap.Icon('/assets/end_point.png',new window.BMap.Size(36,42),{
                imageSize:new window.BMap.Size(36,42), //图标的大小
                anchor: new window.BMap.Size(18,42),  //中心点
            })
            //绘制点
            let endMarker = new window.BMap.Marker(endPoint, { icon: endIcon });
            //生成点
            this.map.addOverlay(endMarker);

            //连接路线图
            let trackPoint = [];
            for(let i = 0; i<positionList.length; i++){
                let point = positionList[i];
                trackPoint.push(new window.BMap.Point(point.lon,point.lat));
            }

            let polyline = new window.BMap.Polyline(trackPoint,{
                strokeColor:"#1869AD",
                strokeWeight:3,
                strokeOpacity:1
            })
            //射程则线图
            this.map.addOverlay(polyline)

            //设置地图为,缩放级别
            this.map.centerAndZoom(endPoint,11);

        }

    }

    //绘制服务区
    drawServiceArea = (positionList) =>{

        //连接路线图
        let trackPoint = [];
        for(let i = 0; i<positionList.length; i++){
            let point = positionList[i];
            trackPoint.push(new window.BMap.Point(point.lon,point.lat));
        }

        let polyGon = new window.BMap.Polygon(trackPoint,{
            strokeColor:"#CE0000",
            strokeWeight:4,
            strokeOpacity:1,
            fillColor:"#ff8605",
            fillOpacity:0.4
        })
        this.map.addOverlay(polyGon)
    }

    render() {
        const info = this.state.orderInfo || {};
        return (
            <div>
                <Card>
                    <div id="orderDetailMap" className="order-map"></div>
                    <div className="detail-items">
                        <div className="item-title">基础信息</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">用车模式</div>
                                <div className="detail-form-content">{info.mode == 1 ?"服务区" :"停车点"}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">订单编号</div>
                                <div className="detail-form-content">{info.order_sn}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">车辆编号</div>
                                <div className="detail-form-content">{info.bike_sn}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">用户姓名</div>
                                <div className="detail-form-content">{info.user_name}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">手机号码</div>
                                <div className="detail-form-content">{info.mobile}</div>
                            </li>
                        </ul>
                    </div>
                    <div className="detail-items">
                        <div className="item-title">行驶轨迹</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">行程起点</div>
                                <div className="detail-form-content">{info.start_location}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行程终点</div>
                                <div className="detail-form-content">{info.end_location}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行程里程</div>
                                <div className="detail-form-content">{info.distance/1000}公里</div>
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Detail;