import React from "react";
import { Layout, Button } from "antd";

const { Content } = Layout;

const home = () => {
  return (
    <Content style={{ padding: "0 50px", marginTop: 64 }}>
      <div style={{ src: "#fff", padding: 24, minHeight: 380 }}>
        {/* our text */}
        <Button type="primary">Login with Facebook</Button>
      </div>
    </Content>
  );
};

export default home;
