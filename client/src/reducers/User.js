const initialState = {
  user: {},
  userType: 0
};

const User = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_SUCCESS": {
      return Object.assign({}, state, action.payload);
    }

    default: {
      return state;
    }
  }
}

export default User;