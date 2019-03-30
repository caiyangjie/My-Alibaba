import React, { Component } from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom'; 
import Main from './Main';
import About from './../route1/about';
import Topics from './../route1/topics';
import Home from './Home';
import Info from './Info';
import NoMatch from './NoMatch';
class IRouter extends Component {
    render() {
        return (
            <Router>
                <Home>
                    <Switch>
                        <Route path="/main" render={()=>
                            <Main>
                                {/* 当有子路由是不能再父层路由加上精准匹配 exact={true}  */}
                                <Route path="/main/:value" component={Info}></Route>
                            </Main>
                        }></Route>
                        <Route path="/about" component={About}></Route>
                        <Route path="/topics" component={Topics}></Route>
                        <Route path="/topics" component={Topics}></Route>
                        <Route component={NoMatch}></Route>
                    </Switch>
                </Home>
            </Router>
        );
    }
}

export default IRouter;