const initialState = {
  loadingStates: []
};

const Loading = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING_START": {
      if (state.loadingStates.indexOf(action.payload) >= 0) {
        return state;
      }

      return Object.assign({}, state, {
        loadingStates: state.loadingStates.concat(action.payload)
      });
    }

    case "LOADING_STOP": {
      return Object.assign({}, state, {
        loadingStates: state.loadingStates.filter(ls => ls !== action.payload)
      });
    }

    default: {
      return state;
    }
  }
}

export default Loading;
