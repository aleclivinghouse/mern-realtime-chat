import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import notificationReducer from './notificationReducer';
import roomReducer from './roomReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  notifications: notificationReducer,
  rooms: roomReducer
});
