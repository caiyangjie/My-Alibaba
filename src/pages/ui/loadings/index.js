import React, { Component } from 'react';
import { Card, Switch, Spin, Icon, Alert } from 'antd';
import './index.less';
class Loadings extends Component {

    state={
        loading:true
    }
    
    toggle = (value) => {
        this.setState({
            loading:value
        })
    }
    
    render() {
        const icon = <Icon type="loading" style={{fontSize:24}}/>
        const iconLoading = <Icon type="loading" style={{fontSize:24}}/>
        return (
            <div>
                <Card title="Spin用法" className="card-wrap">
                    <Spin size="small" />
                    <Spin style={{margin:"0 20px"}} />
                    <Spin size="large"/>
                    <Spin indicator={icon} style={{margin:"0 20px"}} />
                </Card>
                <Card title="内容遮罩" className="card-wrap">
                    <Alert 
                        message="React"
                        description="欢迎来到React高级实战课程"
                        type="info"
                    />
                    <Spin>
                        <Alert 
                            message="React"
                            description="欢迎来到React高级实战课程"
                            type="warning"
                        />
                    </Spin>
                    <Spin tip="加载中...">
                        <Alert 
                            message="React"
                            description="欢迎来到React高级实战课程"
                            type="warning"
                        />
                    </Spin>
                    <Spin  tip="加载中" indicator={iconLoading} >
                        <Alert 
                            message="React"
                            description="欢迎来到React高级实战课程"
                            type="warning"
                        />
                    </Spin>
                </Card>
                <Card>
                    <Spin tip="加载中..." spinning={this.state.loading}>
                        <Alert
                            message="React"
                            description="欢迎来到React高级实战课程"
                            type="warning"
                        />
                    </Spin>
                    <div style={{ marginTop: 16 }}>
                    Loading state：<Switch checked={this.state.loading} onChange={this.toggle} />
                    </div>
                </Card>
            </div>
        );
    }
}

export default Loadings;