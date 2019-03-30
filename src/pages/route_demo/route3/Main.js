import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Main extends Component {
    render() {
        return (
            <div>
                 this is main page. 
                 <br/>
                 <Link to="/main/text-id">动态路由1</Link>                 
                 <br/>
                 <Link to="/main/456">动态路由2</Link>                 
                 <hr/> 
                 {this.props.children}
            </div>
        );
    }
}

export default Main;