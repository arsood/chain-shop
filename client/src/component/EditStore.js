import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container } from "reactstrap";

import CurrentState from "./CurrentState";

import { getOneStore, saveStoreEdits } from "../actions/storeActions";

class EditStore extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      city: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this
    .props
    .actions
    .getOneStore(this.props.Contract, this.props.match.params.storeNumber)
    .then((store) => {
      this.setState({
        name: store.name,
        city: store.city
      });
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this
    .props
    .actions
    .saveStoreEdits(this.props.Contract, this.props.Contract.accounts, this.props.match.params.storeNumber, this.state)
    .then(() => {
      window.location.href = "/";
    });
  }

  render() {
    return (
      <Container>
        <CurrentState />

        <h2 className="text-center">Edit {this.props.models.Store.store.name}</h2>

        <div className="mt-3 text-center">
          <a href="/">Back to All Stores</a>
        </div>

        <form onSubmit={this.handleSubmit} className="mt-3">
          <input name="name" onChange={this.handleChange} type="text" className="form-control" placeholder="Name" value={this.state.name} />

          <input name="city" onChange={this.handleChange} type="text" className="form-control mt-3" placeholder="Name" value={this.state.city} />

          <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary">Submit Changes</button>
          </div>
        </form>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Contract: state.Contract,
    models: {
      User: state.User,
      Store: state.Store
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      getOneStore: bindActionCreators(getOneStore, dispatch),
      saveStoreEdits: bindActionCreators(saveStoreEdits, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStore);
