import React, { Component } from 'react';
import { Card, Button, notification } from 'antd'; 
import './index.less';
class Notice extends Component {


    hanleopenNotification = (type,direction) => {
        if(direction){
            notification.config({
                placement:direction
            });
        }
        const Notification = require("./notifiction.json");
        notification[type](Notification[type]);
    }
    
    render() {
        return (
            <div>
                <Card title="通知提醒框" className="card-wrap">
                    <Button type="primary" onClick={() =>this.hanleopenNotification("success")}>Success</Button>
                    <Button type="primary" onClick={() =>this.hanleopenNotification("info")}>Info</Button>
                    <Button type="primary" onClick={() =>this.hanleopenNotification("warning")}>Warning</Button>
                    <Button type="primary" onClick={() =>this.hanleopenNotification("error")}>Error</Button>
                </Card>
                <Card title="通知提醒框位置绑定" className="card-wrap">
                    <Button type="primary" onClick={() =>this.hanleopenNotification("success","topLeft")}>左上角</Button>
                    <Button type="primary" onClick={() =>this.hanleopenNotification("info","topRight")}>右上角</Button>
                    <Button type="primary" onClick={() =>this.hanleopenNotification("warning","bottomLeft")}>左下角</Button>
                    <Button type="primary" onClick={() =>this.hanleopenNotification("error","bottomRight")}>右下角</Button>
                </Card>
            </div>
        );
    }
}

export default Notice;