import React, { Component } from "react";
import { connect } from "react-redux";

class CurrentState extends Component {
  render() {
    return (
      <React.Fragment>
        { this.props.Contract.accounts ?
          <div className="alert alert-success text-center mt-4">
            Current Account: {this.props.Contract.accounts[0]}
          </div>
        : null }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Contract: state.Contract
  }
}

export default connect(mapStateToProps, null)(CurrentState);