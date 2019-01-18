import React, { Component } from "react";
import { Container } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import CurrentState from "./CurrentState";
import Loading from "./Loading";

import { getEmergencyStopState, getContractOwnerAddress, addAdmin, addOwner, toggleEmergencyStop } from "../actions/adminActions";

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
    this.toggleEmergencyStop = this.toggleEmergencyStop.bind(this);
  }

  getEmergencyStopState() {
    this
    .props
    .actions
    .getEmergencyStopState(this.props.Contract);
  }

  componentDidMount() {
    this.getEmergencyStopState();

    this
    .props
    .actions
    .getContractOwnerAddress(this.props.Contract);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async addAdmin() {
    await this
    .props
    .actions
    .addAdmin(this.props.Contract, this.state.newAdminAddress, this.state.newAdminName);
  }

  async addOwner() {
    await this
    .props
    .actions
    .addOwner(this.props.Contract, this.state.newOwnerAddress, this.state.newOwnerName);
  }

  async toggleEmergencyStop() {
    await this
    .props
    .actions
    .toggleEmergencyStop(this.props.Contract);

    this.getEmergencyStopState();
  }

  render() {
    return (
      <React.Fragment>
        <Loading loadingStates={["ADD_ADMIN_LOADING", "ADD_OWNER_LOADING", "TOGGLE_EMERGENCY_STOP_LOADING"]} />

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

          { this.props.models.Admin.emergencyStop && this.props.Contract.accounts[0] === this.props.models.Admin.contractOwnerAddress ?
            <div className="mt-4 alert alert-danger text-center">
              Contract is in emergency stop mode
            </div>
          : null }

          { this.props.Contract.accounts[0] === this.props.models.Admin.contractOwnerAddress ?
            <div className="mt-4 text-center">
              <button onClick={this.toggleEmergencyStop} className="btn btn-danger">Turn {this.props.models.Admin.emergencyStop ? "Off" : "On"} Emergency Stop Mode</button>
            </div>
          : null }
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Contract: state.Contract,
    models: {
      Admin: state.Admin
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      getEmergencyStopState: bindActionCreators(getEmergencyStopState, dispatch),
      getContractOwnerAddress: bindActionCreators(getContractOwnerAddress, dispatch),
      addAdmin: bindActionCreators(addAdmin, dispatch),
      addOwner: bindActionCreators(addOwner, dispatch),
      toggleEmergencyStop: bindActionCreators(toggleEmergencyStop, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
