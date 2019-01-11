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
        return dispatch({
          type: "GET_ONE_STORE_SUCCESS",
          payload: store
        });
      }
    }
  }
}
