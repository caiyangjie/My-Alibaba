import React, { Component } from 'react';
import {Card, Form, Input, Button, message, Icon, Checkbox} from 'antd';

const FomrItem = Form.Item;

class FormLogin extends Component {

    handleSubmit = () =>{
        let userInfo = this.props.form.getFieldsValue();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                message.success(`${userInfo.userName} 恭喜你, 您通过了本次表单组件学习,当前密码为: ${userInfo.userPwd}`)
            }
        })
    }

    render() {
        const { getFieldDecorator }= this.props.form;
        return (
            <div>
                <Card title="登录行内表单">
                    <Form layout="inline">
                        <FomrItem>
                            <Input  placeholder="清输入用户名"/>
                        </FomrItem>
                        <FomrItem>
                            <Input  placeholder="请输入密码"/>
                        </FomrItem>
                        <FomrItem>
                            <Button type="primary">登录</Button>
                        </FomrItem>
                    </Form>
                </Card>
                <Card title="登录行内表单" style={{marginTop:10}}>
                    <Form style={{width:300}}>
                        <FomrItem>
                            {
                                getFieldDecorator('userName',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    initialValue:'',  //初始化值
                                    rules:[
                                        {
                                            required:true,
                                            message:'用户名不能为空'
                                        },
                                        {
                                            min:5,
                                            max:10,
                                            message:"长度不在范围内"
                                        },
                                        {
                                            // pattern:new RegExp(/^\w+$/,'g'),
                                            pattern:new RegExp('^\\w+$','g'),
                                            message:"用户名必须为字母或者数字"
                                        }
                                    ]
                                })(<Input prefix={<Icon type="user" />} placeholder="清输入用户名"/>)
                            }
                        </FomrItem>
                        <FomrItem>
                            {
                                getFieldDecorator('userPwd',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    initialValue:'',  //初始化值
                                    rules:[]
                                })(<Input prefix={<Icon type="lock" />} placeholder="请输入密码"/>)
                            }
                        </FomrItem>
                        <FomrItem>
                            {
                                getFieldDecorator('remember',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    valuePropName:'checked', //初始化checkbox值
                                    initialValue:true  //初始化值
                                })(<Checkbox >记住密码</Checkbox>)
                            }
                            <a href="#" style={{float:'right'}}>忘记密码</a>
                        </FomrItem>
                        <FomrItem>
                            <Button type="primary" onClick={this.handleSubmit}>登录</Button>
                        </FomrItem>
                    </Form>
                </Card>
            </div>
        );
    }
}

 export default Form.create()(FormLogin);