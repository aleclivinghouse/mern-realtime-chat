import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';
import MessageContainer from './MessageContainer';
import { notificationToServer, getCurrentRoom} from '../../actions';
import { connect } from 'react-redux';
import Notifications from './Notifications';


//5002
const socketURL="http://localhost:3000";
class ChatRoom extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      socket: null,
      message: '',
      users: [],
      user: {},
      id:this.props.match.params.id
    }
    this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.initSocket();
      this.state.id = this.props.match.params.id;
  }

  componentWillMount(){
    axios.get(`http://localhost:5002/api/chat/messages/${this.state.id}`)
      .then((res)=>{
         console.log('these is the response with users', res);
        this.setState({messages: res.data});
      }).catch((err)=>{
        console.log(err);
      })
     console.log('this is the roomId', this.state.id);
     this.props.getCurrentRoom(this.state.id);
  }

  initSocket = () => {
    const { user } = this.props.auth;
    const socket = io('http://127.0.0.1:5002', {
  transports: ['websocket'], jsonp: false });
  socket.connect();
  socket.on('connect', () => {
    this.setState({socket: socket});
    console.log('this is the user after connecting to the socket', user.id);

    this.state.socket.emit('join', this.state.id, user.id);
    this.state.socket.on('updateUsersList', (users)=> {
      console.log('update user list fired');
      this.setState({users: users}, () => {
        console.log('these are the users after set state', this.state.users);
      })
    });
    this.state.socket.on('addMessage', (message)=>{
      console.log('add message is firing');
      this.setState({messages: [...this.state.messages, message]})
    });
  });
}


onSubmit(e){
    const { user } = this.props.auth;
 e.preventDefault();
 let messageObj = {};
 let messageObjS = {};
 let userObj = {};
 userObj.picture = user.picture;
 userObj.username = user.username;
 userObj.id = user.id
 //goes to local state
 messageObjS.user = user;
 messageObjS.text = this.state.message;
 messageObjS.room = this.state.id;
 console.log('this is messageObjS', messageObjS);
 //goes to the db
 messageObj.user = user.id;
 messageObj.text = this.state.message;
 messageObj.room = this.state.id;
 this.state.socket.emit('newMessage', this.state.id, messageObjS);
//for each user in th new users, we have to send them a notification

console.log('these are the users in the application', this.state.users);
let theUsers = [].concat.apply([], this.state.users);
console.log('theUsers', theUsers);

for(let user of theUsers){
  console.log('this is one of the users', user);
  if(user._id !== userObj._id){
    let notification = {};
    let notificationText = user.name + " sent a message in room " + this.props.currentRoom.title;
    notification.recipient = user._id;
    notification.text = notificationText;
    console.log('join notification about to be submitted', user._id);
    this.state.socket.emit('sendNotification', user._id, notification);
  }
}

 this.setState({messages: [...this.state.messages, messageObjS]});
 axios.post('http://localhost:5002/api/chat/messages', messageObj)
   .then((res)=>{
     console.log(res);
   }).catch((err)=>{
     console.log(err);
   })
 }

 //  onSend(messages = []) {
 //   this.setState((previousState) => ({
 //     messages: GiftedChat.append(previousState.messages, messages),
 //   }));
 // }



 onChange(e){
  this.setState({[e.target.name]: e.target.value});
}

  render() {
    console.log('this is the current Room', this.props.currentRoom);
    const  messages =  this.state.messages.map((message) =>
      <div>
        <MessageContainer message={message}/>
      </div>
    );

    return (
      <div className="App">
      <Notifications />
     <h3>You're in Room: {this.props.currentRoom.title}</h3>
       <Link to="/rooms">Back To Rooms</Link>
     <form onSubmit={this.onSubmit}>
      <label>
        Name:
        <input type="text" name="message" onChange={this.onChange} value={this.state.message}/>
      </label>
      <button class="btn grey darken-1" input="submit" name="submit" value="submit">Submit
      <i class="material-icons right">send</i>
    </button>
    </form>
      {messages}
    </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "100vh",
  },
  channelList: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "1px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
  },
  settings: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
};

const mapStateToProps = state => {
  return{
    auth:state.auth,
    currentRoom: state.rooms.currentRoom
  };
};

export default connect(mapStateToProps, { notificationToServer, getCurrentRoom})(ChatRoom);
