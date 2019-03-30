import React, { Component } from 'react';
class Child extends Component {

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
    componentWillMount(){
        console.log('will mount //加载前输出')
    }

    componentDidMount(){
        console.log("did mount  //加载完成时输出")
    }

    componentWillReceiveProps(newPorps){
        console.log('will props   父组件传递的值' + newPorps.name + "   //父组件传递调用的方法")
    }

    shouldComponentUpdate(){
        console.log('should upate   //调用到state更新是使用')
        return true;
    }

    componentWillUpdate(){
        console.log("will update  //组件更新之前调用");
    }

    componentDidUpdate(){
        console.log('did upadate  //组件更新之后调用的');
    }

    render() {
        return (
            <div>
                <p>这里是子组件,测试子组件的生命周期</p>
                <p>{this.props.name}</p>
            </div>
        );
    }
}

export default Child;