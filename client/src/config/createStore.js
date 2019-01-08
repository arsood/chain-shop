import { createStore, compose, applyMiddleware } from "redux";
import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

import rootReducer from "../reducers/rootReducer";

const history = createHistory();
const reactRouterMiddleware = routerMiddleware(history);

export default function() {
  return createStore(
    rootReducer,
    undefined,
    compose(applyMiddleware(thunk, reactRouterMiddleware, logger))
  );
}