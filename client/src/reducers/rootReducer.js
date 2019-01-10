import { combineReducers } from "redux";

import Contract from "./Contract";
import User from "./User";
import Store from "./Store";
import Product from "./Product";

const appReducer = combineReducers({
  Contract,
  User,
  Store,
  Product
});

export default appReducer;
