import React, { Component } from 'react';
import { Card, Form, Button, Input, Checkbox, Modal, Radio, Select, Switch, DatePicker, TimePicker, Upload, Icon, message, InputNumber } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;
class Register extends Component {

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [{
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
      };
    
      handleCancel = () => this.setState({ previewVisible: false })
    
      handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      }

    handleChange = ({ fileList }) => this.setState({ fileList })

    handleSubmit = () =>{
        let userInfo = this.props.form.getFieldsValue();
        console.log(JSON.stringify(userInfo))
        this.props.form.validateFields((err,values)=>{
            if(!err){
                message.success(`${userInfo.userName} 恭喜你, 您通过了本次表单组件学习,当前密码为: ${userInfo.userPwd}`)
            }
        })
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const { getFieldDecorator }= this.props.form;
        const formItemLayout = {
            labelCol:{
                xs:24,
                sm:4
            },
            wrapperCol:{
                xs:24,
                sm:12
            }
        }
        const offsetlayout = {
            wrapperCol:{
                xs:24,
                sm:{
                    span:12,
                    offset:4
                }
            }
        }
        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        return (
            <div>
                <Card title="注册表单">
                    <Form layout="horizontal">
                        <FormItem label="用户名" {...formItemLayout}>
                            {
                                getFieldDecorator('userName',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    initialValue:'',  //初始化值
                                    rules:[
                                        {
                                            required:true,
                                            message:'用户名不能为空'
                                        }
                                    ]
                                })(<Input placeholder="请输入用户名"/>)
                            }
                        </FormItem>
                        <FormItem label="密码" {...formItemLayout}>
                            {
                                getFieldDecorator('userPwd',{
                                    rules:[
                                        {
                                            required:true,
                                            message:'请输入密码'
                                        }
                                    ]
                                })(<Input type="password" placeholder="请输入密码"/>)
                            }
                        </FormItem>
                        <FormItem label="性别" {...formItemLayout}>
                            {
                                getFieldDecorator('sex',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    initialValue:'1',  //初始化值
                                })(
                                    <RadioGroup>
                                        <Radio value="1">男</Radio>
                                        <Radio value="2">女</Radio>
                                    </RadioGroup>
                                )
                            }
                        </FormItem>
                        <FormItem label="年龄" {...formItemLayout}>
                            {
                                getFieldDecorator('age',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    initialValue:18,  //初始化值
                                })(
                                    <InputNumber />
                                )
                            }
                        </FormItem>
                        <FormItem label="当前状态" {...formItemLayout}>
                            {
                                getFieldDecorator('state',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    initialValue:'1',  //初始化值
                                })(
                                    <Select>
                                        <Option value="1">咸鱼一条</Option>
                                        <Option value="2">风华浪子</Option>
                                        <Option value="3">北大才子一枚</Option>
                                        <Option value="4">百度FE</Option>
                                        <Option value="5">创业者</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="爱好" {...formItemLayout}>
                            {
                                getFieldDecorator('interest',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    initialValue:['1','5'],  //初始化值
                                })(
                                    <Select mode='multiple'>
                                        <Option value="1">有用</Option>
                                        <Option value="2">打篮球</Option>
                                        <Option value="3">踢足球</Option>
                                        <Option value="4">跑步</Option>
                                        <Option value="5">爬上</Option>
                                        <Option value="6">骑行</Option>
                                        <Option value="7">桌球</Option>
                                        <Option value="8">麦霸</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="是否已婚" {...formItemLayout}>
                            {
                                getFieldDecorator('isMarried',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    valuePropName: 'checked',
                                    initialValue:true,  //初始化值
                                })(
                                    <Switch />
                                )
                            }
                        </FormItem>
                        <FormItem label="生日" {...formItemLayout}>
                            {
                                getFieldDecorator('birthday',{   //一个是表单字段对象.第二个则是验证的值和规则
                                    initialValue:moment('2018-08-08 12:00:00'),  //初始化值
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="联系地址" {...formItemLayout}>
                            {
                                getFieldDecorator('address',{
                                    initialValue:"广州市白云区马务广场"
                                })(
                                    <TextArea
                                        autosize={
                                            {
                                                minRows:4,
                                                MaxRows:5
                                            }
                                        }
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="早起时间" {...formItemLayout}>
                            {
                                getFieldDecorator('time')(
                                    <TimePicker  />
                                )
                            }
                        </FormItem>
                        <FormItem label="头像" {...formItemLayout}>
                            {
                                getFieldDecorator('userImg')(
                                    <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    >
                                    {fileList.length >= 3 ? null : uploadButton}
                                    </Upload>
                                )
                            }
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </FormItem>
                        <FormItem {...offsetlayout} >
                            {
                                getFieldDecorator('agreement')(
                                    <Checkbox>我已阅读过<a href="#">协议</a></Checkbox>
                                )
                            }
                        </FormItem>
                        <FormItem {...offsetlayout} >
                            <Button type="primary" onClick={this.handleSubmit}>注册</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
}
export default Form.create()(Register);