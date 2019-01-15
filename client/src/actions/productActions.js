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

      products.push(product);
    }

    dispatch({
      type: "GET_PRODUCTS_SUCCESS",
      payload: products
    });
  }
}

export const getOneProduct = (deployed, storeNumber, productNumber) => {
  return async (dispatch) => {
    const productsLength = await deployed
    .methods
    .getProductsLength(storeNumber)
    .call();

    for (let i = 0; i < productsLength; i++) {
      let product = await deployed
      .methods
      .products(storeNumber, i)
      .call();

      if (product.productNumber = productNumber) {
        dispatch({
          type: "GET_ONE_PRODUCT_SUCCESS",
          payload: product
        });

        return product;
      }
    }
  }
}

export const saveProductEdits = (deployed, accounts, storeNumber, productNumber, productObj) => {
  return async (dispatch) => {
    await deployed
    .methods
    .saveProductEdits(storeNumber, productNumber, productObj.name, productObj.description, productObj.price, productObj.inventory)
    .send({ from: accounts[0] });

    return dispatch({
      type: "SAVE_PRODUCT_EDITS_SUCCESS"
    });
  }
}
