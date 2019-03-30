import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
                <div>
                    <ul>
                        <li>
                            <Link to="/main">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/topics">Topics</Link>
                        </li>
                        <li>
                            <Link to="/cs1">Topics</Link>
                        </li>
                        <li>
                            <Link to="/cs2">Topics</Link>
                        </li>
                    </ul> 
                    <hr/>
                    {/* 路由呈现的位置 */}
                     {this.props.children}
                </div>
        );
    }
}

export default Home;