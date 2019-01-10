export const getAllStores = (deployed) => {
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

    dispatch({
      type: "GET_STORES_SUCCESS",
      payload: stores
    });
  }
}
