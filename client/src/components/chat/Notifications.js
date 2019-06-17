
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
  }

  initSocket = () =>{
    console.log('socket inited');
    const { user } = this.props.auth;
    const socket = io('http://127.0.0.1:5002', {
    transports: ['websocket'], jsonp: false });
    socket.connect();
    socket.on('connect', ()=>{
      this.setState({socket: socket});
      this.state.socket.emit('joinYourNotificationRoom', user.id);
      this.state.socket.on('addNotification', (notification)=>{
        this.props.notificationToServer(notification, ()=> {
          console.log('callback fired');
          //clear notifications
          this.props.getNotifications(user.id);
        });
      });
    })
  }

  componentWillMount(){
    this.initSocket();
    const { user } = this.props.auth;
    this.props.getNotifications(user.id);
  }


  render() {
    console.log('these are the notifications', this.props.notification);
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
    auth:state.auth,
    notifications: state.notifications.notifications
  };
};


export default connect(mapStateToProps, { getNotifications, notificationToServer})(Notifications);


//socket.emit(joinNotificationRoom)
