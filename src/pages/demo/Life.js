import React, { Component } from 'react';
import Child from './Child';
import {Button,Input} from 'antd';
import './index.less';
class Life extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count:0
        }
    }

    handleAdd=()=>{
        this.setState({
            count: this.state.count + 1
        })
    }
    // =()=>  用来返回this .如果不写则需要onclick后面加上bind(this)来访问this
    handleClick (){
        this.setState({
            count: this.state.count + 1
        })
    }
   

    render() {
        return (
            <div className="content">
                <p>React生命周期函数</p>
                <Input></Input>
                <Button onClick={this.handleAdd}>AntD点击一下</Button>
                <button onClick={this.handleAdd}>点击一下</button>
                <button onClick={this.handleClick.bind(this)}>点击一下</button>
                <p>{this.state.count}</p>
                <Child name={this.state.count}></Child>
            </div>
        );
    }
}

export default Life;