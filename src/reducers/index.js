import { combineReducers } from "redux";
import loginAction from "./login.reducer";
import isLoading from "./loader.reducer";
import headerTitle from "./header.reducer";
// import configAction from "./config.reducer";

const rootReducer = combineReducers({
  loginAction,
  isLoading,
  headerTitle,
//   configAction,
});

export default rootReducer;
