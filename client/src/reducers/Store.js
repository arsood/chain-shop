const initialState = {
  stores: [],
  store: {
    name: "",
    city: ""
  }
};

const Store = (state = initialState, action) => {
  switch (action.type) {
    case "GET_STORES_SUCCESS": {
      return Object.assign({}, state, {
        stores: action.payload
      });
    }

    case "GET_ONE_STORE_SUCCESS": {
      return Object.assign({}, state, {
        store: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

export default Store;
