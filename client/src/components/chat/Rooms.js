
import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import {deleteRoom} from '../../actions';
import Notifications from './Notifications';

const socketURL="http://localhost:3000";
class Rooms extends Component {
  constructor(props){
    super(props);
    this.state = {
      rooms: [],
      roomTitle: '',
      socket: null,
      filterId: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
    this.initSocket();
  }

  initSocket = () => {
    const { user } = this.props.auth;
    const socket = openSocket('http://127.0.0.1:5002', {
  transports: ['websocket'], jsonp: false });
  socket.connect();
  socket.on('connect', () => {
    console.log('the socket is connected');
    this.setState({socket: socket});
    this.state.socket.on('updateRoomsList', (room) => {
      console.log('update rooms lists fired ');
       this.setState({rooms: [...this.state.rooms, room]}, ()=> {
       })
    });
  });
  }

  componentDidMount(){
    const { user } = this.props.auth;
    axios.get('/api/chat/rooms')
      .then((res)=>{
        console.log('these are the rooms', res);
        this.setState({rooms: res.data});
      }).catch((err)=>{
        console.log(err);
      })
      console.log('this should be the user', user.id);
  }




  onSubmit(e) {
    const { user } = this.props.auth;
   e.preventDefault();
       this.state.socket.emit('createRoom', this.state.roomTitle, user.id);
       // this.setState({rooms: [...this.state.rooms, ]})
   }


 onChange(e){
  this.setState({[e.target.name]: e.target.value});
}

onDeleteClick(id){
  this.setState({filterId: id});
  console.log('delete button fired', id);
  this.state.socket.emit('deleteRoom', id);

  this.state.socket.on('removeRoom', (roomId)=> {
    this.setState({rooms: [...this.state.rooms.filter(room => room._id!==roomId) ]})
  });
  this.setState({rooms: [...this.state.rooms.filter(room => room._id!==id) ]})
}



  render() {
    const { user } = this.props.auth;
    const  roomTitles = this.state.rooms.map((room => {
      return(
      <div>
        <div class="row">
     <div class="col s12 m6 offset-m2">
       <div class="card  grey lighten-4">
         <div class="card-content grey-text">
           <span class="card-title">{room.title}</span>
         </div>
         <div class="card-action  grey-text grey lighten-4">
            <Link to={`/chat/${room._id}`} class="grey-text">link</Link>
              { //Check if message failed
          (user.id === room.admin)
            ?<button
                onClick={this.onDeleteClick.bind(this, room._id)}
                type="button"
                className="btn btn-danger mr-1"
              > Delete </button>
            : <span></span>
        }
         </div>
       </div>
     </div>
   </div>
      </div>
    );
    }));

    return (
      <div class="row">
        <Notifications />
    <div class="input-field col s6 offset-m2">
       <form onSubmit={this.onSubmit}>
       <label className="active" for="roomTitle">New Room</label>
      <input value={this.state.roomTitle} name="roomTitle" id="roomTitle" type="text" onChange={this.onChange} lassName="roomTitle" />
        <button class="btn grey darken-1" input="submit" name="submit" value="submit">Submit
        <i class="material-icons right">send</i>
      </button>
      </form>
    </div>
    <div>
      {roomTitles}
      </div>
  </div>
    );
  }
}
const mapStateToProps = state => {
  // console.log('this is mstp', state);
  return{
    auth:state.auth
  };
};

export default connect(mapStateToProps, { deleteRoom})(Rooms);
