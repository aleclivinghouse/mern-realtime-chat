
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
      socket:null,
      time: 0
    };
    this.startTimer = this.startTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }

  initSocket = () =>{
    console.log('socket inited');
    const { user } = this.props.auth;
    const socket = io('http://127.0.0.1:5002', {
    transports: ['websocket'], jsonp: false });
    socket.connect();
    socket.on('connect', ()=>{
      this.socket = socket;
      this.socket.emit('joinYourNotificationRoom', user.id);

      this.socket.on('addNotification', (notification)=>{
        console.log('add notif', notification)
        //this.props.notificationToServer(notification, ()=> {
          this.props.getNotifications(user.id);
        //});
   });
  });
  }

  startTimer() {
      this.timer = setInterval(() => this.setState({
        time: this.state.time + 1
      }), 1000)
      console.log("start")
    }

    resetTimer() {
      this.setState({time: 0})
      console.log("reset")
    }

  componentDidMount(){
    this.initSocket();
    const { user } = this.props.auth;
    this.props.getNotifications(user.id);
  }


  render() {
    console.log('these are the notifications', this.props.notifications);
    let notifications = this.props.notifications.map((notification)=> {
      //console.log('notiffssss', notification)
      return <NotificationContainer notification={notification} />;
    }


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
