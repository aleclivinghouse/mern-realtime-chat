import { DELETE_ROOM, GET_CURRENT_ROOM } from '../actions/types';

const initialState = {
  rooms:[],
  currentRoom: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DELETE_ROOM:
      return {
         ...state,
        rooms: state.rooms.filter(room => room._id !== action.payload)
      }
     case GET_CURRENT_ROOM:
     return{
      ...state,
      currentRoom: action.payload
     }
    default:
      return state;
  }
}
