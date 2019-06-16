import axios from 'axios';
import {DELETE_NOTIFICATION, GET_NOTIFICATIONS, SEND_NOTIFICATION} from './types';

export const deleteNotification = id => dispatch => {
  axios.delete(`http://localhost:5002/api/chat/deleteNotification/${id}`)
  .then(res => dispatch({type: DELETE_NOTIFICATION, payload: id}))
}

export const notificationToServer = notification => dispatch => {
  axios.post(`http://localhost:5002/api/chat/sendNotification`, notification)
  .then(res => dispatch({type: SEND_NOTIFICATION, payload: res.data}))
}

export const getNotifications = userId => dispatch => {
  axios.get(`http://localhost:5002/api/chat/getNotifications/${userId}`)
  .then(res => dispatch({type: GET_NOTIFICATIONS, payload: res.data}))
}
