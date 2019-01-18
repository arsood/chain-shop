import React, { Component } from "react";
import { connect } from "react-redux";

class Loading extends Component {
  render() {
    let showLoading = false;

    this.props.models.Loading.loadingStates.forEach((ls) => {
      return this.props.loadingStates.forEach((lsp) => {
        if (ls === lsp) {
          showLoading = true;
          return true;
        }
      });
    });

    return (
      <React.Fragment>
        { showLoading ?
          <div className="loading-screen-overlay">
            <div className="loading-screen-text">
              Please Wait... <br />
              Confirming Transaction on Blockchain
            </div>
          </div>
        : null }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    models: {
      Loading: state.Loading
    }
  }
};

export default connect(mapStateToProps, null)(Loading);
