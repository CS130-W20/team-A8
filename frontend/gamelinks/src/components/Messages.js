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
  Modal,
  List
} from "antd";
import { Link, BrowserRouter, withRouter } from "react-router-dom";
import config from "../config.json";
// diff package
import io from "socket.io-client";
import axios from "axios";
const queryString = require('query-string');


const { Search, TextArea } = Input;
const { Content, Sider } = Layout;

const uri = "http://localhost:9000";
const options = { transports: ["websocket"] };

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: [],
      messages: [],
      message: "",
      username: "",
      name: "",
      partner: "",
      title: "",
      visible: false,
      userInfo: {},
      shared: false
    };
    this.gid = "";
    this.socket = io("localhost:9000");

    this.socket.on("RECEIVE_MESSAGE", function(data) {
      console.log(`RECEIVED MESSAGE`);
      addMessageFromSocket(data);
    });

    const addMessageFromSocket = data => {
      console.log('In add message from socket');
      console.log(data);
      this.state.messages = [...this.state.messages, data];
      this.forceUpdate();
      console.log(this.state.messages);
    };

    this.sendMessage = msg => {
      console.log('in send message');
      console.log(msg);
      console.log(this.socket.id);
      msg.socket2 = this.socket.id;
      this.socket.emit("SEND_MESSAGE", msg);
    };
  }

  inbox() {
    console.log(window.location.href);
    this.state.title = `Inbox`;
    this.setState({ username: this.props.user.firstName });
    fetch(`${config.backend_url}/messaging/inbox`)
       .then(res => res.json())
       .then(data => {
         console.log(data); 
         this.setState({ apiResponse: data });
       })
       .catch(err => console.log(`Error is: ${err}`));
  }

  addMessage(data) {
    console.log('In add message');
    console.log(data);
    this.setState({ messages: [...this.state.messages, data] });
    console.log(this.state.messages);
  }

  messages() {
     this.state.title = `Messages`;
     console.log('finding or creating chat');
     this.state.title = `Chat`;
     const partner = window.location.href.split("?id=");
     fetch(`${config.backend_url}/messaging/addChatPartner?id=${partner[1]}`)
       .then(() => {
         console.log('GETTING NEW MESSAGE');
         this.setState({ visible: true });
         this.getChat(partner[1]);    
       })
       .then(() => {
          this.inbox();
       })
       .catch(err => console.log(`Error is: ${err}`));  
  }
  
  getChat(partnerID) {
    this.state.title = `Chat`;
    this.setState({ partner: partnerID });
    console.log('getting chat');
    axios.get(`${config.backend_url}/profile/getCurrentUserInformation`)
      .then((userInfo) => {
        console.log(userInfo);
        this.setState({ 
          userInfo: userInfo.data,
        });
        console.log(this.state.userInfo.sharedWith);
        console.log(partnerID);
        const sharing = (this.state.userInfo.sharedWith.indexOf(partnerID) > -1 ? true : false)
        this.setState({shared: sharing});
        console.log("Sharing is:");
        console.log(sharing);
      })
      .catch(err => console.warn(err));
    
    axios.get(`${config.backend_url}/profile/getNameByID?id=${partnerID}`)
      .then((name) => {
         console.log('now, getting chat history');
         console.log(name.data["fname"]);
         this.setState({ name: name.data["fname"] })
         return fetch(`${config.backend_url}/messaging/getChatHistory?id=${partnerID}`)
      })
      .then((chatHist) => chatHist.json())
      .then((msgs) => this.setState({ messages: msgs }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  addToHistory(msg) {
    console.log("in add to chat history");
    this.state.title = `Add to history`;
    console.log(msg);

    // replace with messageInfo
    var body_ = JSON.stringify({
      userID1: this.props.user._id, // Replace this with current user id
      userID2: this.state.partner, // Replace this with chat partner id
      message: msg
    });
    console.log(body_);
    fetch(`${config.backend_url}/messaging/addToChatHistory`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: body_
    })
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is ${err}`));
    // clear the message
  }

  onSendMessage(value) {
    const m = {
       author: this.props.user.firstName,
       user1: this.props.user._id,
       user2: this.state.partner,
       socket2: "",
       message: value
    };
    this.sendMessage(m);
    this.addMessage(m);
    this.addToHistory(m);
  }

  onReceiveMessage = async value => {
    const messageInfo = { ...this.state.userID, value };
    this.state.title = `Receive Message`;
    await axios.post(`${config.backend_url}/messaging/addToChatHistory`, value);
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  // send dm
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  // exit messaging modal
  handleCancel = e => {
    console.log(e);
    this.setState({
      shared: false,
      visible: false
    });
  };

  handleShare(){
    if(!this.state.shared)
      axios.post(`${config.backend_url}/profile/addSharedWith?id=${this.state.partner}`)
        .then(res => {
          console.log(res);
          this.setState({shared: true});
          console.log(this.state.shared);
        })
        .catch(err => console.warn(err))
    else
      axios.post(`${config.backend_url}/profile/removeSharedWith?id=${this.state.partner}`)
        .then(res => {
          console.log(res);
          this.setState({shared: false});
          console.log(this.state.shared);
        })
        .catch(err => console.warn(err))
  }

  componentDidMount() {
    axios.get(`${config.backend_url}/profile/getCurrentUserInformation`)
      .then((userInfo) => {
        console.log(userInfo);
        this.setState({ 
          userInfo: userInfo.data,
        });
      })
      .catch(err => console.warn(err));
    if (window.location.href.includes('messages')) {
      this.messages();
    } else {
      this.inbox();
    }
    // connect w axios
  }

  onChange = (e) => {
     this.setState({ message: e.target.value });
  }

  handleEnter = (e) => {
    this.onSendMessage(this.state.message);
    this.setState({ message: '' }); 
  }

  render() {
    const { visible, loading } = this.state;

    return (
      <div>
        <Layout style={{ minHeight: "90vh" }}>
          <Sider>
            <Avatar size={64} src={this.state.userInfo ? this.state.userInfo.profilePicture : undefined} />
            <span style={{color: "white"}}>{this.state.userInfo ? this.state.userInfo.username : undefined}</span>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["3"]}>
              <Menu.Item key="1">
                <Icon type="upload" />
                <span className="nav-text">inbox</span>
              </Menu.Item>
              <Menu.Item key="2">
               {(this.props.user) &&
                  <Link to={`/profile?id=${this.props.user._id}`}>
                     <Icon type="user"/>
                     back to profile
                  </Link>
               }
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: "0 16px" }}>
              <div style={{ padding: 24, background: "#fff", minHeight: 475 }}>
                <div
                  className="scrollable-container"
                  ref={node => {
                    this.container = node;
                  }}
                >
                  {/* have a pop up modal with text area and messaging */}
                  {this.state.apiResponse.map(elem => {
                    return (
                      <div className="p1">
                        <Card hoverable title={elem.name}>
                          <Button size="large" onClick={() => {
                             this.showModal();
                             this.getChat(elem.id);
                          }}>
                            Message
                          </Button>
                        </Card>
                        <Modal
                          visible={this.state.visible}
                          title={this.state.name}
                          onOk={this.handleOk}
                          onCancel={this.handleCancel}
                          footer={[
                            <Button key='share' onClick={() => this.handleShare()}>
                              {this.state.shared ? "Stop Sharing Info" : "Share Your Info"}
                            </Button>, 
                            <Button key="back" onClick={this.handleCancel}>
                              Return
                            </Button>
                          ]}
                        >
                          <List size="large">
                            {this.state.messages.map(message => {
                                return (
                                  <div>
                                     {message.author}: {message.message}
                                  </div>
                                );
                             })
                           }
                          </List>
                          <Search
                            size="large"
                            placeholder="Enter here"
                            value={this.state.message || ''}
                            enterButton="Send"
                            onChange={this.onChange}
                            onSearch={this.handleEnter}
                          />
                        </Modal>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default Messages;
