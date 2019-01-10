const initialState = {
  stores: []
};

const Store = (state = initialState, action) => {
  switch (action.type) {
    case "GET_STORES_SUCCESS": {
      return Object.assign({}, state, {
        stores: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

export default Store;
