const initialState = {
  products: [],
  product: {}
};

const Product = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PRODUCTS_SUCCESS": {
      return Object.assign({}, state, {
        products: action.payload
      });
    }

    case "GET_ONE_PRODUCT_SUCCESS": {
      return Object.assign({}, state, {
        product: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

export default Product;
