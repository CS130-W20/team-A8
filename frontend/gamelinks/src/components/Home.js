import React from "react";
import { Layout, Button } from "antd";
import { BrowserRouter, withRouter } from "react-router-dom";
import FacebookLoginButton from "./FacebookLoginButton";

const { Content } = Layout;

const responseFacebook = response => {
  console.log(response);
};

function onFacebookLogin(loginStatus, resultObject) {
  // if (loginStatus === true) {
  //   this.setState({
  //     username: resultObject.user.name
  //   });
  // } else {
  //   alert('Facebook login error');
  // }
}

const Home = () => {
  return (
    <BrowserRouter>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <div align="center">
          <FacebookLoginButton onLogin={onFacebookLogin}>
            <Button>Login with Facebook</Button>
          </FacebookLoginButton>
        </div>
      </Content>
    </BrowserRouter>
  );
};

export default withRouter(Home);
