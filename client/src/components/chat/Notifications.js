import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import {notificationToServer, getNotifications} from '../../actions';
import NotificationContainer from './NotificationContainer';
import axios from 'axios';

const socketURL="http://localhost:3000";
class Notifications extends Component {
  constructor(props){
    super(props);
    this.state = {
      notifications:[],
      socket:null
    }
    this.initSocket();
  }

  initSocket = () =>{
    this.props.getCurrentUser();
    const socket = io('http://127.0.0.1:5002', {
    transports: ['websocket'], jsonp: false });
    socket.connect();
    socket.on('connect', ()=>{
      this.setState({socket: socket});
      this.state.socket.emit('joinYourNotificationRoom', this.props.user._id);
      this.state.socket.on('addNotification', (notification)=>{
        if(notification.text.includes(this.props.user.username)===false){
        console.log('this is the notification received', notification);
        this.props.notificationToServer(notification);
       }
      });
    })
  }

  componentWillMount(){
    this.props.getNotifications(this.props.user._id);
  }


  render() {
    console.log('these are the notifications', this.props);
    let notifications = this.props.notifications.map((notification)=>
      <NotificationContainer notification={notification} />

    );
    return (
      <div className="App">
        <h6>Notifications</h6>
        {notifications}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    user: state.auth.user,
    notifications: state.notifications.notifications
  };
};


export default connect(mapStateToProps, { getNotifications, notificationToServer})(Notifications);


//socket.emit(joinNotificationRoom)
