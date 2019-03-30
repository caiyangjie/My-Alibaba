import React, { Component } from 'react';
import { Row, Col, message, Button, Drawer, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
import Util from '../../utils/utils';
import axios from '../../axios';
import { connect } from 'react-redux';
import { switchMenu,getUser } from './../../redux/action';
import AV from 'leancloud-storage'

const DescriptionItem = ({ title, content }) => (
    <div
      style={{
        fontSize: 14,
        lineHeight: '22px',
        marginBottom: 7,
        color: 'rgba(0,0,0,0.65)',
      }}
    >
      <p
        style={{
          marginRight: 8,
          display: 'inline-block',
          color: 'rgba(0,0,0,0.85)',
        }}
      >
        {title}:
      </p>
      {content}
    </div>
  );

class Header extends Component {

    state={
        userVisible:false,
        emailvisible:false,
        user:{
            username:"",
            name:"",
            email:"",
            Introduction:"",
            sex:"",
            // birthday:new Date(),
            emailVerified:false,
            // createdAt:new Date()
        }
    }

    componentWillMount(){
        const _this = this;
        this.setState({
            userName:'未登录'
        })
        setInterval(()=>{
            let sysTime = Util.formateDate(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000)
        // this.getWeatherAPIData();
        var currentUser = AV.User.current();
        if(currentUser){  
            currentUser.isAuthenticated().then(function(authenticated){
                if(authenticated){
                    let current = currentUser.attributes;
                    _this.setState({
                        user:{
                            username: current.username,
                            name: current.name,
                            email: current.email,
                            Introduction: current.Introduction,
                            sex: current.sex,
                            createdAt: _this.dateFormatting(currentUser.createdAt),
                            emailVerified: current.emailVerified,
                            birthday: _this.dateFormatting(current.birthday)
                        }
                    })
                }
            }
        )}
    }

    //时间格式化
    dateFormatting = (data)=>{
        let Y = new Date(data).getFullYear()
        let M = new Date(data).getMonth()
        let D = new Date(data).getDate()

        return Y + "-" + (M+1) + "-" + D
    }

    //获取天气API
    // getWeatherAPIData(){
    //     let city = '广州'
    //     axios.jsonp({
    //         url:'http://api.map.baidu.com/telematics/v3/weather?location='+encodeURIComponent(city)+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
    //     }).then((res)=>{
    //         if(res.status == 'success'){
    //             let data = res.results[0].weather_data[0];
    //             this.setState({
    //                 dayPictureUrl:data.dayPictureUrl,
    //                 weather:data.weather
    //             })
    //         }
    //     })
    // }

    hanleOutLogin = (e)=>{
        var loading = document.getElementById("ajaxLoading");
        const _this = this;
        const { dispatch } = this.props;

        console.log(this.props.history)
        loading.style.display = "block";
        AV.User.logOut().then(()=>{
            loading.style.display = "none";
        })
        var currentUser = AV.User.current();
        if(!currentUser){
            message.info("登出成功") 
            // e.preventDefault();
            // window.location.reload()
            // _this.props.history.push('/login')
            dispatch(getUser(""))
            dispatch(switchMenu(""))
            loading.style.display = "none";
        }else{
            message.warn("登出失败")
            e.preventDefault();
            loading.style.display = "none";
        }
    }

    showDrawer = ()=>{
        this.setState({
            userVisible:true
        })
        console.log(this.props.history)
    }

    confirm = () => {
        const _this = this;
        // if(!this.state.user.email){
        //     message.warn('未设置邮箱,无法验证');
        //     return ;
        // }
        AV.User.requestEmailVerify(this.state.user.email).then(function (result) {
            console.log(result)
            message.success('验证邮件已成功发送至邮箱.');
            _this.setState({ emailvisible: false });
        }, function (error) {
            console.log(error);
            if(_this.state.user.email){
                message.warning('请求拉取失败,请稍后再试!!!');
            }else{
                message.warning('未设置邮箱,无法验证');
            }
            _this.setState({ emailvisible: false });
        });
        
      }
    
      cancel = () => {
        this.setState({ emailvisible: false });
        message.error('取消发送');
      }
    render(){
        const menuType = this.props.menuType;
        return (
            <div className="Header">
                <Row className="header-top">
                    {
                        menuType?
                        <Col span={6} className="logo">
                            <img src="/assets/logo-ant.svg" alt=""/>
                            <span>通用管理系统</span>
                        </Col>:""
                    }
                    <Col span={menuType?18:24}>
                        <a onClick={this.showDrawer}>
                            {
                                this.props.name?this.props.name:this.state.userName
                            }
                        </a>
                        {/* <a href="#" onClick={this.hanleOutLogin}>退出</a> */}
                        {
                                this.props.name?
                                <Link to="/login" onClick={this.hanleOutLogin}>
                                退出
                                </Link>:
                                <Link to="/login">
                                登录
                                </Link>
                        }
                        {/* <Link to="/login" onClick={this.hanleOutLogin}>
                            退出
                        </Link> */}
                    </Col>
                </Row>
                {
                    menuType ? "" : 
                    <Row className="breadcrumb">
                    <Col span={4} className="breadcrumb-title">
                        {/* 获取从reducer中返回的数据 */}
                        {this.props.menuName}
                    </Col>
                    <Col span={20} className="weather">
                        {/* <span className="date">{this.state.sysTime}</span>
                        <span className="weather-img">
                            <img src={this.state.dayPictureUrl} alt=""/>
                        </span>
                        <span className="weather-detail">
                            {this.state.weather}
                        </span> */}
                    </Col>
                </Row>
                }
                
                <Drawer
                title="个人信息"
                placement="right"
                closable={false}
                width={300}
                onClose={()=>{
                    this.setState({
                        userVisible:false
                    })
                }}
                visible={this.state.userVisible}
                >
                    <DescriptionItem title="账号" content={this.state.user.username || ""} />
                    <DescriptionItem title="用户名" content={this.state.user.name || ""} />
                    <DescriptionItem title="性别" content={this.state.user.sex || ""} />
                    <DescriptionItem title="邮箱" content={this.state.user.email || ""} />
                    <DescriptionItem title="个性简介" content={this.state.user.Introduction || ""} />
                    <DescriptionItem title="生日" content={this.state.user.birthday || ""} />
                    <DescriptionItem title="注册时间" content={this.state.user.createdAt || ""} />
                    <div
                        style={{
                            fontSize: 14,
                            lineHeight: '22px',
                            marginBottom: 7,
                            color: 'rgba(0,0,0,0.65)',
                        }}
                    >
                    <p
                        style={{
                        marginRight: 8,
                        display: 'inline-block',
                        color: 'rgba(0,0,0,0.85)',
                        }}
                    >
                        邮箱是否已验证:
                    </p>
                    {this.state.user.emailVerified?"已验证": <Popconfirm
                            title="是否发送邮件到邮箱进行验证"
                            onConfirm={this.confirm}
                            onCancel={this.cancel}
                            okText="发送验证邮件"
                            cancelText="取消"
                        >
                        <Button href="#">未验证</Button>
                        </Popconfirm>
                    }
                    </div>
                </Drawer>
            </div>
        )
    }
}
//获取数据源
const mapStateToProps = state =>{
    return {
        menuName:state.menuName,
        name:state.name
    }
}
//链接传值(值)(链接头)
export default connect(mapStateToProps)(Header);