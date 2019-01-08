import { combineReducers } from "redux";

import Contract from "./Contract";
import User from "./User";

const appReducer = combineReducers({
  Contract,
  User
});

export default appReducer;