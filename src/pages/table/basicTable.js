import React, { Component } from 'react';
import {Card,Table, Modal, message, Button} from 'antd';
import axios from './../../axios';
import utils from '../../utils/utils';
class BasicTable extends Component {

    state={
        dataSource2:[]
    }
    
    params = {
        page: 1
    }

    componentDidMount(){
        const dataSource =[
            {
                id: '0',
                userName: 'Jack',
                sex:'1',
                state:'1',
                interest:'1',
                birthday:"2000-01-01",
                address:"广州市白云区马务广场",
                time:'09:00'
            },
            {
                id: '1',
                userName: 'Timi',
                sex:'1',
                state:'1',
                interest:'1',
                birthday:"2000-01-01",
                address:"广州市白云区马务广场",
                time:'09:00'
            },
            {
                id: '2',
                userName: 'Tom',
                sex:'1',
                state:'1',
                interest:'1',
                birthday:"2000-01-01",
                address:"广州市白云区马务广场",
                time:'09:00'
            }
        ]
        dataSource.map((item,index)=>{
            item.key = index;
        })
        this.setState({
            dataSource
        })
        this.request();
    }
    
    //动态获取mock数据
    request = ()=>{
        let _this = this;
        axios.ajax({
            url:'/table/list',
            data:{
                params:{
                    page:this.params.page
                }
            }
        }).then((res)=>{
            if(res.code == '0'){
                this.setState({
                    dataSource2:res.result.list,
                    selectedRowKeys:[],
                    selectedItem:null,
                    pagination:utils.pagination(res,(current)=>{
                        _this.params.page = current;
                        this.request();
                    })
                })
            }
        })
    }

    onRowClick = (record, index) =>{
        let selectKey = [index];
        console.log(record);
        console.log(index);
        Modal.info({
            title:"信息",
            content:`用户名: ${record.userName},用户爱好: ${record.interest}`
        })
        this.setState({
            selectedRowKeys:selectKey,
            selectedItem:record
        })
    }

    //多选执行删除动作
    hanldDelete = () =>{
        let rows = this.state.selectedRows;
        let ids = [];
        rows.map((item)=>{
            ids.push(item.id)
        })
        Modal.confirm({
            title:"删除提示",
            content:`您确定要删除这些数据吗? ${ids.join(',')}`,
            onOk:()=>{
                message.success('删除成功');
                this.request();  //刷新页面
            }
        })
    }

    render() {
        const columns = [
            {
                title:'id',
                dataIndex:'id'
            },
            {
                title:'用户名',
                dataIndex:'userName'
            },
            {
                title:'性别',
                dataIndex:'sex',
                render(sex){
                    return sex == 1 ? "男" : "女";
                }
            },
            {
                title:'状态',
                dataIndex:'state',
                render(state){
                    let config = {
                        "1": '咸鱼一条',
                        "2": '风华浪子',
                        "3": '北大才子',
                        "4": '百度FE',
                        "5": '创业者'
                    };
                    return config[state];
                }
            },
            {
                title:'爱好',
                dataIndex:'interest',
                render(interest){
                    let config = {
                        "1": '游泳',
                        "2": '打篮球',
                        "3": '踢足球',
                        "4": '跑步',
                        "5": '爬山',
                        "6": '骑行',
                        "7": '桌球',
                        "8": '麦霸'
                    };
                    return config[interest];
                }
            },
            {
                title:'生日',
                dataIndex:'birthday'
            },
            {
                title:'地址',
                dataIndex:'address'
            },
            {
                title:'早起时间',
                dataIndex:'time'
            }
        ]
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            type:"radio",
            selectedRowKeys
        }
        const rowCheckSelection = {
            type:"checkbox",
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        }
        return (
            <div>
                <Card title="基础表格">
                    <Table
                        bordered
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                    />
                </Card>
                <Card title="动态数据渲染表格-Mock" style={{maring: '10px 0'}}>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={this.state.dataSource2}
                        pagination={false}
                    />
                </Card>
                <Card title="Mock-单选" style={{maring: '10px 0'}}>
                    <Table
                        bordered
                        rowSelection={rowSelection}
                        onRow={(record,index) => {
                            return {
                                onClick: () => {  //点击行
                                    this.onRowClick(record,index)
                                },
                                onMouseEnter: () => {},  //鼠标移入行
                            }
                        }}
                        columns={columns}
                        dataSource={this.state.dataSource2}
                        pagination={false}
                    />
                </Card>
                <Card title="Mock-复选" style={{maring: '10px 0'}}>
                    <div style={{marginBottom:10}}>
                        <Button onClick={this.hanldDelete} >删除</Button>
                    </div>
                    <Table
                        bordered
                        rowSelection={rowCheckSelection}
                        columns={columns}
                        dataSource={this.state.dataSource2}
                        pagination={false}
                    />
                </Card>
                <Card title="Mock-表格分页" style={{maring: '10px 0'}}>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={this.state.dataSource2}
                        pagination={this.state.pagination}
                    />
                </Card>
            </div>
        );
    }
}

export default BasicTable;