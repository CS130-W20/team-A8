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
  Modal
} from "antd";
import { Link, BrowserRouter, withRouter } from "react-router-dom";
import config from "../config.json";
import { Socket, Event } from "react-socket-io";
import axios from "axios";

const { Search, TextArea } = Input;
const { Content, Sider } = Layout;

const uri = "http://localhost:9000";
const options = { transports: ["websocket"] };

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: [],
      title: "",
      visible: false
    };
  }

  connect() {
    this.state.title = `Connect`;
    fetch(`${config.backend_url}/messaging/connectSocketIO`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  inbox() {
    this.state.title = `Inbox`;
    fetch(`${config.backend_url}/messaging/inbox`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  getChat(partner) {
    this.state.title = `Chat`;
    fetch(`${config.backend_url}/messaging/getChatHistory?id=${partner}`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  onSendMessage(value) {
    // const messageInfo = { ...this.state.userID1, userID2, history };
    this.state.title = `Send Message`;
    console.log("In onSendMessage");
    console.log(value);
    // replace with messageIndo
    var body_ = JSON.stringify({
      userID1: this.props.user._id, // Replace this with current user id
      userID2: this.props.user._id, // Replace this with chat partner id
      message: value
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
      visible: false
    });
  };

  componentDidMount() {
    this.connect();
    this.inbox();
    // connect w axios
  }

  render() {
    const { visible, loading } = this.state;

    return (
      <BrowserRouter>
        {/* <Socket uri={uri} options={options}>
          {this.props}
        </Socket> */}
        <Layout style={{ minHeight: "90vh" }}>
          <Sider>
            <Avatar size={64} icon="user" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["3"]}>
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
                <Link to={`/profile#/profile?id=undefined`}>
                  <Icon type="user" />
                  back to profile
                </Link>
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
                  {/* have a pop up modal with text area and messaging */}

                  {/* <div className="p1"> */}
                  {this.state.apiResponse.map(elem => {
                    return (
                      <div className="p1">
                        <Card hoverable title={elem.id}>
                          <Button size="large" onClick={this.showModal}>
                            Message
                          </Button>
                        </Card>
                        <Modal
                          visible={this.state.visible}
                          title={elem.id}
                          onOk={this.handleOk}
                          onCancel={this.handleCancel}
                          footer={[
                            <Button key="back" onClick={this.handleCancel}>
                              Return
                              {/* </Button>,
                        <Button
                          key="submit"
                          type="primary"
                          // loading={loading}
                          onClick={this.handleOk}
                        >
                          Send */}
                            </Button>
                          ]}
                        >
                          <TextArea size="large">
                            {this.getChat(this.props.user._id)}
                          </TextArea>
                          <Search
                            size="large"
                            enterButton="Send"
                            onSearch={value => this.onSendMessage(value)}
                          />
                        </Modal>
                      </div>
                    );
                  })}
                  {/* </div> */}
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default Messages;
