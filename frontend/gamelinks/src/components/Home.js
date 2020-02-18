import React from "react";
import { Layout, Button } from "antd";
import { BrowserRouter, withRouter } from "react-router-dom";
import { FacebookProvider, LoginButton } from "react-facebook-login";

const { Content } = Layout;

const responseFacebook = (response) => {
  console.log(response);
}

const Home = () => {
  return (
    <BrowserRouter>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div style={{ src: "#fff", padding: 24, minHeight: 380 }}/>

      </Content>
    </BrowserRouter>
  );
};

export default withRouter(Home);
