import { combineReducers } from "redux";

import Contract from "./Contract";
import User from "./User";
import Store from "./Store";
import Product from "./Product";
import Loading from "./Loading";

const appReducer = combineReducers({
  Contract,
  User,
  Store,
  Product,
  Loading
});

export default appReducer;
