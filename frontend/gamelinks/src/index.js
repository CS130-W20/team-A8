import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// ReactDOM.render(
//   <Layout>
//     <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
//       <div className="logo" />
//       <Menu
//         theme="dark"
//         mode="horizontal"
//         defaultSelectedKeys={["2"]}
//         style={{ lineHeight: "64px" }}
//       >
//         <Menu.Item key="1">people</Menu.Item>
//         <Menu.Item key="2">games</Menu.Item>
//         <Menu.Item key="3">lists</Menu.Item>
//       </Menu>
//     </Header>
//     <Content style={{ padding: "0 50px", marginTop: 64 }}>
//       {/* <Breadcrumb style={{ margin: '16px 0' }}>
//         <Breadcrumb.Item>Home</Breadcrumb.Item>
//         <Breadcrumb.Item>List</Breadcrumb.Item>
//         <Breadcrumb.Item>App</Breadcrumb.Item>
//       </Breadcrumb> */}
//       <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
//         Content
//       </div>
//     </Content>
//     <Footer style={{ textAlign: "center" }}>CS 130 TEAM A8 ©2018</Footer>
//   </Layout>,
//   document.getElementById("container")
// );
