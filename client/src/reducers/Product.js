const initialState = {
  products: []
};

const Product = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PRODUCTS_SUCCESS": {
      return Object.assign({}, state, {
        products: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

export default Product;
