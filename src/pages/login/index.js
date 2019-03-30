import React, { Component } from 'react';
import { matchPath } from "react-router";
import { Card, Input, Button, Icon, Form, Modal, message} from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import './index.less';
import { getUser } from './../../redux/action'
import AV from 'leancloud-storage';
const FormItem = Form.Item;
class Login extends Component {

    state={
        isModal:false,
        resemail:"",
        formStatus:"",
        statusText:"",
        headUrl:"",
        
    }

    ispost=false

    componentDidMount(){
        const _this = this;
        var currentUser = AV.User.current();
        if(currentUser){  
            currentUser.isAuthenticated().then(function(authenticated){
                if(authenticated){
                    // window.location.href="http://"+window.location.hostname+(window.location.port?":"+window.location.port:"")+"/#/home"
                    _this.props.history.push('/home')
                }
            }
        )}
    }

    handleSubmit = (e) => {
        const { dispatch } = this.props;
        const _this = this;
        e.preventDefault();
        this.props.form.validateFields(['username','password'],(err, values) => {
            if (!err) {
                var loading = document.getElementById("ajaxLoading");
                loading.style.display = "block";
                // console.log('Received values of form: ', values);
                // console.log(JSON.stringify(values));
                // axios({
                //     method: 'post',
                //     url: 'https://o2sr0ojd.api.lncld.net/1.1/login',
                //     headers: {
                //         "X-LC-Id": "O2sR0ojdz2eP811aIwtlDUVH-gzGzoHsz",
                //         "X-LC-Key": "vvtzU9hVqx8Jd8xiCIu4Ere0",
                //         "Content-Type": "application/json"
                //     },
                //     data: JSON.stringify(values)
                // }).then((response)=>{
                //     console.log(response)
                //     console.log(response.data.username)
                //     console.log(response.data.sessionToken)
                //     dispatch(getUser(response.data.username,response.data.name,response.data.objectId,response.data.sessionToken))
                //     // window.location.href="http://localhost:3001/#/home"
                // }).catch(error => {
                //     //超时之后在这里捕抓错误信息.
                //     console.log("error")
                //     console.log(error)
                //     console.log(error.response)
                //     console.log(error.response.data.code)
                //     console.log(error.response.data.error)
                // });

                //官方自带方法登录即可保存用户信息
                AV.User.logIn(values.username, values.password).then(function (loggedInUser) {
                    const loggedInUsers = loggedInUser.attributes;
                    var menus = [];
                    loading.style.display = "none";
                    // console.log(loggedInUser);
                    // console.log("当前登录账号: "+ loggedInUsers.username) 
                    // console.log("当前用户名: "+ loggedInUsers.name)
                    // console.log("当前用户ID: "+ loggedInUser.id)
                    var query = new AV.Query('personnel');
                    query.startsWith('username',loggedInUsers.name);
                    query.find().then(function (result) {
                        var _query = new AV.Query('permission');
                        _query.startsWith('role_name',result[0].attributes.permission);
                        _query.find().then(function (_result) {
                            // console.log(_result)
                            if(_result[0].attributes.status){
                                menus = _result[0].attributes.permission || ['/home']
                            }else{
                                menus = ['/home']
                            }
                            dispatch(getUser(loggedInUsers.username,loggedInUsers.name,loggedInUser.id,loggedInUser._sessionToken,menus))
                            // window.location.href="http://"+window.location.hostname+(window.location.port?":"+window.location.port:"")+"/#/home"
                            _this.props.history.push('/home')
                        }).catch((error)=>{
                            console.log(error)
                            message.warn("发生错误")
                        })
                    }).catch((error)=>{
                        console.log(error)
                        message.warn("发生错误")
                    })
                    
                  }, function (error) {
                    loading.style.display = "none";
                    console.log(error)
                    console.log("error.code: " + error.code)
                    console.log("error.message: " + error.rawMessage)
                    if(error.rawMessage == "Could not find user."){
                        message.warning("账户不存在,请检查是否正确与大写小写！")
                    }else{
                        message.warning("发生错误")
                    }
                  });
            }else{
                message.warn("账号或密码不能为空")
            }
        });
    }

    handleChange = (e)=>{
        if(e.target.value==""){
            this.setState({
                formStatus:"",
                statusText:""
            })
        }
        this.state.resemail = e.target.value
    }

    handleResetPaw = (e) =>{
        e.preventDefault();
        var re = new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$','g')
        if(!re.test(this.state.resemail)){
            this.setState({
                formStatus:"error",
                statusText:"邮箱格式不正确"
            })
        }else
        this.props.form.validateFields(['resemail'],(err, values) => {
            const _this = this;
            if(!this.ispost){
                _this.ispost=true
                if (!err) {
                    // console.log('Received values of form: ', values);
                    // console.log(JSON.stringify(values));
                    message.loading("正在发送邮件",0)
                    AV.User.requestPasswordReset(values.resemail).then(function (success) {
                        message.destroy()
                        message.success("修改密码的邮件已成功发送至邮箱,请注意查收,邮箱时间为48小时!",6)
                        // console.log(success)
                        _this.ispost=false
                        _this.setState({
                            isModal:false
                        })

                    }, function (error) {
                        message.destroy()
                        message.success(error.rawMessage,6)
                        // console.log(error.rawMessage)
                        _this.ispost=false
                        _this.setState({
                            isModal:false
                        })
                    });
                }
            }else{
                message.warning("请勿重复提交")
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="UserFrom">
                <div className="UserForm_bg" style={{backgroundImage:"url("+require('./../../resource/gallery/bg.jpg')+")"}}>

                </div>
                <div className="UserFrom_box">
                    <Card className="UserFrom_content" title="用户登录" extra={<Icon type="idcard" theme="twoTone" />}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem label="账号">
                                {
                                    getFieldDecorator("username",{
                                        rules: [
                                            { required: true, message: '账号不能为空' }
                                        ],
                                    })(
                                        <Input prefix={<Icon type="user" />} allowClear placeholder="请输入账号" />
                                    )
                                }
                            </FormItem>
                            <FormItem label="密码">
                                {
                                    getFieldDecorator("password",{
                                        rules: [
                                            { required: true, message: '密码不能为空' }
                                        ],
                                    })(
                                        <Input prefix={<Icon type="lock" />} allowClear type="password" placeholder="请输入密码" />
                                    )
                                }
                            </FormItem>
                            <FormItem>
                                <Button onClick={()=>this.setState({isModal:true})}>忘记密码</Button>
                                <Link to="/reg" style={{float:"right"}}>
                                    <Button>注册</Button>
                                </Link>
                                <Button className="login-form-button" type="primary" htmlType="submit" >登录</Button>
                            </FormItem>
                        </Form>
                </Card>
                <Modal 
                    visible={this.state.isModal}
                    onOk={this.handleResetPaw}
                    onCancel={()=>{
                        this.setState({
                            isModal:false
                        })
                    }}
                    okText="发送验证邮箱"
                    cancelText="取消发送"
                >
                    <FormItem 
                        label="邮箱"
                        validateStatus={this.state.formStatus}
                        help={this.state.statusText}
                    >
                        {
                            getFieldDecorator("resemail",{
                                rules: [
                                    { required: true, message: '邮箱不能为空' },
                                    { 
                                        // pattern: new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$','g'),
                                        message: "邮箱格式不正确" 
                                    }
                                ],
                            })(
                                <Input 
                                    prefix={<Icon type="mail" />} 
                                    onChange={this.handleChange} 
                                    allowClear  
                                    type="email" 
                                    placeholder="请输入邮箱"
                                    onBlur={()=>{
                                        var re = new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$','g')
                                        if(!re.test(this.state.resemail)){
                                            this.setState({
                                                formStatus:"error",
                                                statusText:"邮箱格式不正确"
                                            })
                                        }else{
                                            this.setState({
                                                formStatus:"",
                                                statusText:""
                                            })
                                        }
                                    }}
                                />
                            )
                        }
                    </FormItem>
                </Modal>
                </div>
            </div>
        );
    }
}

//将组建丢入radux内进行管理
export default connect()(Form.create()(Login));
