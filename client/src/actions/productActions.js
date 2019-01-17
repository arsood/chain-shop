export const getAllProducts = (deployed, storeNumber) => {
  return async (dispatch) => {
    const store = await deployed
    .methods
    .stores(storeNumber)
    .call();

    const productsLength = store.productNumber;

    let products = [];

    for (let i = 1; i <= productsLength; i++) {
      let product = await deployed
      .methods
      .products(storeNumber, i)
      .call();

      if (parseInt(product.state) === 0) {
        products.push(product);
      }
    }

    dispatch({
      type: "GET_PRODUCTS_SUCCESS",
      payload: products
    });
  }
}

export const getOneProduct = (deployed, storeNumber, productNumber) => {
  return async (dispatch) => {
    let product = await deployed
    .methods
    .products(storeNumber, productNumber)
    .call();

    dispatch({
      type: "GET_ONE_PRODUCT_SUCCESS",
      payload: product
    });

    return product;
  }
}

export const saveProductEdits = (deployed, accounts, web3, storeNumber, productNumber, productObj) => {
  return async (dispatch) => {
    await deployed
    .methods
    .saveProductEdits(storeNumber, productNumber, productObj.name, productObj.description, web3.utils.toWei(productObj.price, "ether"), productObj.inventory)
    .send({ from: accounts[0] });

    return dispatch({
      type: "SAVE_PRODUCT_EDITS_SUCCESS"
    });
  }
}
