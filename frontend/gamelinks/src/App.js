import React from "react";
import { Icon } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import { Layout, Menu } from "antd";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          >
            <Icon type="usergroup-add" />
            <Menu.Item key="1">people</Menu.Item>
            <Menu.Item key="2">games</Menu.Item>
            <Menu.Item key="3">lists</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
            Content
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>CS 130 TEAM A8 ©2020</Footer>
      </Layout>
      ,{/* document.getElementById('container'), */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;

// import React from 'react';
// import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
// import './index.css';
// import { Layout, Menu, Breadcrumb } from 'antd';

// const { Header, Content, Footer } = Layout;

// ReactDOM.render(
// );
