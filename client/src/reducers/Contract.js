const initialState = {
  web3: null,
  accounts: null,
  deployed: null
};

const Contract = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVE_INSTANCE": {
      return Object.assign({}, state, action.payload);
    }

    default: {
      return state;
    }
  }
}

export default Contract;