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

const { Search, TextArea } = Input;
const { Content, Sider } = Layout;

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
     console.log(value);
  }

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
  }

  render() {
    const { visible, loading } = this.state;

    return (
      <BrowserRouter>
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
                  <div className="p1">
                    <Card hoverable title="Person 1">
                      <Button size="large" onClick={this.showModal}>
                        Message
                      </Button>
                    </Card>
                    {/* have a pop up modal with text area and messaging */}
                    <Modal
                      visible={this.state.visible}
                      icon="user"
                      title="Person Name"
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
                      <TextArea>
                        {this.getChat("5e38acfa52525645babd8719")}
                      </TextArea>
                      <Search
                        size="large"
                        enterButton="Send"
                        onSearch={value => this.onSendMessage(value)} // log to chat history too
                      />
                    </Modal>
                  </div>
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
