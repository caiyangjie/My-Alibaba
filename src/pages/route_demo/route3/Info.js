import React, { Component } from 'react';

class Info extends Component {
    render() {
        return (
            <div>
                测试动态路由的 Value 为: 
                {this.props.match.params.value}
            </div>
        );
    }
}

export default Info;