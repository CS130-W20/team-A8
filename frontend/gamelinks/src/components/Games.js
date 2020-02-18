import React from "react";
import { Layout, Button } from "antd";
import { BrowserRouter, withRouter } from "react-router-dom";

const { Content } = Layout;

const Games = () => {
  return (
    <BrowserRouter>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div style={{ src: "#fff", padding: 24, minHeight: 380 }}>
        </div>
      </Content>
    </BrowserRouter>
  );
};

export default withRouter(Games);
