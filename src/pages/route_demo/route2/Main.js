import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Main extends Component {
    render() {
        return (
            <div>
                 this is main page. 
                 <Link to="/main/a">Home</Link>                 
                 <hr/> 
                 {this.props.children}
            </div>
        );
    }
}

export default Main;