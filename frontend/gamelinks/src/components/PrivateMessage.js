import React from "react";
import { 
   Affix, 
   Avatar, 
   Layout, 
   Menu, 
   Breadcrumb, 
   Icon, 
   Input, 
   Card, 
   Button, 
   List
} from "antd";
import { Socket, Event } from 'react-socket-io';
import { Link, BrowserRouter, withRouter } from "react-router-dom";
import config from '../config.json'

const { Search } = Input;
const { Content, Sider } = Layout;

const uri = 'http://localhost:9000';
const options = { transports: ['websocket'] };

class PrivateMessage extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       apiResponse: [],
       title: ""
     };
   }

   onReceiveMessage(message) {
      console.log(message);
   }

   onSendMessage(value) {
      this.state.title = `Send Message`
      console.log('In onSendMessage');
      console.log(value);
      var body_ = JSON.stringify({
         userID1: "5e38acfa52525645babd8719", // Replace this with current user id
         userID2: "5e38acfa52525645babd8719", // Replace this with chat partner id
         message: value
      });
      console.log(body_);
      fetch(`${config.backend_url}/messaging/addToChatHistory`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: body_
      })
        .then(res => res.json())
        .then(data => this.setState({ apiResponse: data }))
        .catch(err => console.log(`Error is ${err}`));
    }

   render() {
      return(
         <BrowserRouter>
         <Layout style={{ minHeight: "90vh" }}>
           {/*<Socket uri={uri} options={options}>
             { this.props.children }
              </Socket>*/}
           <Sider>
             <Avatar size={64} icon="user" />
             <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
               <Menu.Item key="1">
                 <Icon type="export" />
                 <span className="nav-text">refer host</span>
               </Menu.Item>
               <Menu.Item key="2">
                 <Icon type="home" />
                 <span className="nav-text">reservations</span>
               </Menu.Item>
               <Menu.Item key="3">
                 <Icon type="upload" />
                 <span className="nav-text">inbox</span>
               </Menu.Item>
               <Menu.Item key="4">
                 <Icon type="user" />
                 <span className="nav-text">back to profile</span>
               </Menu.Item>
             </Menu>
           </Sider>
           <Layout>
             <Content style={{ margin: "0 16px" }}>
               <Breadcrumb style={{ margin: "16px 0" }}>
                 <Breadcrumb.Item>Inbox</Breadcrumb.Item>
                 <Breadcrumb.Item>User</Breadcrumb.Item>
               </Breadcrumb>
               <div style={{ padding: 24, background: "#fff", minHeight: 475 }}>
                 <div
                   className="scrollable-container"
                   ref={node => {
                     this.container = node;
                   }}
                 >
                 {/*
                   <div className="background">
                     <Affix target={() => this.container}></Affix>
                   </div>
                 */}
                 </div>
                 {/*<List id="messages"></List>*/}
                 {/*<div>
                    <Event event='private message' handler={this.onReceiveMessage}/>
                 </div>*/}
               </div>
               <Search
                 size="large"
                 enterButton="Send"
                 onSearch={value => this.onSendMessage(value)}
               />
             </Content>
           </Layout>
         </Layout>
       </BrowserRouter>
      );
   }
}

export default PrivateMessage;