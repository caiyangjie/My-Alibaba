import React, { Component } from 'react';
import { Card, Input, Button, Icon, Form, Radio, DatePicker, message} from 'antd';
import { Link } from 'react-router-dom';
import './index.less';
import moment from 'moment';
import axios from 'axios';
import AV from 'leancloud-storage'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class Login extends Component {

    state={
        pwd_1:"",
        pwd_2:"",
        formStatus:"",
        statusText:"",
        headUrl:""
    }


    handleSubmit = (e) => {
        e.preventDefault();
        const _this = this;
        if(this.state.pwd_1 != this.state.pwd_2){
            this.setState({
                formStatus:"error",
                statusText:"密码不匹配"
            })
        }else{
            if( this.state.pwd_1 == "" || this.state.pwd_2 == "" ){
                this.setState({
                    formStatus:"error",
                    statusText:"密码不能为空"
                })
            }
            this.props.form.validateFields(["username","password","name","sex","birthday","email","Introduction"],(err, values) => {
                if (!err) {
                    var loading = document.getElementById("ajaxLoading");
                    loading.style.display = "block";
                    console.log('Received values of form: ', values);
                    console.log(new Date(values.birthday).getTime())
                    console.log(JSON.stringify(values));
                    axios({
                        method: 'post',
                        url: 'https://o2sr0ojd.api.lncld.net/1.1/users',
                        headers: {
                            "X-LC-Id": "O2sR0ojdz2eP811aIwtlDUVH-gzGzoHsz",
                            "X-LC-Key": "vvtzU9hVqx8Jd8xiCIu4Ere0",
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(values)
                    }).then((response)=>{
                        loading.style.display = "none";
                        var currentUser = AV.User.current();
                        if(currentUser){  
                        currentUser.isAuthenticated().then(function(authenticated){
                           console.log(authenticated)
                        })}
                        // 声明类型
                        var Personnel = AV.Object.extend('personnel');
                        // 新建对象
                        var personnel = new Personnel();
                        // 设置名称
                        personnel.set('username',values.name);
                        personnel.set('sex',values.sex);
                        personnel.set('email',values.email);
                        personnel.set('birthday',parseInt(new Date(values.birthday).getTime()));
                        personnel.set('fatherId',response.data.objectId);
                        personnel.save().then(function (todo) {
                            console.log(todo);
                        }, function (error) {
                            console.error(error);
                        });
                        console.log(response)
                        message.success("注册成功");
                        // window.location.href="http://"+window.location.hostname+(window.location.port?":"+window.location.port:"")+"/#/login"
                        _this.props.history.push('/login')

                    }).catch(error => {
                        //超时之后在这里捕抓错误信息.
                        console.log("error")
                        console.log(error)
                        console.log(error.response)
                        console.log(error.response.data.code)
                        console.log(error.response.data.error)
                        if(error.response.data.error === "Username has already been taken."){
                            message.warning("用户已被占用！")
                        }
                    });
                }else{
                    message.warn("账号或密码不能为空")
                }
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:{
                xs:24,
                sm:7
            },
            wrapperCol:{
                xs:24,
                sm:12
            }
        }
        return (
            <div className="UserFrom">
                <div className="UserForm_bg" style={{backgroundImage:"url("+require('./../../resource/gallery/bg.jpg')+")"}}>

                </div>
                <div className="UserFrom_box UserFrom_reg">
                    <Card className="UserFrom_content" title="用户注册" extra={<Icon type="idcard" theme="twoTone" />}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem label="账号" {...formItemLayout}>
                                {
                                    getFieldDecorator("username",{
                                        rules: [
                                            { required: true, message: '账号不能为空' }
                                        ],
                                    })(
                                        <Input prefix={<Icon type="user" />} placeholder="请输入账号" />
                                    )
                                }
                            </FormItem>
                            <FormItem 
                                label="密码" 
                                {...formItemLayout}
                                validateStatus={this.state.formStatus}
                                help={this.state.statusText}
                            >
                                {
                                    getFieldDecorator("password",{
                                        rules: [
                                            { required: true, message: '密码不能为空' }
                                        ],
                                    })(
                                        <Input prefix={<Icon type="lock" />} onChange={(e)=>this.setState({pwd_1:e.target.value})} type="password" placeholder="请输入密码" />
                                    )
                                }
                            </FormItem>
                            <FormItem
                             label="重复密码" 
                             {...formItemLayout} 
                             validateStatus={this.state.formStatus}
                             help={this.state.statusText}
                             >
                                {
                                    getFieldDecorator("_password",{
                                        rules: [
                                            { required: true, message: '密码不能为空' }
                                        ],
                                    })(
                                        <Input prefix={<Icon type="lock" />}
                                        onChange={(e)=>this.setState({pwd_2:e.target.value})}
                                        onBlur={()=>{
                                            if(this.state.pwd_1 != this.state.pwd_2){
                                                this.setState({
                                                    formStatus:"error",
                                                    statusText:"密码不一致"
                                                })
                                            }else{
                                                this.setState({
                                                    formStatus:"",
                                                    statusText:""
                                                })
                                            }
                                        }}
                                        type="password"
                                        placeholder="请输入密码" />
                                    )
                                }
                            </FormItem>
                            <FormItem label="用户名" {...formItemLayout}>
                                {
                                    getFieldDecorator("name")(
                                        <Input prefix={<Icon type="user" />} placeholder="请输入用户名" />
                                    )
                                }
                            </FormItem>
                            <FormItem label="性别" {...formItemLayout}>
                                {
                                    getFieldDecorator("sex",{
                                        initialValue:0
                                    })(
                                        <RadioGroup>
                                            <Radio value={0}>男</Radio>
                                            <Radio value={1}>女</Radio>
                                            <Radio value={2}>隐藏</Radio>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                            <FormItem label="生日" {...formItemLayout}>
                                {
                                    getFieldDecorator("birthday",{
                                        initialValue:moment(new Date())
                                    })(
                                        <DatePicker showTime={true}  placeholder="请输入日期" format="YYYY-MM-DD" />
                                    )
                                }
                            </FormItem>
                            <FormItem label="邮箱" {...formItemLayout}>
                                {
                                    getFieldDecorator("email",{
                                        // rules: [
                                        //     { required: true, message: '邮箱不能为空' }
                                        // ],
                                    })(
                                        <Input prefix={<Icon type="mail" />} placeholder="请输入邮箱" />
                                    )
                                }
                            </FormItem>
                            <FormItem label="个性简介" {...formItemLayout}>
                                {
                                    getFieldDecorator("Introduction")(
                                        <Input.TextArea placeholder="个性简介"/>
                                    )
                                }
                            </FormItem>
                            <FormItem>
                                <Link to="/login">去登录</Link>
                                <Button className="login-form-button" type="primary" htmlType="submit" >注册</Button>
                            </FormItem>
                        </Form>
                        
                </Card>
                </div>
                
            </div>
        );
    }
}

export default Form.create({ name: 'login' })(Login);;