export const getAllStores = (deployed, isStoreOwner, ownerAddress) => {
  return async (dispatch) => {
    const storesLength = await deployed
    .methods
    .storeNumber()
    .call();

    let stores = [];

    for (let i = 1; i <= storesLength; i++) {
      let store = await deployed
      .methods
      .stores(i)
      .call();

      if (parseInt(store.state) === 0) {
        stores.push(store);
      }
    }

    if (isStoreOwner) {
      stores = stores.filter((store) => {
        return store.ownerAddress === ownerAddress;
      });
    }

    dispatch({
      type: "GET_STORES_SUCCESS",
      payload: stores
    });
  }
}

export const getOneStore = (deployed, storeNumber) => {
  return async (dispatch) => {
    let store = await deployed
    .methods
    .stores(storeNumber)
    .call();

    dispatch({
      type: "GET_ONE_STORE_SUCCESS",
      payload: store
    });

    return store;
  }
}

export const saveStoreEdits = (deployed, accounts, storeNumber, storeObj) => {
  return async (dispatch) => {
    await deployed
    .methods
    .saveStoreEdits(storeNumber, storeObj.name, storeObj.city)
    .send({ from: accounts[0] });

    return dispatch({
      type: "SAVE_STORE_EDITS_SUCCESS"
    });
  }
}

export const addStore = (deployed, accounts, name, city) => {
  return (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "ADD_STORE_LOADING"
    });

    return deployed
    .methods
    .addStore(name, city)
    .send({ from: accounts[0] })
    .then(() => {
      dispatch({
        type: "LOADING_STOP",
        payload: "ADD_STORE_LOADING"
      });

      return dispatch({
        type: "ADD_STORE_SUCCESS"
      });
    })
    .catch((err) => {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_STORE_LOADING"
      });
    });
  }
}

export const withdrawEarnings = (Contract, storeNumber) => {
  return (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "WITHDRAW_EARNINGS_LOADING"
    });

    return Contract
    .deployed
    .methods
    .withdrawEarnings(storeNumber)
    .send({ from: Contract.accounts[0] })
    .then(() => {
      dispatch({
        type: "LOADING_STOP",
        payload: "WITHDRAW_EARNINGS_LOADING"
      });

      return dispatch({
        type: "WITHDRAW_EARNINGS_SUCCESS"
      });
    })
    .catch((err) => {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "WITHDRAW_EARNINGS_LOADING"
      });
    });
  }
}

export const deleteStore = (Contract, storeNumber) => {
  return (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "DELETE_STORE_LOADING"
    });

    return Contract
    .deployed
    .methods
    .deleteStore(storeNumber)
    .send({ from: Contract.accounts[0] })
    .then(() => {
      dispatch({
        type: "LOADING_STOP",
        payload: "DELETE_STORE_LOADING"
      });

      return dispatch({
        type: "DELETE_STORE_SUCCESS"
      });
    })
    .catch((err) => {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "DELETE_STORE_LOADING"
      });
    });
  }
}
