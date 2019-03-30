import React, { Component } from 'react';
import { Card, Row, Col, Modal } from 'antd';
class Gallery extends Component {

    state={
        visible:false,
        headUrl:"",
        currentImg:"1.png"
    }
    openGallery = (imgSrc) =>{
        this.setState({
            visible:true,
            currentImg:imgSrc
        })
    }
    
    render() {
        const imgs = []
        for(var i=0;i<4;i++){
            imgs.push([])
            for(var j=i*6+1;j<=(i+1)*6;j++){
                imgs[i].push(j+".png");
            }
        }
        const imgList =imgs.map((list) => list.map((item,index)=>
            <Card
                key={index}
                style={{marginBottom:10}}
                cover={<img src={require("./../../../resource/gallery/"+item)} alt="图片画廊" />}
                onClick={()=>this.openGallery(item)}
            >
                <Card.Meta  
                    title="React Admin"
                    description="I Love React"
                />
            </Card>
        ))
        return (
            <div className="card-wrap">
                <Row gutter={10}>
                    <Col md={6}>
                        {imgList[0]}
                    </Col>
                    <Col md={6}>
                        {imgList[1]}
                    </Col>
                    <Col md={6}>
                        {imgList[2]}
                    </Col>
                    <Col md={6}>
                        {imgList[3]}
                    </Col>
                </Row>
                <Modal
                    title="图片画廊"
                    width={400}
                    height={600}
                    style={{top:20}}
                    visible={this.state.visible}
                    onCancel={()=>{
                        this.setState({
                            visible:false
                        })
                    }}
                    footer={null}
                    
                >
                    <img src={require("./../../../resource/gallery/"+this.state.currentImg)} alt="" width="100%"/>
                </Modal>
            </div>
        );
    }
}

export default Gallery;