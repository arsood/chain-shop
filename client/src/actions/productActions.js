export const getAllProducts = (Contract, storeNumber) => {
  return async (dispatch) => {
    try {
      const store = await Contract
      .deployed
      .methods
      .stores(storeNumber)
      .call();

      const productsLength = store.productNumber;

      let products = [];

      for (let i = 1; i <= productsLength; i++) {
        const product = await Contract
        .deployed
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

      return products;
    } catch(err) {
      console.log(err);
    }
  }
}

export const getOneProduct = (Contract, storeNumber, productNumber) => {
  return async (dispatch) => {
    try {
      let product = await Contract
      .deployed
      .methods
      .products(storeNumber, productNumber)
      .call();

      dispatch({
        type: "GET_ONE_PRODUCT_SUCCESS",
        payload: product
      });

      return product;
    } catch(err) {
      console.log(err);
    }
  }
}

export const addProduct = (Contract, storeNumber, name, description, price, inventory) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "ADD_PRODUCT_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .addProduct(storeNumber, name, description, Contract.web3.utils.toWei(price, "ether"), inventory)
      .send({ from: Contract.accounts[0] });

      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_PRODUCT_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_PRODUCT_LOADING"
      });
    }
  }
}

export const saveProductEdits = (Contract, storeNumber, productNumber, productObj) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "SAVE_PRODUCT_EDITS_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .saveProductEdits(storeNumber, productNumber, productObj.name, productObj.description, Contract.web3.utils.toWei(productObj.price, "ether"), productObj.inventory)
      .send({ from: Contract.accounts[0] });

      return dispatch({
        type: "LOADING_STOP",
        payload: "SAVE_PRODUCT_EDITS_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "SAVE_PRODUCT_EDITS_LOADING"
      });
    }
  }
}

export const buyProduct = (Contract, storeNumber, productNumber, productPrice) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "BUY_PRODUCT_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .buyProduct(storeNumber, productNumber)
      .send({ from: Contract.accounts[0], value: productPrice });

      return dispatch({
        type: "LOADING_STOP",
        payload: "BUY_PRODUCT_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "BUY_PRODUCT_LOADING"
      });
    }
  }
}

export const deleteProduct = (Contract, storeNumber, productNumber) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "DELETE_PRODUCT_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .deleteProduct(storeNumber, productNumber)
      .send({ from: Contract.accounts[0] });

      return dispatch({
        type: "LOADING_STOP",
        payload: "DELETE_PRODUCT_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "DELETE_PRODUCT_LOADING"
      });
    }
  }
}
