import React, { Component } from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";

class Admin extends Component {
  constructor() {
    super();

    this.state = {
      newAdminAddress: "",
      newAdminName: "",
      getUserAddress: "",
      newOwnerAddress: "",
      newOwnerName: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.addAdmin = this.addAdmin.bind(this);
    this.addOwner = this.addOwner.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async addAdmin() {
    await this
    .props
    .Contract
    .deployed
    .methods
    .addAdmin(this.state.newAdminAddress, this.state.newAdminName)
    .send({ from: this.props.Contract.accounts[0] });
  }

  async addOwner() {
    await this
    .props
    .Contract
    .deployed
    .methods
    .addOwner(this.state.newOwnerAddress, this.state.newOwnerName)
    .send({ from: this.props.Contract.accounts[0] });
  }

  render() {
    return (
      <Container>
        <h1 className="text-center mt-4">Add Admin</h1>

        <input onChange={this.handleChange} name="newAdminAddress" type="text" className="form-control mt-3" placeholder="Enter address of new admin" />

        <input onChange={this.handleChange} name="newAdminName" type="text" className="form-control mt-3" placeholder="Enter name of new admin" />

        <div className="mt-3 text-center">
          <button onClick={this.addAdmin} className="btn btn-primary">Add Admin</button>
        </div>

        <h1 className="text-center mt-5">Add Store Owner</h1>

        <input onChange={this.handleChange} name="newOwnerAddress" type="text" className="form-control mt-3" placeholder="Enter address of new owner" />

        <input onChange={this.handleChange} name="newOwnerName" type="text" className="form-control mt-3" placeholder="Enter name of new store owner" />

        <div className="mt-3 text-center">
          <button onClick={this.addOwner} className="btn btn-primary">Add Store Owner</button>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Contract: state.Contract
  }
};

export default connect(mapStateToProps, null)(Admin);