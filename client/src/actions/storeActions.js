export const getAllStores = (Contract, isStoreOwner, ownerAddress) => {
  return async (dispatch) => {
    try {
      const storesLength = await Contract
      .deployed
      .methods
      .storeNumber()
      .call();

      let stores = [];

      for (let i = 1; i <= storesLength; i++) {
        let store = await Contract
        .deployed
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
    } catch(err) {
      console.log(err);
    }
  }
}

export const getOneStore = (Contract, storeNumber) => {
  return async (dispatch) => {
    try {
      let store = await Contract
      .deployed
      .methods
      .stores(storeNumber)
      .call();

      dispatch({
        type: "GET_ONE_STORE_SUCCESS",
        payload: store
      });

      return store;
    } catch(err) {
      console.log(err);
    }
  }
}

export const saveStoreEdits = (Contract, storeNumber, storeObj) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "SAVE_STORE_EDITS_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .saveStoreEdits(storeNumber, storeObj.name, storeObj.city)
      .send({ from: Contract.accounts[0] });

      return dispatch({
        type: "LOADING_STOP",
        payload: "SAVE_STORE_EDITS_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "SAVE_STORE_EDITS_LOADING"
      });
    }
  }
}

export const addStore = (Contract, name, city) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "ADD_STORE_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .addStore(name, city)
      .send({ from: Contract.accounts[0] });
      
      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_STORE_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_STORE_LOADING"
      });
    }
  }
}

export const withdrawEarnings = (Contract, storeNumber) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "WITHDRAW_EARNINGS_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .withdrawEarnings(storeNumber)
      .send({ from: Contract.accounts[0] });

      return dispatch({
        type: "LOADING_STOP",
        payload: "WITHDRAW_EARNINGS_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "WITHDRAW_EARNINGS_LOADING"
      });
    }
  }
}

export const deleteStore = (Contract, storeNumber) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "DELETE_STORE_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .deleteStore(storeNumber)
      .send({ from: Contract.accounts[0] });
      
      return dispatch({
        type: "LOADING_STOP",
        payload: "DELETE_STORE_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "DELETE_STORE_LOADING"
      });
    }
  }
}
