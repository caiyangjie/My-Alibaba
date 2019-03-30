import React, { Component } from 'react';
import MenuConfig from './../../config/menuConfig';
import { Link } from 'react-router-dom';
import { Menu, Icon, message } from 'antd';
import './index.less';
import SVG from 'react-inlinesvg';
//redux 连接器
import { connect } from 'react-redux';
//按钮触发action行为
import { switchMenu } from './../../redux/action';
import AV from 'leancloud-storage';

const SubMenu = Menu.SubMenu;

class NavLeft extends Component {

    state ={
        currentKey: '',
        item:"",
        title:"",
        menuHide:false,
        headUrl:""
    }

    skip = [];
    obtainNode = [];
    componentDidMount(){
        const _this = this;
        let currentKey = window.location.hash.replace(/#|\?.*$/g,"");
        var _MenuConfig = [];
        var user_name = "";
        var currentUser = AV.User.current();
        if(currentUser){  
            currentUser.isAuthenticated().then(function(authenticated){
                user_name = currentUser.attributes.name
                var query = new AV.Query('personnel');
                query.startsWith('username', user_name);
                query.find().then(function (result) {
                    if (result.length > 0) {
                        // console.log(result[0].attributes.permission)
                        // console.log(result)
                        var _query = new AV.Query('permission');
                        _query.startsWith('role_name',result[0].attributes.permission);
                        _query.find().then(function (_result) {
                            if(_result[0].attributes.status){
                                _MenuConfig = _result[0].attributes.permission || ['/home']
                            }else{
                                _MenuConfig = ['/home']
                            }
                            // console.log(_result)
                            //数组对象传递进去,获取菜单树节点
                            const menuTreeNode =_this.renderMenu(MenuConfig,currentKey,_MenuConfig,[""]);        
                            let arr =[]
                            if(_this.skip[0]){
                                _this.skip.map((item,index)=>{
                                    if(RegExp(item).test(_MenuConfig)){
                                        arr.push(item)
                                    }
                                })
                            }
                            if(arr[0]){
                                //循环服务器传来无头部的节点
                                const _menuTreeNode =_this._renderMenu(MenuConfig,arr,"0",_MenuConfig);
                                _menuTreeNode.map((item)=>{
                                    if(item != "" && item != undefined){
                                        menuTreeNode.push(item)
                                    }
                                })
                            }
                            _this.setState({
                                menuTreeNode,
                                currentKey
                            })
                        }).catch((error)=>{
                            console.log(error)
                            message.warning("发生错误,请重新刷新页面")
                        })
                    }
                }).catch((error)=>{
                    console.log(error)
                    message.warning("发生错误,请重新刷新页面")
                })
            })
        }
        
        
    }

    //菜单渲染
    renderMenu = (data,currentKey,_MenuConfig) =>{
        const { dispatch } = this.props;
        const _this = this;
        // var skip = [];
        return data.map((item)=>{
            //判断item内是否包含了子元素,来递归子元素
            if(item.children){
                if(currentKey == item.key){
                    dispatch(switchMenu(item.title,_this.state.menuHide))
                }
                if(_MenuConfig.indexOf(item.key) != -1){
                    //然后在调用一次渲染方法来渲染子元素
                    return (
                        //SubMenu 是用来存在子节点菜单
                            <SubMenu title={RegExp("/[a-z]*/").test(item.key)?"":<span><Icon type={item.icon} /><span>{item.title}</span></span>} key={item.key}>
                            {/* <SubMenu title={item.title} key={item.key}> */}
                            { this.renderMenu(item.children,currentKey,_MenuConfig) }
                        </SubMenu>
                    )
                }else {
                    _this.skip.push(item.key)
                };
                
            }
            if(currentKey == item.key){
                dispatch(switchMenu(item.title,_this.state.menuHide))
            }
            if(_MenuConfig.indexOf(item.key) != -1){
                //Menu.Item 是用来存在菜单项的,title是存在内容的
                return (
                    <Menu.Item key={item.key} item={item.title} >
                        <Link to={item.key} className="link_content">
                            {RegExp("/[a-z]*/").test(item.key)?"":<Icon type={item.icon} />}
                            <span>
                                {item.title}
                            </span>
                        </Link>
                    </Menu.Item>
                    )
            }else return ;
            
        })
    }
    
    _renderMenu = (data,arr,temp,_MenuConfig)=>{
        var num = [];
        for(let i=0;i < arr.length; i++){
            num[arr[i]]=0;
            _MenuConfig.map((item)=>{
                if(RegExp(arr[i]).test(item)){
                    num[arr[i]] += 1;
                }
            })
        }
        return data.map((item)=>{
            if(item.children){
                if(RegExp(item.key).test(arr)){
                    if(num[item.key] <= 1){
                        return (
                            this._renderMenu(item.children,arr,item.key,_MenuConfig)
                        )
                    }else{
                        return (
                            //SubMenu 是用来存在子节点菜单
                            <SubMenu title={RegExp("/[a-z]*/").test(item.key)?"":<div><Icon type={item.icon} />{item.title}</div>} key={item.key}>
                                { this._renderMenu(item.children,arr,item.key,_MenuConfig) }
                            </SubMenu>
                        )
                    }
                }
            }
            if(RegExp(temp).test(arr)){
                if(_MenuConfig.indexOf(item.key) != -1){
                    return <Menu.Item key={item.key} title={item.title} >
                        {RegExp("/[a-z]*/").test(item.key)?"":<Icon type={item.icon} />}
                        <Link to={item.key} className="link_content">{item.title}</Link>
                    </Menu.Item>
                }
            }
        })
    }

    handleClick = ({ item,key })=>{
        const { dispatch } = this.props;
        //获取redux的dispatch方法 设置action数据
        dispatch(switchMenu(item.props.item,this.state.menuHide))
        this.setState({
            currentKey:key,
            item:item.props.item
        })
    }

    handeHideMenu = ()=>{
        const { dispatch } = this.props;
        dispatch(switchMenu(this.state.item,!this.state.menuHide))
        this.setState({
            menuHide:!this.state.menuHide
        })
        // //获取redux的dispatch方法 设置action数据
        // dispatch(menuHide(this.state.menuHide))
    }

    render() {
        return (
            <div>
                <div className="logo">
                    {/* <img src="/assets/logo-ant.svg" alt="" /> */}
                    <img src={require("../../resource/assets/logo-ant.svg")} alt="" />
                    {/* require */}
                    {/* <div className="logo_img"></div> */}
                    {/* <h1>Imooc MS</h1> */}
                    {
                        this.state.menuHide?"":<h1>Imooc MS</h1>
                    }
                </div>
                <Menu 
                    theme="dark"
                    className="Nav_list"
                    selectedKeys={[this.state.currentKey]}
                    onClick={this.handleClick}
                    // inlineCollapsed={true}
                    inlineCollapsed={this.state.menuHide}
                >
                    {this.state.menuTreeNode}
                </Menu>
                <div className="menuhide_btn" onClick={this.handeHideMenu}>   
                    <Icon type="left"></Icon>
                </div>
            </div>
        );
    }
}

//获取数据源
const mapStateToProps = state =>{
    return {
        name:state.name,
    }
}


//将组建丢入radux内进行管理   链接传值(值)(链接头)
export default connect(mapStateToProps)(NavLeft);