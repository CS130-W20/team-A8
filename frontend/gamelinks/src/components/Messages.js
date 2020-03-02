import React from "react";
import { Affix, Avatar, Layout, Menu, Breadcrumb, Icon, Input } from "antd";
import { Link, BrowserRouter, withRouter } from "react-router-dom";
import config from '../config.json'

const { Search } = Input;
const { Content, Sider } = Layout;

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: [],
      title: ""
    };
  }
  inbox() {
     this.state.title = `Inbox`;
    fetch(`${config.backend_url}/messaging/inbox`)
      .then(res => res.json())
      .then(data => this.setState({ apiResponse: data }))
      .catch(err => console.log(`Error is: ${err}`));
  }

  componentDidMount() {
     this.inbox();
  }

  render() {
    return (
      <BrowserRouter>
        <Layout style={{ minHeight: "90vh" }}>
          <Sider>
            <Avatar size={64} icon="user" />
            {/* <Menu mode="inline">
              <Menu.Item key="1">
                <Link to="/profile">
                  <Icon type="cross" />
                  <span>Close Chat</span>
                </Link>
              </Menu.Item>
              
            </Menu> */}
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
                  <div className="background">
                    <Affix target={() => this.container}></Affix>
                  </div>
                </div>
              </div>
              <Search
                size="large"
                enterButton="Send"
                onSearch={value => console.log(value)}
              />
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default Messages;
