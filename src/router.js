import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import App from './App';
import Login from './pages/login'
import UserReg from './pages/login/userReg'
import Admin from './admin';
import Home from './pages/home';
import Buttons from './pages/ui/buttons';
import Modals from './pages/ui/modals';
import Loadings from './pages/ui/loadings';
import Notice from './pages/ui/notice';
import Messages from './pages/ui/messages';
import Tabs from './pages/ui/tabs';
import Gallery from './pages/ui/gallery';
import Carousel from './pages/ui/carousel';
import FormLogin from './pages/form/login';
import Formregister from './pages/form/register';
import BasicTable from './pages/table/basicTable';
import MediumTable from './pages/table/mediumTable';
import HighTable from './pages/table/highTable';
import City from './pages/city';
import Order from './pages/order';
import NoMatch from './pages/nomatch';
import OrderDetail from './pages/order/detail';
import BikeMap from './pages/map/bikeMap';
import MockUser from './pages/user/mock';
import ServerUser from './pages/user/server';
import Bar from './pages/echarts/bar';
import Pie from './pages/echarts/pie';
import Line from './pages/echarts/line';
import RichText from './pages/rich';
import PermissionMock from './pages/permission/mock';
import PermissionServer from './pages/permission/server';
import Common from './common';
import { connect } from 'react-redux';
import { getUser } from './redux/action';
import AV from 'leancloud-storage'
import { message } from 'antd';
AV.init({
    appId: 'O2sR0ojdz2eP811aIwtlDUVH-gzGzoHsz',
    appKey: 'vvtzU9hVqx8Jd8xiCIu4Ere0'
});
class IRouter extends Component{
    
    state={
        urlHash:"",
        UserStatus:true,
        category:'',
        menus:[]
    }
    urlHash = ""
    componentDidMount(){
        this.urlHash=window.location.hash.replace(/#\/|\?.*$/g,"")
        // console.log(window.location.hash.replace(/#\/|\?.*$/g,""))
        // console.log(this.urlHash)
        this.Authentication()
    }

    Authentication = ()=>{
        const _this = this;
        const { dispatch } = this.props;
        var menus = [];
        var currentUser = AV.User.current();
        var loading = document.getElementById("ajaxLoading");
        loading.style.display = "block";
          if(currentUser){  
            currentUser.isAuthenticated().then(function(authenticated){
            loading.style.display = "none";
            //   console.log(currentUser)   //获取当前用户数据
            //   console.log("当前登录账号: "+ currentUser.attributes.username)   //获取当前用户名
            //   console.log("当前用户名: "+ currentUser.attributes.email)
            //   console.log("当前用户ID: "+ currentUser.id)
            //   console.log(authenticated); //根据需求进行后续的操作
              const _this = this;
                var query = new AV.Query('personnel');
                query.startsWith('username',currentUser.attributes.name);
                query.find().then(function (result) {
                    var _query = new AV.Query('permission');
                    _query.startsWith('role_name',result[0].attributes.permission);
                    _query.find().then(function (_result) {
                        if(_result[0].attributes.status){
                            menus = _result[0].attributes.permission || ['/home']
                        }else{
                            menus = ['/home']
                        }
                        // console.log(_result)

                        dispatch(getUser(currentUser.attributes.username,currentUser.attributes.name,currentUser.id,currentUser._sessionToken,menus))
                        _this.setState({
                            UserStatus:true,
                            category:currentUser.attributes.category
                        })
                    })
                }).catch((error)=>{
                    console.log(error)
                    message.warning("发生错误,请重新刷新页面")
                })
              
                return "";
            });
            }else {
                _this.setState({ UserStatus:false })
                loading.style.display = "none";
            }
    }


    screening = (a,b)=>{
        var c = [];
        
    }

    renderRouter = (components,menus)=>{
        var _Router = [];
        var header = "";
        var _menus = menus?menus.sort():menus
        if(_menus){
            _menus.map((item,index)=>{
                if(components[0][item]){
                    _Router.push(<Route path={item} key={index} component={components[0][item]} />)
                }
            })
            _Router.push(<Redirect to="/home" key={"redirect"} />)
            // _menus.map((item,index)=>{
            //         // RegExp("^\/+[a-z]+/+[a-z]","g").test("/aa/")
            //         if(!RegExp("^\/+[a-z]+/+[a-z]","g").test(item)){  // item == /ui == false   item == /ui/button == true
            //             header = item;
            //             console.log("进入头部循环")
            //             if(header){
            //                 _menus.map((_item,index)=>{
            //                     if(RegExp(item+"/+[a-z]","g").test(_item)){  
            //                         console.log("获得"+_item)
            //                     }else{}
            //                 })
            //             }
            //         }else{
            //             if(!RegExp(header).test(item)){
            //                 // _Router.push(<Route path={item} key={index} component={components[0][item]} />)
            //                 console.log("执行: "+item)
            //             }else{
            //                 console.log("跳过: "+item)
            //             }
            //         }
            // })
        }
        return _Router
    }

    render(){
        
        var components = [{
            "/home":Home,"/ui/buttons":Buttons,"/ui/modals":Modals,"/ui/loadings":Loadings,"/ui/notice":Notice,
            "/ui/messages":Messages,"/ui/tabs":Tabs,"/ui/gallery":Gallery,"/ui/carousel":Carousel,"/form/login":FormLogin,
            "/form/reg":Formregister,"/table/basic":BasicTable,"/table/high":HighTable,"/table/medium":MediumTable,
            "/city":City,"/order":Order,"/user/mock":MockUser,"/user/server":ServerUser,"/bikeMap":BikeMap,"/charts/bar":Bar,
            "/charts/pie":Pie,"/charts/line":Line,"/rich":RichText,"/permission/mock":PermissionMock,"/permission/server":PermissionServer
        }
        ]
       
        return (
            <div>
                {/* <button onClick={()=>{
                  console.log(this.props.menus)
                    }}>测试</button> */}
            <Router>
                <App>
                    <Switch>
                        <Route path='/login' component={Login} />
                        <Route path='/reg' component={UserReg} />
                        <Route path="/common" render={() =>
                            <Common>
                                <Route path="/common/order/detail/:orderId" component={OrderDetail} />
                            </Common>
                        } />
                        {
                            this.state.UserStatus || this.props.username?"":this.state.urlHash == "reg"?<Redirect to="/reg" />:<Redirect to="/login" />
                        }
                        <Route path="/" render={()=>
                            <Admin>
                                <Switch>
                                    {
                                       this.renderRouter(components, this.props.menus).map((item)=>{
                                           return item
                                       })
                                    //    this.props.menus?this.props.menus.map((item,index)=>{
                                    //     if(components[0][item]){
                                    //         _Router.push(<Route path={item} key={index} component={components[0][item]} />)
                                    //     }
                                    //    }):"";
                                    }
                                    {/* <Route path="/home" component={Home} />
                                    <Route path="/ui/buttons" component={Buttons} />
                                    <Route path="/ui/modals" component={Modals} />
                                    <Route path="/ui/loadings" component={Loadings} />
                                    <Route path="/ui/notification" component={Notice} />
                                    <Route path="/ui/messages" component={Messages} />
                                    <Route path="/ui/tabs" component={Tabs} />
                                    <Route path="/ui/gallery" component={Gallery} />
                                    <Route path="/ui/carousel" component={Carousel} />
                                    <Route path="/form/login" component={FormLogin} />
                                    <Route path="/form/reg" component={Formregister} />
                                    <Route path="/table/basic" component={BasicTable} />
                                    <Route path="/table/high" component={HighTable} />
                                    <Route path="/table/medium" component={MediumTable} />
                                    <Route path="/city" component={City} />
                                    <Route path="/order" component={Order} />
                                    <Route path="/user" component={User} />
                                    <Route path="/bikeMap" component={BikeMap} />
                                    <Route path="/charts/bar" component={Bar} />
                                    <Route path="/charts/pie" component={Pie} />
                                    <Route path="/charts/line" component={Line} />
                                    <Route path="/rich" component={RichText} />
                                    <Route path="/permission/mock" component={PermissionMock} />
                                    <Route path="/permission/server" component={PermissionServer} /> */}
                                    {/* <Redirect to="/home" /> */}
                                    {/* Redirect 路由重定向,当访问 / 的时候跳转到home去 */}
                                    {/* 当启用重定向是下面404页面则会失效 */}
                                    {/* <Route component={NoMatch}></Route> */}
                                </Switch>
                            </Admin>
                        } />
                    </Switch>
                </App>
            </Router>
            </div>
        )
    }
}

//获取数据源
const mapStateToProps = state =>{
    return {
        username: state.username,
        menus: state.menus
    }
}
//链接传值(值)(链接头)
export default connect(mapStateToProps)(IRouter);