import React, { Component } from "react";
import { Card, Select, Tabs, Icon, message } from "antd";
import "./index.less";

const TabPane = Tabs.TabPane;

class tabs extends Component {
  hanleCallback = key => {
    message.info("Hi,您选择了页面" + key);
  };

  constructor(props){
    super(props);
    this.newTabIndex = 0;
    const panes = [
        {
          title: "Tab 1",
          content: "Content of Tab Pane 1",
          key: "a1"   //key可以是任何字符串可以
        },
        {
          title: "Tab 2",
          content: "Content of Tab Pane 2",
          key: "2"
        },
        {
          title: "Tab 3",
          content: "Content of Tab Pane 3",
          key: "3"
        },
        {
          title: "Tab 4",
          content: "Content of Tab Pane 4",
          key: "4"
        }
        ,
        {
          title: "Tab 5",
          content: "Content of Tab Pane 5",
          key: "5"
        }
      ];
      this.state = {
          activeKey:'a1',
          panes,
          tabPosition:'top'
      };
  }

  onChange = activeKey => {
    this.setState({
      activeKey
    });
  };

  onEdit = (targetKey, action) => {
      //targetKey->Key值,action获取是add还是remove
    this[action](targetKey);
    //this.add(targetKey)
    //this.remove(targetKey)
  };

  add = () => {
    const panes = this.state.panes;
    const activeKey = `newTab${this.newTabIndex++}`;//必须有个递增数,否则会选中所有的新增选项
    panes.push({
      title: "New Tab",
      content: "Content of new Tab",
      key: activeKey
    });
    this.setState({ panes, activeKey });
  };

  remove = targetKey => {
    let activeKey = this.state.activeKey;  //获取state存储的key值
    let lastIndex;  //新建一个变量来判断是否关闭时是当前选中的key
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {  //判断关闭和选中的是否都是第一个tabs,如果是返回-1,因为第一个的索引为0,0-1=-1
        lastIndex = i - 1;
      }
    });
    //filter用于把Array的某些元素过滤掉，然后返回剩下的元素。
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);  //将除了targetkey也就是删除的key剔除掉
    if (panes.length && activeKey === targetKey) {
    //第一判断panes是否等于0个,第二判断选中的和删除的key是否相等
    //当两个条件都成立的时候,则会进入if
      if (lastIndex >= 0) {  //判断选中和关闭是否都是第一个
        activeKey = panes[lastIndex].key;  //如果不是则返回当前关闭索引的值减去1之后的索引
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };

  changeTabPosition = (position) =>{
    this.setState({
      tabPosition:position
    })
  }

  render() {
    return (
      <div>
        <Card title="Tab页签" className="card-wrap">
          <Tabs defaultActiveKey="1" onChange={this.hanleCallback}>
            <TabPane tab="Tab 1" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="Tab 2" disabled key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Card>
        <Card title="带图的Tab页签" className="card-wrap">
          <Tabs defaultActiveKey="1" onChange={this.hanleCallback}>
            <TabPane
              tab={
                <span>
                  <Icon type="plus" />
                  Tab 1
                </span>
              }
              key="1"
            >
              Content of Tab Pane 1
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="edit" />
                  Tab 1
                </span>
              }
              key="2"
            >
              Content of Tab Pane 2
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="delete" />
                  Tab 1
                </span>
              }
              key="3"
            >
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Card>
        <Card title="带图的Tab页签" className="card-wrap">
          <Tabs
            onChange={this.onChange}
            activeKey={this.state.activeKey}   //接受key值 ,来识别第一个选中谁,选中则显示出来,key值可以是任何字符串,相当于arr的标识符
            type="editable-card"
            onEdit={this.onEdit}
          >
            {this.state.panes.map((item, key) => {
              return (
                <TabPane tab={item.title} key={item.key}>
                  {item.content}
                </TabPane>
              );
            })}
          </Tabs>
        </Card>
        <Card title="带图的Tab页签" className="card-wrap">
          <div style={{ marginBottom: 16 }}>
            Tab position：
            <Select
              value={this.state.tabPosition}
              onChange={this.changeTabPosition}
              dropdownMatchSelectWidth={false}
            >
              <Select.Option value="top">top</Select.Option>
              <Select.Option value="bottom">bottom</Select.Option>
              <Select.Option value="left">left</Select.Option>
              <Select.Option value="right">right</Select.Option>
            </Select>
          </div>
          <Tabs
            defaultActiveKey="a1" 
            onChange={this.hanleCallback}
            tabPosition={this.state.tabPosition}
            style={{height:220}}
          >
            {this.state.panes.map((item, key) => {
              return (
                <TabPane tab={item.title} key={item.key}>
                  {item.content}
                </TabPane>
              );
            })}
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default tabs;
