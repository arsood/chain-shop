import { combineReducers } from "redux";

import Contract from "./Contract";
import User from "./User";
import Store from "./Store";

const appReducer = combineReducers({
  Contract,
  User,
  Store
});

export default appReducer;
