import React from 'react';
import { Layout, Button } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import FacebookLoginButton from "./FacebookLoginButton";

const { Content } = Layout;

const responseFacebook = (response) => {
  console.log(response);
}

function onFacebookLogin(loginStatus, resultObject){
  // if (loginStatus === true) {
  //   this.setState({
  //     username: resultObject.user.name
  //   });
  // } else {
  //   alert('Facebook login error');
  // }
}

class Home extends React.Component {
    render() {
        return (
            <Router>
                <Content style={{ padding: "0 50px", marginTop: 64 }}>
                    <div align="center">
                        <FacebookLoginButton onLogin={onFacebookLogin}>
                            <Button>Login with Facebook</Button>
                        </FacebookLoginButton>
                    </div>
                </Content>
            </Router>
        )
    };
}
export default Home;
