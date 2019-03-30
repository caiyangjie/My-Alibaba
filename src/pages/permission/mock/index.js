import React, { Component } from 'react';
import {Card,Button, Modal,Form,Select,Input, message, Tree, Transfer} from 'antd'
import ETable from '../../../components/Etable'
import Utils from '../../../utils/utils';
import axios from '../../../axios';
import menuConfig from '../../../config/menuConfig'
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
class PerissionUser extends Component {

    state={
        isRoleVisible:false
    }
    
    componentWillMount(){
        this.requestList()
    }

    requestList = ()=>{
        axios.requestList(this,'/role/list',{})
    }

    //打开创建角色弹框
    handleRole = ()=>{
        this.setState({
            isRoleVisible:true
        })
    }
    //角色提交
    handleRoleSubmit =()=>{
        let data = this.roleForm.props.form.getFieldsValue();
        axios.ajax({
            url:'/role/create',
            data:{
                params:data
            }
        }).then((res)=>{
            if(res.code == 0){
                message.success(res.result)
                this.setState({
                    isRoleVisible:false
                })
                this.roleForm.props.form.resetFields();
                this.requestList()
            }
        })
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
            menuInfo:item.menus
        })
    }

    //权限提交
    handlePermEditSubmit = ()=>{
        let data = this.permForm.props.form.getFieldsValue();
        data.role_id = this.state.selectedItem.id;
        data.menus = this.state.menuInfo;
        axios.ajax({
            url:'permission/edit',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res.code == 0){
                this.setState({
                    isPermVisible:false
                })
                this.requestList()
                message.success(res.result)
            }
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
        this.getRoleUserList(item.id)
    }

    getRoleUserList = (id)=>{
        axios.ajax({
            url:"/role/user_list",
            data:{
                params:{
                    id
                }
            }
        }).then((res)=>{
            if(res.code == 0){
                this.getAuthUserList(res.result)
            }
        })
    }

    //筛选目标用户
    getAuthUserList = (dataSource)=>{
        const mockData = [];
        const targetKeys = [];
        if(dataSource && dataSource.length>0){
            for(let i=0;i<dataSource.length;i++){
              const data = {
                  key: dataSource[i].user_id,
                  title: dataSource[i].user_name,
                  status: dataSource[i].status
              }  
              if(data.status == 1){
                targetKeys.push(data.key);
              }
              mockData.push(data);
            }
            this.setState({
                mockData,
                targetKeys
            })
        }
    }
    //用户授权提交
    handleUserSubmit = ()=>{
        let data = {}
        data.user_ids = this.state.targetKeys;
        data.role_id = this.state.selectedItem.id;
        axios.ajax({
            url:'/role/user_role_edit',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res.code == 0){
                message.success("用户授权成功")
                this.setState({
                    isUserVisible:false
                })
                this.requestList()
            }
        })
    }

    render() {
        const columns = [
            {
                title:'角色ID',
                dataIndex:'id'
            },
            {
                title:'角色名称',
                dataIndex:'role_name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render(create_time){
                    return Utils.formateDate(create_time)
                }
            },
            {
                title:'使用状态',
                dataIndex:'status',
                render(status){
                    return status == 1?"启用":'停用'
                }
            },
            {
                title:'授权时间',
                dataIndex:'authorize_time',
                render: Utils.formateDate
            },
            {
                title:'授权人',
                dataIndex:'authorize_user_name'
            }
            
        ]
        return (
            <div>
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
                        getFieldDecorator("state")(
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
                        <Input disabled value={detail_Info.role_name} />
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                            {
                                getFieldDecorator("status",{
                                    initialValue:"1"
                                })(
                                    <Select>
                                        <Option value="1">启用</Option>
                                        <Option value="0">停用</Option>
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
                    <TreeNode title="平台权限" key="platform_all">
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

export default PerissionUser;
RoleForm = Form.create({})(RoleForm)
RoleAuthForm = Form.create({})(RoleAuthForm)
PermEditForm = Form.create({})(PermEditForm)
