import React, { Component } from 'react';
import { Card, Button, Modal } from 'antd'; 
import './index.less';
class Modals extends Component {

    state={

    }

    hanleModals = (type) => {
        this.setState({
            [type]: true
        })
    }
    
    hanleConfirm = (type) => {
        Modal[type]({
            title:"确认",
            content:"你确定你学会React了吗",
            onOk(){
                console.log("Ok");
            },
            onCancel(){
                console.log("Cancel");
            }
        })
    }

    render() {
        return (
            <div>
                <Card title="基础模态框" className="card-wrap">
                    <Button type="primary" onClick={() => this.hanleModals('showModal1')}>Open</Button>
                    <Button type="primary" onClick={() => this.hanleModals('showModal2')}>自定页脚</Button>
                    <Button type="primary" onClick={() => this.hanleModals('showModal3')}>顶部20px弹框</Button>
                    <Button type="primary" onClick={() => this.hanleModals('showModal4')}>水平垂直居中</Button>
                </Card>
                <Card title="信息确认框" className="card-wrap">
                    <Button type="primary" onClick={() => this.hanleConfirm('confirm')}>Confirm</Button>
                    <Button type="primary" onClick={() => this.hanleConfirm('info')}>Info</Button>
                    <Button type="primary" onClick={() => this.hanleConfirm('success')}>Success</Button>
                    <Button type="primary" onClick={() => this.hanleConfirm('warning')}>Warning</Button>
                </Card>
                <Modal 
                    title="React"
                    visible={this.state.showModal1}
                    onCancel={()=>{
                        this.setState({
                            showModal1:false
                        })
                    }}
                >
                    <p>React模态框测试</p>
                </Modal>
                <Modal 
                    title="React"
                    visible={this.state.showModal2}
                    okText="好的"
                    cancelText="算了"
                    onCancel={()=>{
                        this.setState({
                            showModal2:false
                        })
                    }}
                >
                    <p>React模态框测试</p>
                </Modal>
                <Modal 
                    title="React"
                    style={{top:20}}
                    visible={this.state.showModal3}
                    onCancel={()=>{
                        this.setState({
                            showModal3:false
                        })
                    }}
                >
                    <p>React模态框测试</p>
                </Modal>
                <Modal 
                    title="React"
                    wrapClassName="vertical-center-modal"
                    style={{top:20}}
                    visible={this.state.showModal4}
                    onCancel={()=>{
                        this.setState({
                            showModal4:false
                        })
                    }}
                >
                    <p>React模态框测试</p>
                </Modal>
            </div>
        );
    }
}

export default Modals;