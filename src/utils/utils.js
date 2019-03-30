import React, { Component } from 'react';
import { Select } from 'antd';
const Option = Select.Option;
export default {
    formateDate(time){
        if(!time){
            return "";
        }
        let date = new Date(time);
        return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    },
    pagination(data,callback,isServer){
        let page = {
            onChange:(current)=>{
                callback(current)
            },
            current:isServer?data.page:data.result.page,
            pageSize:isServer?data.pageSize:data.result.page_size,
            total:isServer?data.total:data.result.total,
            showTotal:()=>{
                return `共${isServer?data.total:data.result.total}条`
            },
            showQuickJumper:true
        }
        return page;
    },
    getOptionList(data){
        if(!data){
            return [];
        }
        let options = [];
        data.map((item)=>{
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options
    },

     /**
    * ETable 行点击通用函数
    * @param {*选中行的索引} selectedRowKeys
    * @param {*选中行对象} selectedItem
    */
   updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    }
}