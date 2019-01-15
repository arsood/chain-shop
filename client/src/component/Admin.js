import React, { Component } from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";

import CurrentState from "./CurrentState";

class Admin extends Component {
  constructor() {
    super();

    this.state = {
      newAdminAddress: "",
      newAdminName: "",
      getUserAddress: "",
      newOwnerAddress: "",
      newOwnerName: "",
      emergencyStop: false,
      contractOwnerAddress: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.addAdmin = this.addAdmin.bind(this);
    this.addOwner = this.addOwner.bind(this);
    this.toggleEmergencyStop = this.toggleEmergencyStop.bind(this);
  }

  getEmergencyStopState() {
    this
    .props
    .Contract
    .deployed
    .methods
    .emergencyStop()
    .call()
    .then((es) => {
      this.setState({
        emergencyStop: es
      });
    });
  }

  componentDidMount() {
    this.getEmergencyStopState();

    this
    .props
    .Contract
    .deployed
    .methods
    .contractOwner()
    .call()
    .then((contractOwnerAddress) => {
      this.setState({ contractOwnerAddress });
    });
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

  async toggleEmergencyStop() {
    await this
    .props
    .Contract
    .deployed
    .methods
    .toggleEmergencyStop()
    .send({ from: this.props.Contract.accounts[0] });

    this.getEmergencyStopState();
  }

  render() {
    return (
      <Container>
        <CurrentState />

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

        { this.state.emergencyStop && this.props.Contract.accounts[0] === this.state.contractOwnerAddress ?
          <div className="mt-4 alert alert-danger text-center">
            Contract is in emergency stop mode
          </div>
        : null }

        { this.props.Contract.accounts[0] === this.state.contractOwnerAddress ?
          <div className="mt-4 text-center">
            <button onClick={this.toggleEmergencyStop} className="btn btn-danger">Turn {this.state.emergencyStop ? "Off" : "On"} Emergency Stop Mode</button>
          </div>
        : null }
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
