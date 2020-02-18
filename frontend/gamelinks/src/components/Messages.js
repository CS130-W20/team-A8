import React from "react";
import { Affix, Avatar, Layout, Menu, Breadcrumb, Icon, Input } from "antd";
import { Link, BrowserRouter, withRouter } from "react-router-dom";

const { Search } = Input;
const { Content, Sider } = Layout;

class Messages extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Layout style={{ minHeight: "90vh" }}>
          <Sider>
            <Avatar size={64} icon="user" />
            <Menu mode="inline">
              <Menu.Item key="1">
                <Link to="/profile">
                  <Icon type="cross" />
                  <span>Close Chat</span>
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

export default withRouter(Messages);
