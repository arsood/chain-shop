const initialState = {
  emergencyStop: false,
  contractOwnerAddress: ""
};

const Admin = (state = initialState, action) => {
  switch (action.type) {
    case "GET_EMERGENCY_STOP_STATE_SUCCESS": {
      return Object.assign({}, state, {
        emergencyStop: action.payload
      });
    }

    case "GET_CONTRACT_OWNER_ADDRESS_SUCCESS": {
      return Object.assign({}, state, {
        contractOwnerAddress: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

export default Admin;
