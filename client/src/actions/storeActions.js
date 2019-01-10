export const getAllStores = (deployed) => {
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

      dispatch({
        type: "GET_STORES_SUCCESS",
        payload: store
      });
    }
  }
}
