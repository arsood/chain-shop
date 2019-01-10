const initialState = {
  stores: []
};

const Store = (state = initialState, action) => {
  switch (action.type) {
    case "GET_STORES_SUCCESS": {
      return Object.assign({}, state, {
        stores: state.stores.concat(action.payload)
      });
    }

    default: {
      return state;
    }
  }
}

export default Store;
