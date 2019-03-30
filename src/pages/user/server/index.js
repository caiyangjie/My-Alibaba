import React, { Component } from 'react';
import { Card, Button, Modal, Form, Radio, DatePicker, Select, Input, message } from 'antd';
import axios from '../../../axios';
import Utils from '../../../utils/utils';
import ETable from '../../../components/Etable';
import BaseForm from '../../../components/BaseForm';
import moment from 'moment' ;
import utils from '../../../utils/utils';
import { connect } from 'react-redux';
import AV from 'leancloud-storage';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
class User extends Component {

    params = {
        paga:1,
        pageSize:10,
        skip:0
    }

    state = {
        isVisible:false
    }

    formList = [
        {
            type:'INPUT',
            label: '用户名',
            field: 'username',
            placeholder: '请输入用户名',
            width: 80,
        },
        {
            type:'INPUT',
            label: '职位',
            field: 'permission',
            placeholder: '请输入用户职位',
            width: 80,
        }
        ,
        {
            type:'时间查询2',
            label: '请选择入职日期',
            field: 'RangDate',
        }
    ]
    
    componentDidMount(){
        this.requestList()
    }

    handleFilter = (params)=>{
        this.params.specified= params;
        console.log(params);
        // var usernameyQuery = new AV.Query('personnel');
        // usernameyQuery.equalTo('username', params.username);
        // var permissionQuery = new AV.Query('personnel');
        // permissionQuery.equalTo('permission', params.permission);
        // var query = AV.Query.and(usernameyQuery, permissionQuery);
        // query.find().then(function (data) {
        //     console.log(data)
        //   }, function (error) {
        //     console.log(error)
        // });
        // var startDateQuery = new AV.Query('Todo');
        //     startDateQuery.greaterThanOrEqualTo('createdAt', new Date('2016-11-13 00:00:00'));
          
        //     var endDateQuery = new AV.Query('Todo');
        //     endDateQuery.lessThan('createdAt', new Date('2016-12-03 00:00:00'));
          
        //     var query = AV.Query.and(startDateQuery, endDateQuery);

        this.requestList();
    }

    requestList = ()=>{
        // axios.requestList(this,'user/list',this.params,false);
        var _data = [];
        var _this = this;
        // axios.requestList(this,'/personnel',{},true,this.props.sessionToken);
        var loading = document.getElementById("ajaxLoading");
        loading.style.display = "block";
        var query = new AV.Query('personnel');
        query.count().then(function (count) {
            console.log("总量");
            console.log(count);
            _this.params.total = count
        }, function (error) {
            console.log(error);
        });

        var query = new AV.Query('personnel');
        query.limit(this.params.pageSize);// 最多返回 10 条结果
        query.skip(this.params.skip);// 跳过 20 条结果
        if(this.params.specified){
            let username =  this.params.specified.username || ""
            let permission =  this.params.specified.permission || ""
            let RangDate =  this.params.specified.RangDate || ""
            var startDateQuery = new AV.Query('personnel');
            var endDateQuery = new AV.Query('personnel');
            let start,end =""
            if(RangDate[0]){
                start = (new Date(RangDate[0])).getTime();
                end = (new Date(RangDate[1])).getTime();
            }
            if(username && permission && RangDate){
                // var usernameyQuery = new AV.Query('personnel');
                // usernameyQuery.equalTo('username', username);
                // var permissionQuery = new AV.Query('personnel');
                // permissionQuery.equalTo('permission', permission);
                // startDateQuery.greaterThanOrEqualTo('birthday',start);
                // endDateQuery.lessThan('birthday', end);
                query = this.searchfFilter([{data:username,key:"username"},{data:permission,key:"permission"},{data:[start,end],key:"date"}],"all")
                // query = AV.Query.and(usernameyQuery, permissionQuery,startDateQuery,endDateQuery);
            }else if(username && permission){
                query = this.searchfFilter([{data:username,key:"username"},{data:permission,key:"permission"}],"single")
            }else if(username && RangDate){
                query = this.searchfFilter([{data:[start,end],key:"date"},{data:username,key:"username"}],"single")
            }else if(permission && RangDate){
                query = this.searchfFilter([{data:[start,end],key:"date"},{data:permission,key:"permission"}],"single")
            }else if(username || permission || RangDate)
            {
                if(username){
                    query.equalTo("username",username)
                }else if(permission){
                    query.equalTo('permission', permission)
                }else{
                    let start = (new Date(RangDate[0])).getTime();
                    let end = (new Date(RangDate[1])).getTime();
                    startDateQuery.greaterThanOrEqualTo('birthday',start);
                    endDateQuery.lessThan('birthday', end);
                    query = AV.Query.and(startDateQuery, endDateQuery);
                }
                
            }
            // let start = (new Date(this.params.specified.RangDate[0])).getTime();
            // let end = (new Date(this.params.specified.RangDate[1])).getTime();
            // var startDateQuery = new AV.Query('personnel');
            // startDateQuery.greaterThanOrEqualTo('birthday',start);
          
            // var endDateQuery = new AV.Query('personnel');
            // endDateQuery.lessThan('birthday', end);
          
            // var query = AV.Query.and(startDateQuery, endDateQuery);
            // query.greaterThanOrEqualTo('birthday',start);
        }
        
        query.find().then(function (data) {
            loading.style.display = "none";
            console.log(data)
            data.map((item,index)=>{
                _data.push(item.attributes)
                _data[index].key = index
                _data[index].objectId = item.id
            })
            console.log(_data)
            if( _this.params.specified){
                if(_this.params.specified.username || _this.params.specified.permission || _this.params.specified.RangDate != undefined){
                    _this.params.total = _data.length
                }
            }
            _this.setState({
                list:_data,
                pagination: utils.pagination(_this.params, (current)=>{
                        _this.params.page = current;
                        _this.params.skip = (current*10-10);
                        _this.requestList()
                },true)
            })
            console.log(_this.params)
        }, function (error) {
            loading.style.display = "none";
            console.log(error)
            message.warning("发生错误");
        });
    }

    //搜索框筛选
    searchfFilter = (arr,status)=>{
        var usernameyQuery = new AV.Query('personnel');
        var permissionQuery = new AV.Query('personnel');
        var startDateQuery = new AV.Query('personnel');
        var endDateQuery = new AV.Query('personnel');
        let filter = ["","",""];
        arr.map((item)=>{
            switch (item.key) {
                case "username":
                    usernameyQuery.equalTo('username', item.data);
                    filter[0]=1;
                    break;
                case "permission":
                    permissionQuery.equalTo('permission', item.data);
                    filter[1]=2;
                    break;
                case "date":
                    startDateQuery.greaterThanOrEqualTo('birthday',item.data[0]);
                    endDateQuery.lessThan('birthday', item.data[1]);
                    filter[2]=3;
                    break;
                default:
                    break;
            }
        })
        if(status == "all"){
            return AV.Query.and(usernameyQuery, permissionQuery,startDateQuery,endDateQuery)
        }else{
            if(filter[0] && filter[1]){
                return AV.Query.and(usernameyQuery, permissionQuery)
            }
            if(filter[0] && filter[2]){
                return AV.Query.and(usernameyQuery,startDateQuery,endDateQuery)
            }else{
                return AV.Query.and(permissionQuery,startDateQuery,endDateQuery)
            }
        }
    }


    //功能区操作
    handleOperate = (type)=>{
        let item = this.state.selectedItem;
        if(type == 'create'){
            this.setState({
                type,
                isVisible:true,
                title:"创建员工"
            })
        }else if(type == 'edit'){
            if(!item){
                Modal.info({
                    title:"提示",
                    content: '请选择一个用户'
                })
                return
            }
            this.setState({
                type,
                isVisible:true,
                title:"编辑员工",
                userInfo:item
            })
        }else if(type == "detail"){
            this.setState({
                type,
                isVisible:true,
                title:'员工详情',
                userInfo:item
            })
        }else{
            if(!item){
                Modal.info({
                    title:"提示",
                    content: '请选择一个用户'
                })
                return
            }
            let _this = this;
            Modal.confirm({
                title:"确认删除",
                content:"是否要删除当前选中的员工",
                onOk(){
                    axios.ajax({
                        url:'/user/delete',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.code == 0){
                            Modal.info({
                                title:"提示",
                                content:res.result
                            })
                            _this.setState({
                                isVisible:false,
                                selectedRowKeys:false
                            })
                            
                            _this.requestList()
                        }
                    })
                }
            })
        }
    }

    //创建员工提交
    handleSubmit =()=>{
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        axios.ajax({
            url:type == "create"?'/user/add': "/user/edit",
            data:{
                params: data
            }
        }).then((res)=>{
            if(res.code == 0){
                this.setState({
                    isVisible:false
                })
                this.userForm.props.form.resetFields();
                this.requestList()
            }
        })
    }
    //获取分页
    getPage = (page)=>{
        console.log("config: "+page)
        console.log("页数: "+page.current)
        console.log("条数: "+page.pageSize)
    }

    render() {
        const columns =[
            {
                title:"id",
                dataIndex: 'user_id',
                // sorter: (a, b) => a.user_id - b.user_id,   //会发生行选中出错,除非关闭行选中既可开启排序
                // sortDirections: ['descend', 'ascend'],
            },
            {
                title:"用户名",
                dataIndex: 'username'
            },
            {
                title:"性别",
                dataIndex: 'sex',
                render(sex){
                    switch (sex) {
                        case 0: return "男"
                            break;
                        case 1: return "女"
                            break;
                        case 2: return "隐藏"
                            break;
                        default: return "获取错误"
                            break;
                    }
                }
            },
            {
                title:"职位",
                dataIndex: 'permission',
                
            },
            {
                title:"邮箱",
                dataIndex: 'email'
            },
            {
                title:"生日",
                dataIndex: 'birthday',
                render(birthday){
                    if(birthday != "未知"){
                        return Utils.formateDate(birthday)
                    }else return birthday
                }
            }
        ]
        let footer = "";
        if(this.state.type == "detail"){
            footer = {
                footer : null
            }
        }
        return (
            <div>
                <Card>
                    <BaseForm  formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <Card style={{marginTop:10}} className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={() =>this.handleOperate('create')}>创建员工</Button>
                    <Button type="primary" icon="edit" onClick={() =>this.handleOperate('edit')}>编辑员工</Button>
                    <Button type="primary" onClick={() =>this.handleOperate('detail')}>员工详情</Button>
                    <Button type="primary" icon="delete" onClick={() =>this.handleOperate('delete')}>删除员工</Button>
                </Card>
                <div className="content-wrap">
                    <ETable 
                         updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        //  getPage = {this.getPage}
                         columns={columns}
                         dataSource={this.state.list}
                         pagination={this.state.pagination}
                         selectedRowKeys={this.state.selectedRowKeys}
                         selectedItem={this.state.selectedItem}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible:false
                        })
                    }}
                    width={600}
                    {...footer}
                >
                    <UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst)=>{this.userForm = inst}} />
                </Modal>
            </div>
        );
    }
}

class UserForm extends Component{
    
    getState = (state)=>{
        return {
            '1':'咸鱼一条',
            '2':'风华浪子',
            "3":"北大才子一枚",
            "4":"百度FE",
            "5":"创业者"
        }[state]
    }

    render(){
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout ={
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        return (
            <Form layout="horizontal">
                <FormItem label="用户名" {...formItemLayout}>
                    {
                        type == "detail"? userInfo.username :
                        getFieldDecorator("user_name",{
                            initialValue:userInfo.username
                        })(
                            <Input type="text" placeholder="请输入用户名" />
                        )
                    }
                </FormItem>
                <FormItem label="性别" {...formItemLayout}>
                    {
                        type == "detail"? userInfo.sex == 0?"男":userInfo.sex == 1?"女" :"隐藏":
                        getFieldDecorator("sex",{
                            initialValue:userInfo.sex
                        })(
                            <RadioGroup>
                                <Radio value={0}>男</Radio>
                                <Radio value={1}>女</Radio>
                                <Radio value={2}>隐藏</Radio>
                            </RadioGroup>  
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                         type == "detail"?  userInfo.permission:
                        getFieldDecorator("state",{
                            initialValue:userInfo.state
                        })(
                            <Select>
                                <Option value={1}>咸鱼一条</Option>
                                <Option value={2}>风华浪子</Option>
                                <Option value={3}>北大才子一枚</Option>
                                <Option value={4}>百度FE</Option>
                                <Option value={5}>创业者</Option>
                            </Select>  
                        )
                    }
                </FormItem>
                <FormItem label="生日" {...formItemLayout}>
                    {
                         type == "detail"? Utils.formateDate(userInfo.birthday) :
                        getFieldDecorator("birthday",{
                            initialValue:moment(userInfo.birthday)
                        })(
                            <DatePicker />
                        )
                    }
                </FormItem>
                <FormItem label="邮箱" {...formItemLayout}>
                    {
                        type == "detail"? userInfo.email :
                        getFieldDecorator("email",{
                            initialValue:userInfo.email                      
                        })(
                            <Input placeholder="请输入邮箱"/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
//获取数据源
const mapStateToProps = state =>{
    return {
        sessionToken:state.sessionToken,
    }
}


//将组建丢入radux内进行管理   链接传值(值)(链接头)
export default connect(mapStateToProps)(User);

UserForm = Form.create({})(UserForm)