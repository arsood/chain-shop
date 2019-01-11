export const getAllProducts = (deployed, storeNumber) => {
  return async (dispatch) => {
    const productsLength = await deployed
    .methods
    .getProductsLength(storeNumber)
    .call();

    let products = [];

    for (let i = 0; i < productsLength; i++) {
      let product = await deployed
      .methods
      .products(storeNumber, i)
      .call();

      console.log(product);

      products.push(product);
    }

    dispatch({
      type: "GET_PRODUCTS_SUCCESS",
      payload: products
    });
  }
}
