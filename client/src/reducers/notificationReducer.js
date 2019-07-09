import { DELETE_NOTIFICATION, GET_NOTIFICATIONS,SEND_NOTIFICATION } from '../actions/types';

const initialState = {
  notifications:[]
};

export default function(state = initialState, action) {
  console.log('notification in the reducer', action.type, 'payloaddd', action.payload);
  switch (action.type) {
    case DELETE_NOTIFICATION:
      return {
         ...state,
        notifications: state.notifications.filter(notification => notification._id !== action.payload)
      }
      case GET_NOTIFICATIONS:
        return{
          ...state,
          notifications: action.payload
        }
      case SEND_NOTIFICATION:
      console.log('existing notifs', state.notifications)
      console.log('new notifs', action.payload)
        return{
          ...state,
           notifications: [action.payload, ...state.notifications]
        }



    default:
      return state;
  }
}
