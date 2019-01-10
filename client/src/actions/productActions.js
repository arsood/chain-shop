export const getAllProducts = (deployed, storeNumber) => {
  return async (dispatch) => {
    const productsLength = await deployed
    .methods
    .getProductsLength()
    .call();

    let products = [];

    for (let i = 0; i < productsLength; i++) {
      let product = await deployed
      .methods
      .products(i)
      .call();

      products.push(product);
    }

    const filteredProducts = products.filter((product) => {
      if (product.storeNumber === storeNumber) {
        return true;
      }

      return false;
    });

    dispatch({
      type: "GET_PRODUCTS_SUCCESS",
      payload: filteredProducts
    });
  }
}
