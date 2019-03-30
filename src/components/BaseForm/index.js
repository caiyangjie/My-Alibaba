import React, { Component } from 'react';
import {Input, Select, Form, Button, Checkbox, Radio, DatePicker} from 'antd';
import Utils from './../../utils/utils'
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class FilterForm extends Component {
    
    handleFilterSubmit = () =>{
        let fieldValue = this.props.form.getFieldsValue();
        //调用父组件方法,将子组件的值传递给父组件
        this.props.filterSubmit(fieldValue)
    }

    reset = () =>{
        this.props.form.resetFields();
    }

    initFormList = ()=>{
        const { getFieldDecorator } = this.props.form;
        //获取需要创建的数据
        const formList = this.props.formList;
        const formItemList = [];
        if(formList && formList.length>0){
            formList.map((item)=>{
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || "";
                let placeholder = item.placeholder;
                let width = item.width;
                if(item.type == "时间查询1"){
                    const begin_time = <FormItem label="订单时间" key="begin_time">
                        {
                            getFieldDecorator('begin_time')(
                                <DatePicker showTime={true}  placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>
                    formItemList.push(begin_time)
                    const end_time = <FormItem label="~" colon={false} key="end_time">
                        {
                            getFieldDecorator('end_time',{
                            })(
                                <DatePicker showTime={true}  placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>
                    formItemList.push(end_time)
                }else if(item.type == "时间查询2"){
                    const RangData = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field)(
                                <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['开始时间', '结束时间']}
                              />
                            )
                        }
                    </FormItem>
                    formItemList.push(RangData)
                } else if (item.type === '城市') { //城市
                    const City = (
                        <FormItem label={"城市"} key="city">
                            {getFieldDecorator('city', {
                                initialValue: '0',
                            })(<Select
                                style={{ width: 80 }}
                                placeholder={placeholder}
                            >
                                {Utils.getOptionList([{ id: '0', name: '全部' }, { id: '1', name: '北京' }, { id: '2', name: '上海' }, { id: '3', name: '天津' }, { id: '4', name: '深圳' }])}
                            </Select>)}
                        </FormItem>
                    )
                    formItemList.push(City)
                } else if(item.type == 'INPUT'){
                    const INPUT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <Input type="text" placeholder={placeholder} />
                            )
                        }
                    </FormItem>
                    formItemList.push(INPUT)
                }else if(item.type == 'SELECT'){
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <Select 
                                    style={{width:width}}
                                    placeholder={placeholder}
                                >
                                    {Utils.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>
                    formItemList.push(SELECT)
                }else if(item.type == 'CHECKBOX'){
                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator(field,{
                                valuePropName:"checked",
                                initialValue: initialValue  //true | false
                            })(
                                <Checkbox>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>
                    formItemList.push(CHECKBOX)
                }else if(item.type == 'DATE'){
                    const DATE = <FormItem label={label} key={label}>
                        {
                            getFieldDecorator(field,{
                            })(
                                <DatePicker showTime={true}  placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>
                    formItemList.push(DATE)
                }
            })
        }
        return formItemList
    }

    render() {
        return (
            <Form layout="inline">
                {this.initFormList()}
                <FormItem>
                    <Button type="primary" style={{margin: '0 20px'}} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}> 重置 </Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create({})(FilterForm);