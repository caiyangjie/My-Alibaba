import React, { Component } from 'react';
import {Card,Button, Modal,Form,Select,Input, message, Tree, Transfer} from 'antd'
import ETable from '../../../components/Etable'
import Utils from '../../../utils/utils';
import axios from '../../../axios';
import _axios from 'axios';
import menuConfig from '../../../config/menuConfig';
import AV from 'leancloud-storage';
import BaseForm from '../../../components/BaseForm';
import { connect } from 'react-redux';
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
class PerissionUser extends Component {

    state={
        isRoleVisible:false
    }
    formList = [
        {
            type:'时间查询2',
            label: '请选择创建时间',
            field: 'RangDate',
        }
    ]
    
    componentWillMount(){
        this.requestList()
    }

    requestList = ()=>{
        const _this = this
        // axios.requestList(this,'/role/list',{})
        axios.requestList(this,'/permission',{},true,this.props.sessionToken)
        
        // var query = new AV.Query('permission');
        // //   query.startsWith('Role', '管理');
        // query.find().then(function (result) {
        //     let list = []
        //     if (result.length > 0) {
        //         result.map((res)=>{
        //             var arr = new Object()
        //             arr.id = res.attributes.id;
        //             arr.authorizeuser = res.attributes.authorizeuser;
        //             arr.role_name = res.attributes.role_name;
        //             // arr.createdAt = new Date(res.createdAt);
        //             // arr.updatedAt = new Date(res.updatedAt);
        //             list.push(arr)
        //         })
        //     }
        //     console.log(result)
        //     console.log(list[0].id)
        //     console.log(list)
        //     _this.setState({
        //         list:list
        //     }) 
        // });
    }

    //打开创建角色弹框
    handleRole = ()=>{
        this.setState({
            isRoleVisible:true
        })
    }
    //角色提交
    handleRoleSubmit =()=>{
        const _this = this;
        let data = this.roleForm.props.form.getFieldsValue();
        console.log(data)
        // 声明类型
        var TodoFolder = AV.Object.extend('permission');
        // 新建对象
        var todoFolder = new TodoFolder();
        // 设置名称
        todoFolder.set('role_name',data.role_name);
        // 设置优先级
        todoFolder.set('status',data.status);
        todoFolder.set('authorizeuser', this.props.name);
        todoFolder.save().then(function (todo) {
            console.log(todo);
            console.log('objectId is ' + todo.id);
            _this.setState({
                isRoleVisible:false
            })
            _this.requestList()
        }, function (error) {
            console.error(error);
            _this.setState({
                isRoleVisible:false
            })
        });
        
    }

    //权限设置
    handelePermission = () =>{
        let item = this.state.selectedItem;
        if(!item){
            Modal.info({
                content:"请选择一个角色"
            })
            return;
        }
        this.setState({
            isPermVisible:true,
            detailInfo:item,
            menuInfo:item.permission
        })
    }

    //权限提交
    handlePermEditSubmit = ()=>{
        let data = this.permForm.props.form.getFieldsValue();
        data.role_id = this.state.selectedItem.id;
        data.menus = this.state.menuInfo;
        console.log(data)
        // axios.ajax({
        //     url:'permission/edit',
        //     data:{
        //         params:{
        //             ...data
        //         }
        //     }
        // }).then((res)=>{
        //     if(res.code == 0){
        //         this.setState({
        //             isPermVisible:false
        //         })
        //         this.requestList()
        //         message.success(res.result)
        //     }
        // })
        
        //  // 第一个参数是 className，第二个参数是 objectId
        //  var todo = AV.Object.createWithoutData('permission', '5c8dba318d6d810070e495bd');
        //  // 修改属性
        //  todo.set('permission', data.menus);
        //  // 保存到云端
        //  todo.save().then((res)=>{
        //      console.log(res)
        //  });

        var query = new AV.Query('permission');
        query.startsWith('role_name', data.role_name);
        query.find().then((result)=>{
            // 第一个参数是 className，第二个参数是 objectId
            var todo = AV.Object.createWithoutData('permission', result[0].id);
            // 修改属性
            todo.set('permission', data.menus);
            todo.set('status', data.status);
            todo.set('authorizeuser', this.props.name);
            // 保存到云端
            todo.save().then((res)=>{
                this.setState({
                    isPermVisible:false
                })
                this.requestList()
                message.success("保存成功")
            });
        })
    }

     //用户授权
     handleUserAuth = ()=>{
        let item = this.state.selectedItem;
        if(!item){
            Modal.info({
                content:"请选择一个角色"
            })
            return;
        }
        this.setState({
            isUserVisible:true,
            detailInfo:item
        })
        this.getRoleUserList(item.role_name)
    }

    getRoleUserList = (permission)=>{
        axios.ajax({
            // url:"/role/user_list",
            url:"/personnel",
            isServer:true,
            sessionToken:this.props.sessionToken
        }).then((res)=>{
            // this.getAuthUserList(res.result)
            this.getAuthUserList(res.results,permission)
        })
    }

    //筛选目标用户
    getAuthUserList = (dataSource,permission)=>{
        const mockData = [];
        const targetKeys = [];
        if(dataSource && dataSource.length>0){
            for(let i=0;i<dataSource.length;i++){
                if(permission != '未分配'){
                    if(dataSource[i].status == "0"){
                        const data = {
                            key: dataSource[i].user_id,
                          //   title: dataSource[i].user_name,
                            title: dataSource[i].username,
                            permission: dataSource[i].permission
                        }  
                        mockData.push(data);
                    }
                    // if(data.permission == permission){
                    //     targetKeys.push(data.key);
                    // }
                }else{
                    const data = {
                        key: dataSource[i].user_id,
                        //   title: dataSource[i].user_name,
                        title: dataSource[i].username,
                        permission: dataSource[i].permission
                    }  
                    if(data.permission == "未分配"){
                        targetKeys.push(data.key);
                    }
                    mockData.push(data);
                }
              
              
            }
            this.setState({
                mockData,
                targetKeys
            })
        }
    }
    //用户授权提交
    handleUserSubmit = ()=>{
        let data = {};
        const _this = this;
        data.user_ids = this.state.targetKeys;
        data.role_name = this.state.selectedItem.role_name;
        var query = new AV.Query('personnel');
        query.find().then(function (todos) {
            console.log(todos)
            todos.forEach(function(todo) {
                if(data.user_ids.indexOf(todo.attributes.user_id) != -1){
                    // if(data.role_name == "管理"){
                    //     axios.ajax({
                    //         url:'roles/5c8db67cfe88c20070996e1c',
                    //         data:{
                    //             "users": {
                    //                 "__op": "addRelation",
                    //                 "objects": [
                    //                     {
                    //                         "__type": "Pointer",
                    //                         "className": "_User",
                    //                         "objectId": "5c8e1dac12215f0072bcc0ed"
                    //                     }
                    //                 ]
                    //             }
                    //         }
                    //     })
                    // }else 
                    if(data.role_name == "未分配"){
                        
                        if(todo.attributes.permission  == "管理"){
                            _axios({
                                method: 'put',
                                url: 'https://o2sr0ojd.api.lncld.net/1.1/roles/5c8db67cfe88c20070996e1c',
                                data: {
                                    "users": {
                                      "__op": "RemoveRelation",
                                      "objects": [
                                        {
                                          "__type": "Pointer",
                                          "className": "_User",
                                          "objectId": todo.attributes.fatherId
                                        }
                                      ]
                                    }
                                  },
                                headers: {
                                    'X-LC-Id': 'O2sR0ojdz2eP811aIwtlDUVH-gzGzoHsz',
                                    'X-LC-Key': 'vvtzU9hVqx8Jd8xiCIu4Ere0',
                                    'X-LC-Session': _this.props.sessionToken
                                }

                            }).then((res)=>{
                                console.log(res)
                            }).catch((error)=>{
                                console.log(error)
                            })
                        }
                        todo.set('permission', data.role_name);
                        todo.set('status', "0");
                    }else{
                        if(data.role_name  == "管理"){
                            _axios({
                                method: 'put',
                                url: 'https://o2sr0ojd.api.lncld.net/1.1/roles/5c8db67cfe88c20070996e1c',
                                data: {
                                    "users": {
                                      "__op": "AddRelation",
                                      "objects": [
                                        {
                                          "__type": "Pointer",
                                          "className": "_User",
                                          "objectId": todo.attributes.fatherId
                                        }
                                      ]
                                    }
                                  },
                                headers: {
                                    'X-LC-Id': 'O2sR0ojdz2eP811aIwtlDUVH-gzGzoHsz',
                                    'X-LC-Key': 'vvtzU9hVqx8Jd8xiCIu4Ere0',
                                    'X-LC-Session': _this.props.sessionToken
                                }

                            }).then((res)=>{
                                console.log(res)
                            }).catch((error)=>{
                                console.log(error)
                            })
                        }
                        todo.set('permission', data.role_name);
                        todo.set('status', "1");
                    }
                }
            });
            return AV.Object.saveAll(todos);
        }).then((res)=>{
            console.log(res);
            message.success("用户授权成功")
            this.setState({
                isUserVisible:false
            })
        }).catch((error)=>{
            console.log(error)
        })
        // axios.ajax({
        //     url:'/role/user_role_edit',
        //     data:{
        //         params:{
        //             ...data
        //         }
        //     }
        // }).then((res)=>{
        //     if(res.code == 0){
        //         message.success("用户授权成功")
        //         this.setState({
        //             isUserVisible:false
        //         })
        //         this.requestList()
        //     }
        // })
    }
    handleFilter = (value)=>{
        console.log(value)
        console.log(value.RangDate)
        var startDateQuery = new AV.Query('permission');
        startDateQuery.greaterThanOrEqualTo('createdAt', new Date(value.RangDate[0]));
  
        var endDateQuery = new AV.Query('permission');
        endDateQuery.lessThan('createdAt', new Date(value.RangDate[1]));
  
        var query = AV.Query.and(startDateQuery, endDateQuery);
        query.find().then((res)=>{
            console.log(res)
        }).catch((error)=>{
            console.log(error)
        })
    }

    render() {
        const columns = [
            {
                title:'角色ID',
                dataIndex:'id',
            },
            {
                title:'角色名称',
                dataIndex:'role_name'
            },
            {
                title:'创建时间',
                dataIndex:'createdAt',
                width:200,
                render(create_time){
                    return Utils.formateDate(create_time)
                }
            },
            {
                title:'使用状态',
                dataIndex:'status',
                render(status){
                    return status === 1?"启用":'停用'
                }
            },
            {
                title:'授权时间',
                dataIndex:'updatedAt',
                width:200,
                render: Utils.formateDate
            },
            {
                title:'授权人',
                dataIndex:'authorizeuser'
            }
            
        ]
        return (
            <div>
                <Card>
                    <BaseForm  formList={this.formList} filterSubmit={this.handleFilter}/> 示例暂无启用
                </Card>
                <Card>
                    <Button type="primary" style={{marginRight:10}} onClick={this.handleRole}>创建角色</Button>
                    <Button type="primary" style={{marginRight:10}} onClick={this.handelePermission}>设置权限</Button>
                    <Button type="primary" onClick={this.handleUserAuth}>用户授权</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        columns={columns}
                        dataSource={this.state.list}
                    />
                </div>
                <Modal
                    title="创建角色"
                    visible={this.state.isRoleVisible}
                    onOk={this.handleRoleSubmit}
                    onCancel={()=>{
                        this.roleForm.props.form.resetFields();
                        this.setState({
                            isRoleVisible:false
                        })
                    }}
                >
                    <RoleForm wrappedComponentRef={(inst)=>this.roleForm=inst}></RoleForm>
                </Modal>
                <Modal
                    title="设置权限"
                    visible={this.state.isPermVisible}
                    width={600}
                    onOk={this.handlePermEditSubmit}
                    onCancel={()=>{
                        this.setState({
                            isPermVisible:false
                        })
                    }}
                >
                    <PermEditForm 
                        detailInfo={this.state.detailInfo} 
                        menuInfo={this.state.menuInfo}
                        patchMenuInfo={(checkedKeys)=>{
                            this.setState({
                                menuInfo: checkedKeys
                            })
                        }}
                        wrappedComponentRef={(inst=>this.permForm=inst)}
                    />
                </Modal>
                <Modal
                    title="用户授权"
                    visible={this.state.isUserVisible}
                    width={800}
                    onOk={this.handleUserSubmit}
                    onCancel={()=>{
                        this.setState({
                            isUserVisible:false
                        })
                    }}
                >
                    <RoleAuthForm 
                        detailInfo={this.state.detailInfo} 
                        targetKeys={this.state.targetKeys}
                        mockData={this.state.mockData}
                        wrappedComponentRef={(inst=>this.userAuthForm=inst)}
                        patchUserInfo={(targetKeys)=>{
                            this.setState({
                                targetKeys
                            })
                        }}
                    />
                </Modal>
            </div>
        );
    }
}

class RoleForm extends Component{
    
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
                <FormItem label="角色名称" {...formItemLayout}>
                    {
                        type == "detail"? userInfo.username :
                        getFieldDecorator("role_name")(
                            <Input type="text" placeholder="请输入角色名称" />
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator("state",{
                            initialValue:1
                        })(
                            <Select>
                                <Option value={1}>开启</Option>
                                <Option value={0}>关闭</Option>
                            </Select>  
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}

class PermEditForm extends Component{

    renderTreeNodes = (data)=>{
        return data.map((item)=>{
            if(item.children) {
                return <TreeNode title={item.title} key={item.key}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            }else{
                return <TreeNode {...item}></TreeNode>
            }
        })
    }

    onCheck = (checkedKeys) =>{
        this.props.patchMenuInfo(checkedKeys)
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout ={
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        const detail_Info = this.props.detailInfo
        const menuInfo = this.props.menuInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                            {
                                getFieldDecorator("role_name",{
                                    initialValue:detail_Info.role_name
                                })(
                                    <Input disabled />
                                )
                            }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                            {
                                getFieldDecorator("status",{
                                    initialValue:detail_Info.status
                                })(
                                    <Select>
                                        <Option value={1}>启用</Option>
                                        <Option value={0}>停用</Option>
                                    </Select>
                                )
                            }
                </FormItem>
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={(checkedKeys)=>{
                        this.onCheck(checkedKeys)
                    }}
                    checkedKeys={menuInfo}
                >
                    <TreeNode title="平台权限">
                            {this.renderTreeNodes(menuConfig)}
                    </TreeNode>
                </Tree>
            </Form>
        );
    }
}

class RoleAuthForm extends Component{

    renderTreeNodes = (data)=>{
        return data.map((item)=>{
            if(item.children) {
                return <TreeNode title={item.title} key={item.key}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            }else{
                return <TreeNode {...item}></TreeNode>
            }
        })
    }

    onCheck = (checkedKeys) =>{
        this.props.patchMenuInfo(checkedKeys)
    }

    filterOption = (inputValue, option)=>{
        return option.title.indexOf(inputValue) > -1;
    }

    handleChange = (targetKeys) =>{
        this.props.patchUserInfo(targetKeys)
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout ={
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        const detail_Info = this.props.detailInfo
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                        <Input disabled value={detail_Info.role_name} />
                </FormItem>
                <FormItem label="选择用户" {...formItemLayout}>
                    <Transfer 
                        listStyle={{widht:200,height:400}}
                        dataSource={this.props.mockData}
                        titles={['待选用户','已选用户']}
                        showSearch
                        searchPlaceholder="输入用户名"
                        filterOption={this.filterOption}
                        targetKeys={this.props.targetKeys}
                        onChange={this.handleChange}
                        render={item=>item.title}
                    />
                </FormItem>
                
            </Form>
        );
    }
}
//获取数据源
const mapStateToProps = state =>{
    return {
        sessionToken:state.sessionToken,
        name:state.name
    }
}


//将组建丢入radux内进行管理   链接传值(值)(链接头)
export default connect(mapStateToProps)(PerissionUser);
RoleForm = Form.create({})(RoleForm)
RoleAuthForm = Form.create({})(RoleAuthForm)
PermEditForm = Form.create({})(PermEditForm)
