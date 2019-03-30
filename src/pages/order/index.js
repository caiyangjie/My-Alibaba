import React, { Component } from 'react';
import { Card, Button, Table, Form, Select, Modal, message, DatePicker } from 'antd';
import axios from './../../axios';
import Utils from './../../utils/utils';
import BaseForm from './../../components/BaseForm';
const FormItem = Form.Item;
const { Option } = Select;
class Orders extends Component {

    constructor(props){
        super(props);

        this.state={
            orderConfirmVisible:false,
            list:[],
            pagination: [],
            orderInfo:{}
        }
        this.formList = [
            {
                type:"SELECT",
                label:'城市',
                field:"city",
                placeholder: "全部",
                initialValue:'1',
                width:80,
                list:[{id:'0',name:"全部"},{id:'1',name:"北京"},{id:'2',name:"上海"},{id:'3',name:"天津"}]
            },
            {
                type:"时间查询"
            },
            {
                type:"SELECT",
                label:'订单查询',
                field:"order_status",
                placeholder: "全部",
                initialValue:'1',
                width:100,
                list:[{id:'0',name:"全部"},{id:'1',name:"进行中"},{id:'2',name:"结束行程"}]
            }
        ]
        this.params = {
            page:1
        }
    }

    componentDidMount(){
        this.requestList()
    }
    
    handleFilter = (params) =>{
        this.params = params;
        this.requestList();
    }

    requestList = () =>{
        const _this = this;
        axios.requestList(this,'/order/list',this.params,false);
    }

    //选择某一行订单
    onRowClick = (record, index) => {
        let selectKey = [index]

        this.setState({
            selectedRowKeys: selectKey,
            selectedItem: record
        })
        console.log(record);
    }

    //结束订单-确认车辆信息
    handleConfirm = () => {
        let item = this.state.selectedItem

        if (!item) {
            Modal.info({
                title: '温馨提示',
                content: '请选择需要操作的订单'
            })
            return
        }
        if (item.status === 2) {
            Modal.info({
                title: '温馨提示',
                content: '该订单行程已结束'
            })
            return
        }
        axios.ajax({
                url: '/order/ebike_info',
                data: {
                    params: {
                        orderId: item.id
                    }
                }
            })
            .then(res => {
                if (res.code === 0) {
                    this.setState({
                        orderInfo: res.result,
                        orderConfirmVisible: true
                    })
                }
            })
    }

    //结束订单
    handleFinishOrder = () => {
        let item = this.state.selectedItem
        axios.ajax({
                url: '/order/finish_order',
                data: {
                    params: {
                        orderId: item.id
                    }
                }
            })
            .then((res) => {
                if (res.code === 0) {
                    message.success(`${res.msg}`)
                    this.setState({
                        orderConfirmVisible: false,
                        selectedRowKeys:false
                    })
                    this.requestList()
                }
            })
    }

    //订单详情
    openOrderDetail = () =>{
        let item = this.state.selectedItem

        if (!item) {
            Modal.info({
                title: '温馨提示',
                content: '请选择需要操作的订单'
            })
            return
        }
        window.location.href= `/#/common/order/detail/${item.id}`
    }

    render() {
        const columns = [
            {
                title:"订单编号",
                dataIndex: 'orader_sn'
            },
            {
                title:"车辆编号",
                dataIndex: "bike_sn"
            },
            {
                title:"用户名",
                dataIndex: "user_name"
            },
            {
                title: '手机号',
                dataIndex: "mobile"
            },
            {
                title: "里程",
                dataIndex:"distance",
                width:80,
                render(distance){
                    return distance/1000 + "Km"
                }
            },
            {
                title: "行驶时长",
                dataIndex:"total_time"
            },
            {
                title: "状态",
                dataIndex:"status",
                render:(status)=>{
                    return status === 1 ? "进行中": "结束行程"
                }
            },
            {
                title: "开始时间",
                dataIndex:"start_time"
            },
            {
                title: "结束时间",
                dataIndex:"end_time"
            },
            {
                title: "订单金额",
                dataIndex:"total_fee"
            },
            {
                title: "实付金额",
                dataIndex:"user_pay"
            }
        ]
        const selectedRowKeys = this.state.selectedRowKeys
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onSelect:(record)=>{
                let selectKey = [record.key]
                this.setState({
                    selectedRowKeys: selectKey,
                    selectedItem: record
                })
            }
        }
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter.bind(this)}/>
                </Card>
                <Card style={{marginTop:10}}>
                    <Button type="primary" onClick={this.openOrderDetail}>订单详情</Button>
                    <Button type="primary" style={{marginLeft:10}} onClick={this.handleConfirm}>结束订单</Button>
                </Card>
                <div className="content-wrap">
                    <Table 
                         bordered
                         columns={columns}
                         dataSource={this.state.list}
                         pagination={this.state.pagination}
                         rowSelection={rowSelection}
                         selectedItem={this.state.selectedItem}
                         onRow={(record, index) => {
                            return {
                                onClick: () => {
                                    this.onRowClick(record, index)
                                }
                            }
                        }}
                    />
                </div>
                <Modal
                    title="结束订单"
                    visible={this.state.orderConfirmVisible}
                    onCancel={() => {
                        this.setState({
                            orderConfirmVisible: false
                        })
                    }}
                    onOk={this.handleFinishOrder}
                    width={400}
                >
                    < FinishOrderForm {...this.state.orderInfo} />
                </Modal>
            </div>
        );
    }
}

class FilterForm extends Component {
    render(){
        const { getFieldDecorator } = this.props.form;
        
        return (
            <Form layout="inline">
                <FormItem label="城市">
                    {
                        getFieldDecorator("city_id")(
                            <Select 
                            style={{width:100}}
                            placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">北京市</Option>
                                <Option value="2">天津市</Option>
                                <Option value="3">深圳市</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="订单时间">
                    {getFieldDecorator('start_time')(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" /> 
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('end_time')(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" /> 
                    )}
                </FormItem>
                
                <FormItem label="订单状态">
                    {getFieldDecorator('order_status')(
                        <Select
                            placeholder="全部"
                            style={{
                                width: 80
                            }}
                        >
                            <Option value=""> 全部 </Option>
                            <Option value="1"> 进行中 </Option>
                            <Option value="2"> 结束行程 </Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        style={{
                            margin: '0 20px'
                        }}
                        onClick={this.handleSearchClick}
                    >
                        查询
					</Button>
                    <Button onClick={this.handleReset}> 重置 </Button>
                </FormItem>
            </Form>
        )
    }
}

class FinishOrderForm extends Component {
    render() {
        const { bike_sn, battery, start_time, location } = this.props;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        }
        return (
            <Form layout="horizontal">
                <FormItem {...formItemLayout} label="车辆编号">
                    {bike_sn}
                </FormItem>
                <FormItem {...formItemLayout} label="剩余电量">
                    {battery + '%'}
                </FormItem>
                <FormItem {...formItemLayout} label="行程开始时间">
                    {start_time}
                </FormItem>
                <FormItem {...formItemLayout} label="当前位置">
                    {location}
                </FormItem>
            </Form>
        )
    }
}


export default Orders;

FilterForm = Form.create({})(FilterForm)
FinishOrderForm = Form.create({})(FinishOrderForm)
