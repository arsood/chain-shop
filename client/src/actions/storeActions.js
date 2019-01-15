import { bindActionCreators } from "../../../../../../Library/Caches/typescript/3.2/node_modules/redux";

export const getAllStores = (deployed, isStoreOwner, ownerAddress) => {
  return async (dispatch) => {
    const storesLength = await deployed
    .methods
    .getStoresLength()
    .call();

    let stores = [];

    for (let i = 0; i < storesLength; i++) {
      let store = await deployed
      .methods
      .stores(i)
      .call();

      stores.push(store);
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
    const storesLength = await deployed
    .methods
    .getStoresLength()
    .call();

    for (let i = 0; i < storesLength; i++) {
      let store = await deployed
      .methods
      .stores(i)
      .call();

      if (store.storeNumber === storeNumber) {
        dispatch({
          type: "GET_ONE_STORE_SUCCESS",
          payload: store
        });

        return store;
      }
    }
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
