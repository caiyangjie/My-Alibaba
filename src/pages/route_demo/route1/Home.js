import React, { Component } from 'react';
import {HashRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Main from './Main';
import About from './about';
import Topics from './topics';

class Home extends Component {
    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/topics">Topics</Link>
                        </li>
                    </ul>
                    <hr/>
                    <Switch>
                        <Route exact={true}  path="/" component={Main}></Route>
                        <Route path="/about" component={About}></Route>
                        <Route path="/topics" component={Topics}></Route>
                    </Switch>
                    
                </div>
            </Router>
        );
    }
}

export default Home;