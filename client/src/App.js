import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import { Provider } from "react-redux";

import ShopContract from "./contracts/Shop.json";
import getWeb3 from "./utils/getWeb3";
import createStore from "./config/createStore";

import Home from "./component/Home";
import Products from "./component/Products";
import EditStore from "./component/EditStore";

import "./App.css";

const history = createBrowserHistory();
const store = createStore();

class App extends Component {
  constructor() {
    super();

    this.state = {
      contractLoaded: false
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ShopContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ShopContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      store.dispatch({
        type: "RECEIVE_INSTANCE",
        payload: {
          web3,
          accounts,
          deployed: instance
        }
      });

      const user = await instance
      .methods
      .users(accounts[0])
      .call();

      store.dispatch({
        type: "GET_USER_SUCCESS",
        payload: {
          user,
          userType: parseInt(user.userType)
        }
      });

      this.setState({
        contractLoaded: true
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (this.state.contractLoaded) {
      return (
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/stores/:storeNumber/products" component={Products} />
              <Route exact path="/stores/:storeNumber/edit" component={EditStore} />
            </Switch>
          </Router>
        </Provider>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

export default App;
