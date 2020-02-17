import React from "react";
import { Layout, Menu, Button, Typography, Icon } from "antd";
import "./App.css";
const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          style={{ padding: "10px", lineHeight: "64px" }}
          align="right"
        >
          <Icon style={{ float: "left" }} type="usergroup-add" />
          <Title style={{ float: "left", color: "white" }} level={4}>
            GAMELINKS
          </Title>
          <Menu.Item key="1">games</Menu.Item>
          <Menu.Item key="2">people</Menu.Item>
          <Menu.Item key="3">lists</Menu.Item>
          {/* console errors for button right now*/}
          <Button icon="search">Search</Button>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
          {/* our text */}
          <Button type="primary">Login with Facebook</Button>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>CS 130 TEAM A8 ©2020</Footer>
    </Layout>
  );
}

export default App;
