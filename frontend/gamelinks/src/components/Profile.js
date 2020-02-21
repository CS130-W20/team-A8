import React from 'react';
import {
    Menu,
    Icon,
    Layout,
    Typography,
    Card,
    Carousel,
    Empty,
} from 'antd';
import { Link, BrowserRouter as Router, withRouter } from "react-router-dom";
import queryString from 'query-string';
import axios from 'axios';
import './Profile.css';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

class Profile extends React.Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(props.location.search);
        this.state.userId = values.id;
    }

    state = {
        userId: null,
        currMenu: 'profile',
    };

    componentDidMount() {
        this.getUserInfo();
    }

    getUserInfo = () => {
        axios({ 
                url: `http://localhost:9000/profile/getProfileUserInformation?id=${this.state.userId}&private=false`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            })
            .then((userInfo) => {
                console.log(userInfo.data);
                this.setState({ userInfo: userInfo.data })
            })
            .catch((err) => {
                console.log(err)
            });
    }

    handleMenuClick = event => {
        this.setState({ currMenu: event.key });
    }

    render() {
        let getGameList = async (type) => {
            if (!this.state.userInfo || !this.state.userInfo[type]) {
                return <Empty />;
            }
            const idList = this.state.userInfo[type];
            for (let i = 0; i < idList.length(); i += 1) {

            }
        }
        return (
            <div id='main'>
                <div className='user_info'>
                    { this.state.userInfo && this.state.userInfo.profilePicture && <img className='profile_image' src={ this.state.userInfo.profilePicture } />}
                    { !this.state.userInfo && <Icon style={{ fontSize: '150px' }} type="user" />}
                    <div id='name_and_loc'>
                        <div id='name'>
                            { this.state.userInfo && this.state.userInfo.username && <Title>{ this.state.userInfo.username }</Title>}
                        </div>
                        <div id='loc'>
                            
                        </div>
                    </div>
                </div>
                <hr />
                <div id='hosting'>
                    <Title level={2}>Games Hosting</Title>
                    <hr />
                    <div className='games_list'>
                        
                    </div>
                    <Title level={2}>Favorites</Title>
                    <hr />
                    <div className='games_list'>

                    </div>
                </div>
                <div id='bio'>
                    <div id='bio_title'>
                        <Title level={3}>bio</Title>
                    </div>
                    <div id='bio_info'>
                        { this.state.userInfo && this.state.userInfo.bio && <Paragraph ellipsis={{ rows: 5, expandable: true }}>{ this.state.userInfo.bio }</Paragraph>}
                    </div>
                    <Link to={ `/messages?id=${ this.state.userId }` }><Title level={3}><Icon type="mail" /> Message this host</Title></Link>
                </div>
            </div>
        );
    }
}

export default Profile;

