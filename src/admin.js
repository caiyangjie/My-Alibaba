import React, { Component } from 'react';
import { Row , Col, Layout} from 'antd';
import Headers from './components/Header';
import Footers from './components/Footer';
import NavLeft from './components/NavLeft';
import './style/common.less';
import Home from './pages/home';
import { connect } from 'react-redux';

const { Sider } = Layout;

class Admin extends Component {

    state = {
        collapsed: false,
      };
    
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }

    render() {
        return (
            <Row className="container">
                <Col span={this.props.menuHide?1:3} className="nav-left">
                    <NavLeft/>
                </Col>
                <Col span={this.props.menuHide?23:21} className="main">
                    <Headers/>
                    <Row className="content">
                        {/* <Home/> */}
                        {this.props.children}
                    </Row>
                    <Footers/>
                </Col>
            </Row>
            // 因为侧边栏镶嵌于组件内部,出现了鼠标点击或经过时才会隐藏文字
            // <Layout className="container">
            //     <Sider
            //         collapsible
            //         collapsed={this.state.collapsed}
            //         onCollapse={this.onCollapse}
            //         className="nav-left"
            //     >
            //         <NavLeft/>
            //     </Sider>
            //     <Layout className="main">
            //         <Headers/>
            //             <Row className="content">
            //                 {/* <Home/> */}
            //                 {this.props.children}
            //             </Row>
            //         <Footers/>
            //     </Layout>
            // </Layout>
        );
    }
}
//获取数据源
const mapStateToProps = state =>{
    return {
        menuHide:state.menuHide
    }
}


//将组建丢入radux内进行管理   链接传值(值)(链接头)
export default connect(mapStateToProps)(Admin);