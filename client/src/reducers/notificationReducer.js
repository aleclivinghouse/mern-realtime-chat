import { DELETE_NOTIFICATION, GET_NOTIFICATIONS,SEND_NOTIFICATION } from '../actions/types';

const initialState = {
  notifications:[]
};

export default function(state = initialState, action) {
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
        return{
          ...state,
           notifications: [action.payload, ...state.notifications]
        }


    default:
      return state;
  }
}
