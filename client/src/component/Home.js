import React, { Component } from "react";
import { connect } from "react-redux";

import Admin from "./Admin";
import Stores from "./Stores";

class Home extends Component {
  render() {
    if (this.props.models.User.userType === 1) {
      return (
        <Admin />
      );
    } else if (this.props.models.User.userType === 2) {
      return (
        <Stores />
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    models: {
      User: state.User
    }
  }
};

export default connect(mapStateToProps, null)(Home);
