import { combineReducers } from "redux";

import Contract from "./Contract";
import Admin from "./Admin";
import User from "./User";
import Store from "./Store";
import Product from "./Product";
import Loading from "./Loading";

const appReducer = combineReducers({
  Contract,
  Admin,
  User,
  Store,
  Product,
  Loading
});

export default appReducer;
