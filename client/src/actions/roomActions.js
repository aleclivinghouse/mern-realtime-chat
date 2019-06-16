import axios from 'axios';
import {DELETE_ROOM, GET_CURRENT_ROOM} from './types';

export const deleteRoom = roomId => dispatch=>{
  console.log('this is the room id in the action', roomId);
  axios.delete(`http://localhost:5002/api/chat/delete/${roomId}`)
  .then(res => dispatch({type: DELETE_ROOM, payload: res.data}))
}

export const getCurrentRoom = roomId => dispatch=>{
  console.log('this is the room id in the action', roomId);
  axios.get(`/api/chat/getCurrentRoom/${roomId}`)
  .then(res => dispatch({type: GET_CURRENT_ROOM, payload: res.data}))
}
