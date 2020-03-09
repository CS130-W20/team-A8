import React from 'react';
import {
    Icon,
    Layout,
    Typography,
    Carousel,
    Empty,
    Modal,
    Upload,
    Button,
    message,
} from 'antd';
import AddInfoForm from './addInfoForm';
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
        this.setNewProfilePicture = this.setNewProfilePicture.bind(this);
        const values = queryString.parse(props.location.search);
        this.state.userId = values.id;
        this.carouselHosting = React.createRef();
        this.carouselFavorites = React.createRef();
        console.log(props);
    }

    state = {
        userId: null,
        isProfileOwner: false,
        showProfileModal: false,
        showAdditionalInfoModal: false,
    };

    componentDidMount() {
        axios.get(`${config.backend_url}/profile/getCurrentUserInformation`)
            .then((user) => {
                console.log(user);
                this.props.setUser(user.data);
            })
            .then(() => {
                return axios({ 
                    url: `${config.backend_url}/profile/getProfileUserInformation?id=${this.state.userId}`,
                    method: 'GET',
                })
            })
            .then((userInfo) => {
                this.setState({ userInfo: userInfo.data });
                if (this.props.user) {
                    this.setState({ isProfileOwner: userInfo.data._id === this.props.user._id })  // check if the profile belongs to the current user.
                    if (userInfo.data.latitude && userInfo.data.longitude) {
                        return axios({
                            url: `${config.backend_url}/profile/distance?lat=${userInfo.data.latitude}&long=${userInfo.data.longitude}`,
                            method: 'GET'
                        })
                    }
                }
                return null;
            })
            .then((distance) => {
                if (distance) {
                    this.setState({ distance: distance.data.distance.toString() });
                }
            })
            .then(() => { // TODO: add or condition once we figure out if they shared their private info
                console.log(this.state.userInfo)
                if (this.state.isProfileOwner && (!this.state.userInfo.username || !this.state.userInfo.bio || (!this.state.userInfo.address && !this.state.userInfo.city))) {
                    this.setState({ showAdditionalInfoModal: true })
                }
            })
            .then(() => {
                this.getGameList('hosting');
            })
            .then(() => {
                this.getGameList('favorites');
                console.log(this.state)
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

    // TODO: fix this part
    onUsernameEdit = (username) => {
        const userInfo = { ...this.state.userInfo, username }
        axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo)
            .then(res => {
                this.setState({ userInfo });
            })
            .catch(err => {
                message.error('A user with this username already exists. Please choose another.')
            })
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
        await axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo);
    }

    openProfileModal = () => {
        this.setState({ showProfileModal: true });
    }

    openAdditionalInfoModal = () => {
        this.setState({ showAdditionalInfoModal: true });
    }

    closeAdditionalInfoModal = () => {
        this.setState({ showAdditionalInfoModal: false });
    }

    handleProfileModalCancel = () => {
        this.setState({ showProfileModal: false });
    }

    handleProfileModalOk = async (e) => {
        e.preventDefault();
        console.log('handleok')
        if (!this.state.newProfilePicture) {
            this.setState({ showProfileModal: false });
        } else {
            const formData = new FormData();
            formData.append('myImage', this.state.newProfilePicture);
            this.setState({ newProfilePicture: undefined });
            const header = {
                headers: {
                    'content-type': 'multipart/form-data',
                }
            }
            axios.post(`${config.backend_url}/profile/editProfilePicture`, formData, header)
                .then((url) => {
                    this.setState({ showProfileModal: false });
                });
        }
    }

    setAddInfo = async (vals) => {
        console.log(vals);
        const { username, addr1, addr2, city, state, zip, bio } = vals;
        const address = addr2 ? `${addr1}, ${addr2}, ${city}, ${state}, ${zip}` : `${addr1}, ${city}, ${state}, ${zip}`;
        const userInfo = { ...this.state.userInfo, address, username, city, bio };
        axios.post(`${config.backend_url}/profile/editUserInfo`, userInfo)
            .then(() => {
                this.setState({ userInfo, showAdditionalInfoModal: false });
            })
            .catch(() => {
                message.error('A user with this username already exists. Please choose another.');
            })
    }

    getGameList = async (type) => {
        if (!this.state.userInfo || !this.state.userInfo[type]) {   // TEST:  if (!this.state.userInfo || !this.state.userInfo[type])
            return <Empty />;
        }
        const idList = this.state.userInfo[type];
        const InfoPromises = [];
        for (let i = 0; i < idList.length; i += 1) {
            const gameReq = axios.get(`${config.backend_url}/igdb/game?id=${idList[i]}`);
            const coverReq = axios.get(`${config.backend_url}/igdb/cover?id=${idList[i]}`);
            InfoPromises.push(gameReq, coverReq);
        }
        const gameInfo = await Promise.all(InfoPromises);
        type === 'hosting' ? this.setState({ 'hosting': gameInfo }) : this.setState({ 'favorites': gameInfo });
    }

    setNewProfilePicture = ({ file, onSuccess}) => {
        this.setState({ newProfilePicture: file })
        console.log(this.state.newProfilePicture)
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    }

    handleUploadChange = info => {
        let fileList = [info.fileList];
        this.setState({ fileList: fileList[0] });
    }

    findOrCreateChat(partner) {
      this.state.title = `Chat`;
      fetch(`${config.backend_url}/messaging/getChatHistory?id=${partner}`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(`Error is: ${err}`));  
    }

    render() {
        
        let createCards = (type) => {
            console.log('creatingCards')
            const gameInfo = this.state[type];
            if (!gameInfo) return;
            const cards = [];
            for (let i = 0; i < gameInfo.length; i += 2) {
                cards.push(
                    <div className="card" key={i}>
                        <Link to={`/singlegame/?id=${gameInfo[i].data.id}`}>
                            <img src={"http://" + gameInfo[i+1].data} />
                        </Link>
                        <div className="card-text-box">
                            <span className="card-text">{gameInfo[i].data.name}</span>
                            <br/>
                            { this.state.isProfileOwner && 
                                <Text className='card-text' style={{ cursor: 'pointer' }}onClick={ () => { this.removeCard(type, gameInfo[i].data.id) }}>Remove</Text>
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
            slidesToScroll: 4,
            slidesToShow: 4
        };
        return (
            <div id='main'>
                <Modal
                    title='Please add some additional Information'
                    visible={this.state.showAdditionalInfoModal}
                    footer={[]}
                >
                    <Text>Other users will only be able to see the City you are in. You can choose to share your full address with other users.</Text>
                    <AddInfoForm setAddInfo={this.setAddInfo} user={this.props.user} />
                </Modal>
                <Modal 
                    title='Change Profile Picture' 
                    visible={this.state.showProfileModal}
                    onCancel={this.handleProfileModalCancel}
                    footer={[
                        <Button key='cancel' onClick={this.handleProfileModalCancel}>Cancel</Button>,
                        <Button key='submit' form='profile-form' htmlType='submit'>Ok</Button>
                    ]}
                >
                    <form id='profile-form' onSubmit={this.handleProfileModalOk}>
                        <Upload.Dragger 
                            name='file' 
                            multiple={false} 
                            customRequest={this.setNewProfilePicture} 
                            onChange={this.handleUploadChange}
                            accept='image/*'
                            fileList={this.state.fileList}>
                        <p className="ant-upload-text">Click or drag a picture</p>
                        </Upload.Dragger>
                    </form>
                </Modal>
                <div className='user_info'>
                    { (!this.state.userInfo || !this.state.userInfo.profilePicture)&& <Icon style={{ fontSize: '150px' }} type="user" />}
                    { this.state.userInfo && this.state.userInfo.profilePicture && 
                        <div>
                            <img className='profile_image' src={ this.state.userInfo.profilePicture } />
                        </div>
                    }
                    { this.state.isProfileOwner &&
                        <Text id='change_profile_pic' onClick={this.openProfileModal}>Change Profile Picture</Text>
                    }
                    <div id='name_and_loc'>
                        <div id='name'>
                            { (this.state.userInfo && this.state.userInfo.username) && (this.state.isProfileOwner 
                                ? <Title editable={{ onChange: this.onUsernameEdit }}>{ this.state.userInfo.username }</Title>
                                : <Title>{ this.state.userInfo.username }</Title>)
                            }
                        </div>
                        <br />
                        <div id='loc'>
                            { (this.state.userInfo && (this.state.userInfo.address))
                                ? <Title level={3}>{ this.state.userInfo.address }</Title>
                                : (this.state.userInfo 
                                    ? <Title level={3}>{ this.state.userInfo.city }</Title> 
                                    : <></>)
                            }
                        </div>
                        { this.state.distance && 
                            <Text id='distance'>{ this.state.distance } miles away</Text>
                        }
                    </div>
                    { this.state.isProfileOwner && 
                        <Button type='primary' id='edit' onClick={this.openAdditionalInfoModal}>Edit profile</Button>
                    }
                </div>
                <hr />
                <div id='hosting'>
                    <Title level={2}>Games Hosting</Title>
                    <hr />
                    <div className='games_list'>
                        <div className='games_list_children'>
                            { hostingCards.length ?
                            <>
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
                            </>
                            : <Empty />
                            }
                        </div>
                    </div>
                    <Title level={2}>Favorites</Title>
                    <hr />
                    <div className='games_list'>
                        <div className='games_list_children'>
                            { favoritesCards.length ? 
                            <>
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
                            </>
                            : <Empty />
                            }
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
                    <Link to={ `/messages?id=${ this.state.userId }`} onClick={this.findOrCreateChat(this.state.userId)}>
                       <Title level={3}><Icon type="mail" /> Message this host</Title>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Profile;