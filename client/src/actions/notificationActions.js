import axios from 'axios';
import {DELETE_NOTIFICATION, GET_NOTIFICATIONS, SEND_NOTIFICATION} from './types';

export const deleteNotification = id => dispatch => {
  axios.delete(`http://localhost:5002/api/chat/deleteNotification/${id}`)
  .then(res => dispatch({type: DELETE_NOTIFICATION, payload: id}))
}

export const notificationToServer = (notification, cb) => dispatch => {
  //console
  axios.post(`http://localhost:5002/api/chat/sendNotification`, notification)
  .then(res =>cb())
  .catch(err => console.log(err));
}

export const getNotifications = userId => dispatch => {
  axios.get(`/api/chat/getNotifications/${userId}`)
  .then(res => dispatch({type: GET_NOTIFICATIONS, payload: res.data}))
}

// export const clearNotifications = () => dispaatch => {
//   return (dispatch) => {
//     dispatch({type: CLEAR_NOTIFICATIONS, payload: nu})
//   }
// }
