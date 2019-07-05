
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
      this.setState({socket: socket});
      this.state.socket.emit('joinYourNotificationRoom', user.id);

      this.state.socket.on('addNotification', (notification)=>{
        let notifications = [];
        let newArr = [];
        notifications.push(notification);
        let map = {};
        for(notification of notifications){
          if(!map[notification.tag]){
            map[notification.tag] = 1;
          } else {
            map[notification.tag] = null;
          }
          if(map[notification.tag] !== null){
            newArr.push(notification);
          }
        }
        console.log('this is the tag', notification.tag);

        for(let notification of newArr){
        this.props.notificationToServer(notification, ()=> {
          this.props.getNotifications(user.id);
        });
     }
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
