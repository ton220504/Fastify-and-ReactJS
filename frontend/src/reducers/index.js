// reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './userReduce'; // Giả sử bạn có một reducer cho user
import toastReducer from './toastReducer';
const rootReducer = combineReducers({
  user_data: userReducer, // Đây là state user_data trong Redux store
   toast: toastReducer,  // Thêm reducer toast vào
});

export default rootReducer;
