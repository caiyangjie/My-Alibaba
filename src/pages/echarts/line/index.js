import React, { Component } from 'react';
import { Card } from 'antd';
// import echarts from 'echarts'
//按需加载
import echarts from 'echarts/lib/echarts';
//导入饼图
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
class Line extends Component {

    componentWillMount(){
        //设置主题
        echarts.registerTheme('my_theme', {
            color: [
                '#ffdb29','#ff5400','#6699cc',
                '#E87C25','#B5C334','#FE8463',
                '#9BCA63'
            ],
            backgroundColor: '#ffffff',
            textStyle:{},
            title:{
                textStyle:{
                    color: 'blue'
                },
                subtextStyle:{
                    color: '#blue'
                }
            }
        });
    }

    getOption = ()=>{
        let option = {
           title:{
               text:"用户骑行订单"
           },
           tooltip:{
                trigger:'axis'
           },
           xAxis:{
                data:[
                    '周一','周二','周三','周四','周五','周六','周日'
                ]
           },
           yAxis:{
               type:'value'
           },
           series:[
               {
                   name:'订单量',
                   type:"line",
                   data:[
                       1000,2000,1500,
                       3000,2000,1200,
                       800
                   ]
               }
           ]
        }
        return option;
    }

    getOption2 = ()=>{
        let option = {
            title:{
                text:"用户骑行订单"
            },
            tooltip:{
                 trigger:'axis'
            },
            legend:{
                data:['OFO订单量',"摩拜订单量","小蓝订单量"]
            },
            xAxis:{
                 data:[
                     '周一','周二','周三','周四','周五','周六','周日'
                 ]
            },
            yAxis:{
                type:'value'
            },
            series:[
                {
                    name:'OFO订单量',
                    type:"line",
                    data:[
                        1200,3000,4500,
                        6000,8000,12000,
                        20000
                    ]
                },
                {
                    name:'摩拜订单量',
                    type:"line",
                    data:[
                        1000,2000,5500,
                        6000,8000,10000,
                        12000
                    ]
                },
                {
                    name:'小蓝订单量',
                    type:"line",
                    data:[
                        1000,2000,1500,
                        3000,2000,1200,
                        800
                    ]
                }
            ]
        }
        return option;
    }

    getOption3 = ()=>{
        let option = {
            title:{
                text:"用户骑行订单"
            },
            tooltip:{
                 trigger:'axis'
            },
            xAxis:{
                type: 'category',
                boundaryGap: false,
                data:[
                     '周一','周二','周三','周四','周五','周六','周日'
                ]
            },
            yAxis:{
                type:'value'
            },
            series:[
                {
                    name:'订单量',
                    type:"line",
                    data:[
                        1000,2000,1500,
                        3000,2000,1200,
                        800
                    ],
                    areaStyle: {}
                }
            ]
        }
        return option;
    }

    render() {
        return (
            <div>
                <Card title="折线图表之一">
                    <ReactEcharts option={this.getOption()} theme="my_theme" style={{height:500}} />
                </Card>
                <Card title="折线图表之二" style={{marginTop:10}}>
                    <ReactEcharts option={this.getOption2()} theme="my_theme" style={{height:500}} />
                </Card>
                <Card title="折线图表之三" style={{marginTop:10}}>
                    <ReactEcharts option={this.getOption3()} theme="my_theme" style={{height:500}} />
                </Card>
            </div>
        );
    }
}

export default Line;