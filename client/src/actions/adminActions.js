export const getEmergencyStopState = (Contract) => {
  return async (dispatch) => {
    try {
      const es = await Contract
      .deployed
      .methods
      .emergencyStop()
      .call();

      return dispatch({
        type: "GET_EMERGENCY_STOP_STATE_SUCCESS",
        payload: es
      });
    } catch(err) {
      console.log(err);
    }
  }
}

export const getContractOwnerAddress = (Contract) => {
  return async (dispatch) => {
    try {
      const contractOwnerAddress = await Contract
      .deployed
      .methods
      .contractOwner()
      .call();

      return dispatch({
        type: "GET_CONTRACT_OWNER_ADDRESS_SUCCESS",
        payload: contractOwnerAddress
      });
    } catch(err) {
      console.log(err);
    }
  }
}

export const addAdmin = (Contract, address, name) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "ADD_ADMIN_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .addAdmin(address, name)
      .send({ from: Contract.accounts[0] });

      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_ADMIN_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_ADMIN_LOADING"
      });
    }
  }
}

export const addOwner = (Contract, address, name) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "ADD_OWNER_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .addOwner(address, name)
      .send({ from: Contract.accounts[0] });

      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_OWNER_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "ADD_OWNER_LOADING"
      });
    }
  }
}

export const toggleEmergencyStop = (Contract) => {
  return async (dispatch) => {
    dispatch({
      type: "LOADING_START",
      payload: "TOGGLE_EMERGENCY_STOP_LOADING"
    });

    try {
      await Contract
      .deployed
      .methods
      .toggleEmergencyStop()
      .send({ from: Contract.accounts[0] });

      return dispatch({
        type: "LOADING_STOP",
        payload: "TOGGLE_EMERGENCY_STOP_LOADING"
      });
    } catch(err) {
      console.log(err);

      return dispatch({
        type: "LOADING_STOP",
        payload: "TOGGLE_EMERGENCY_STOP_LOADING"
      });
    }
  }
}
