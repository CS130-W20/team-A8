import React from 'react';
import {
    Menu,
    Icon,
    Layout,
    Typography,
    Card,
    Carousel,
    Empty,
    Modal,
    Avatar,
    Form,
    Upload,
    Button,
} from 'antd';
import 'antd/dist/antd.css';
import { Link, BrowserRouter as Router, withRouter } from "react-router-dom";
import queryString from 'query-string';
import axios from 'axios';
import './Profile.css';
import config from '../config.json';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.nextHosting = this.nextHosting.bind(this);
        this.prevHosting = this.prevHosting.bind(this);
        this.nextFavorites = this.nextFavorites.bind(this);
        this.prevFavorites = this.prevFavorites.bind(this);
        this.changeProfilePic = this.changeProfilePic.bind(this);
        const values = queryString.parse(props.location.search);
        this.state.userId = values.id;
        this.carouselHosting = React.createRef();
        this.carouselFavorites = React.createRef();
    }

    state = {
        userId: null,
        isProfileOwner: true,
        currMenu: 'profile',
        showProfileModal: false,
        confirmProfileModalLoading: false,
    };

    componentDidMount() {
        this.getUserInfo()
            .then((userInfo) => {
                this.setState({ userInfo: userInfo.data });
                // this.setState({ isProfileOwner: userInfo.data.id == this.props.user.id })  check if the profile belongs to the current user. 
            })
            .then(() => {
                this.getGameList('hosting');  // NOT TEST
                //this.getGameList('testing');    // TEST
            })
            .then(() => {
                this.getGameList('favorites'); // NOT TEST
            })
            .catch((err) => {
                console.log(err)
            });
    }

    nextHosting() {
        this.carouselHosting.next();
    }

    prevHosting() {
        this.carouselHosting.prev();
    }

    nextFavorites() {
        this.carouselFavorites.next();
    }

    prevFavorites() {
        this.carouselFavorites.prev();
    }

    getUserInfo() {
        return axios({ 
                url: `${config.backend_url}/profile/getProfileUserInformation?id=${this.state.userId}&private=false`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            })
    }

    handleMenuClick = event => {
        this.setState({ currMenu: event.key });
    }

    onUsernameEdit = async (username) => {
        const userInfo = { ...this.state.userInfo, username }
        this.setState({ userInfo });
        await axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo);
    }

    onBioEdit = async (bio) => {
        const userInfo = { ...this.state.userInfo, bio }
        this.setState({ userInfo });
        await axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo);
    }

    removeCard = async (type, id) => {
        console.log('removing card');
        let removeInd;
        const removedType = this.state.userInfo[type].filter((val, ind, arr) => {
            if (val !== id.toString()) {
                return true
            } else {
                removeInd = ind;
                return false;
            }
        });
        const gameInfo = this.state[type];
        gameInfo.splice(2 * removeInd, 2);
        const userInfo = { ...this.state.userInfo }
        userInfo[type] = removedType;
        console.log(removedType);
        this.setState({ userInfo, [type]: gameInfo });
        // TODO: UPDATE THE DB
        await axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo);
    }

    openProfileModal = () => {
        this.setState({ showProfileModal: true });
    }

    handleProfileModalOk = () => {
        console.log('handleok')
        if (!this.state.newProfilePicture) {
            this.setState({ showProfileModal: false });
        } else {
            this.setState({ confirmProfileModalLoading: true });
            console.log(this.state.newProfilePicture);
            const formData = new FormData();
            formData.append('myImage', this.state.newProfilePicture);
            console.log(formData);
            console.log('this')
            axios.post(`${config.backend_url}/profile/editProfilePicture`, formData)
                .then(() => {
                    this.setState({ confirmProfileModalLoading: false, showProfileModal: false });
                });
        }
    }

    handleProfileModalCancel = () => {
        this.setState({ showProfileModal: false });
    }

    changeProfilePic = (picture) => {
        this.setState({ newProfilePicture: picture });
        console.log(picture);
    }

    getGameList = async (type) => {
        if (!this.state.userInfo || !this.state.userInfo[type]) {   // TEST:  if (!this.state.userInfo || !this.state.userInfo[type])
            return <Empty />;
        }
        // BEGIN TEST
        /*
        if (type == 'testing') {
            const games_list = [
                { data: { id: "90101", name: 'dog dog dog dog dog dog dog dog asdfadfasdfadfadfa' } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 1234, name: 'dog dog' } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 1235 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 1236 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 1237 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
                { data: { id: 1238 } },
                { data: 'hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1094874726.png?crop=0.542xw:0.814xh;0.0472xw,0.127xh&resize=640:*'},
            ]
            this.setState({ 'testing' : games_list })
            return;
        }
        */
        // END TEST
        const idList = this.state.userInfo[type];
        console.log(idList);
        const InfoPromises = [];
        for (let i = 0; i < idList.length; i += 1) {
            const gameReq = axios.get(`${config.backend_url}/igdb/game?id=${idList[i]}`);
            const coverReq = axios.get(`${config.backend_url}/igdb/cover?id=${idList[i]}`);
            InfoPromises.push(gameReq, coverReq);
        }
        const gameInfo = await Promise.all(InfoPromises);
        console.log(gameInfo);
        type === 'hosting' ? this.setState({ 'hosting': gameInfo }) : this.setState({ 'favorites': gameInfo });
    }

    setNewProfilePicture = ({ file, onSuccess}) => {
        this.setState({ newProfilePicture: file })
        console.log(this.state.newProfilePicture)
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    }

    render() {
        let createCards = (type) => {
            console.log('creatingCards')
            const gameInfo = this.state[type];
            if (!gameInfo) return;
            const cards = [];
            for (let i = 0; i < gameInfo.length; i += 2) {
                cards.push(
                    <div className="card">
                        <Link to={`/singlegame/?id=${gameInfo[i].data.id}`}>
                            <img src={"http://" + gameInfo[i+1].data} />
                        </Link>
                        <div className="name-text-box">
                            <a className="name-text">{gameInfo[i].data.name}</a>
                            <br/>
                            { this.state.isProfileOwner && 
                                <Text className='name-text' style={{ cursor: 'pointer' }}onClick={ () => { this.removeCard(type, gameInfo[i].data.id) }}>Remove</Text>
                            }
                        </div>
                    </div>
                )
            }
            return cards;
        }
        //const hostingCards = createCards('testing') || [];      // TEST
        // const favoritesCards = createCards('testing') || [];    // TEST
        const hostingCards = createCards('hosting') || [];   // NOT TEST
        const favoritesCards = createCards('favorites') || [];  // NOT TEST
        const props = {
            dots: true,
            speed: 500,
            circular: false,
            slidesToScroll: 4
        };
        return (
            <div id='main'>
                <Modal 
                    title='Change Profile Picture' 
                    visible={this.state.showProfileModal}
                    confirmLoading={this.state.confirmProfileModalLoading}
                    onCancel={this.handleProfileModalCancel}
                    onOk={this.handleProfileModalOk}
                >
                    <Upload.Dragger name='file' customRequest={this.setNewProfilePicture} accept='image/*'>
                    <p className="ant-upload-text">Click or drag a picture</p>
                    </Upload.Dragger>
                </Modal>
                <div className='user_info'>
                    { this.state.userInfo && this.state.userInfo.profilePicture && 
                        <div>
                            <img className='profile_image' src={ this.state.userInfo.profilePicture } />
                            { this.state.isProfileOwner &&
                                <Text id='change_profile_pic' onClick={this.openProfileModal}>Change Profile Picture</Text>
                            }
                        </div>
                        }
                    { !this.state.userInfo && <Icon style={{ fontSize: '150px' }} type="user" />}
                    <div id='name_and_loc'>
                        <div id='name'>
                            { (this.state.userInfo && this.state.userInfo.username) && (this.state.isProfileOwner 
                                ? <Title editable={{ onChange: this.onUsernameEdit }}>{ this.state.userInfo.username }</Title>
                                : <Title>{ this.state.userInfo.username }</Title>)
                            }
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
                        <div className='games_list_children'>
                            <div className='games_list_carousel'>
                                <Carousel ref={ node => (this.carouselHosting = node) } { ...props } slidesToShow={ Math.min(4, hostingCards.length) } >
                                    { hostingCards }
                                </Carousel>
                            </div>
                            <br />
                            <div className='scroll-group'>
                                <Icon type='left-circle' className='scroll' onClick={ this.prevHosting } />
                                <Icon type='right-circle' className='scroll' onClick={ this.nextHosting } />
                            </div>
                        </div>
                    </div>
                    <Title level={2}>Favorites</Title>
                    <hr />
                    <div className='games_list'>
                        <div className='games_list_children'>
                            <div className='games_list_carousel'>
                                <Carousel ref={ node => (this.carouselFavorites = node) } { ...props } slidesToShow={ Math.min(4, favoritesCards.length) } >
                                    { favoritesCards }
                                </Carousel>
                            </div>
                            <br/>
                            <div className='scroll-group'>
                                <Icon type='left-circle' className='scroll' onClick={ this.prevFavorites } />
                                <Icon type='right-circle' className='scroll' onClick={ this.nextFavorites } /> 
                            </div>
                        </div>
                    </div>
                </div>
                <div id='bio'>
                    <div id='bio_title'>
                        <Title level={3}>bio</Title>
                    </div>
                    <div id='bio_info'>
                        { (this.state.userInfo && this.state.userInfo.bio) && ( this.state.isProfileOwner
                            ? <Paragraph ellipsis={{ rows: 5, expandable: true }} editable={{ onChange: this.onBioEdit }}>{ this.state.userInfo.bio }</Paragraph>
                            : <Paragraph ellipsis={{ rows: 5, expandable: true }}>{ this.state.userInfo.bio }</Paragraph>)
                        }
                    </div>
                    <Link to={ `/messages?id=${ this.state.userId }` }><Title level={3}><Icon type="mail" /> Message this host</Title></Link>
                </div>
            </div>
        );
    }
}

export default Profile;