import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Admin from './admin';
import Router from './router';
import { Provider } from 'react-redux'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd';
import configureStore from './redux/store/configureStore'
import * as serviceWorker from './serviceWorker';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const store = configureStore()
ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Provider store={store}>
            <Router/>
        </Provider>
    </LocaleProvider>

    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
