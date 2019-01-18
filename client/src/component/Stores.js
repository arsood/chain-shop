import React, { Component } from "react";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getAllStores, addStore, withdrawEarnings, deleteStore } from "../actions/storeActions";

import CurrentState from "./CurrentState";
import Loading from "./Loading";

class Stores extends Component {
  constructor() {
    super();

    this.state = {
      newStoreName: "",
      newStoreCity: "",
      showAddStoreModal: false
    };

    this.addStore = this.addStore.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleAddStoreModal = this.toggleAddStoreModal.bind(this);
  }

  componentDidMount() {
    this
    .props
    .actions
    .getAllStores(this.props.Contract, this.props.models.User.userType === 2, this.props.Contract.accounts[0]);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  addStore() {
    this
    .props
    .actions
    .addStore(this.props.Contract, this.props.Contract.accounts, this.state.newStoreName, this.state.newStoreCity)
    .then(() => {
      this.setState({
        newStoreName: "",
        newStoreCity: "",
        showAddStoreModal: false
      });

      this
      .props
      .actions
      .getAllStores(this.props.Contract, this.props.models.User.userType === 2, this.props.Contract.accounts[0]);
    });
  }

  toggleAddStoreModal(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({
      showAddStoreModal: this.state.showAddStoreModal ? false : true
    });
  }

  async withdrawEarnings(storeNumber, earnings) {
    if (earnings === "0") {
      return alert("There are no funds to withdraw");
    }

    const withdrawConfirm = window.confirm(`Would you like to withdraw ${this.props.Contract.web3.utils.fromWei(earnings, "ether")} Ether to your account?`);

    if (!withdrawConfirm) {
      return false;
    }

    this
    .props
    .actions
    .withdrawEarnings(this.props.Contract, storeNumber)
    .then(() => {
      this
      .props
      .actions
      .getAllStores(this.props.Contract, this.props.models.User.userType === 2, this.props.Contract.accounts[0]);
    });
  }

  async deleteStore(storeNumber) {
    const deleteConfirm = window.confirm("Are you sure you want to delete this store?");

    if (!deleteConfirm) {
      return false;
    }
    
    this
    .props
    .actions
    .deleteStore(this.props.Contract, storeNumber)
    .then(() => {
      this
      .props
      .actions
      .getAllStores(this.props.Contract, this.props.models.User.userType === 2, this.props.Contract.accounts[0]);
    });
  }
  
  render() {
    return (
      <React.Fragment>
        <Loading loadingStates={["ADD_STORE_LOADING", "WITHDRAW_EARNINGS_LOADING", "DELETE_STORE_LOADING"]} />

        <Container>
          <CurrentState />

          <h1 className="text-center mt-4">{this.props.models.User.userType === 2 ? "Your Stores" : "All Stores"}</h1>

          { this.props.models.User.userType === 2 ?
            <div className="mt-3 text-center">
              <a href="#" onClick={this.toggleAddStoreModal}>Add New Store +</a>
            </div>
          : null }

          { this.props.models.Store.stores.length ?
            <Row className="mt-3">
              { this.props.models.Store.stores.map((store, index) => {
                if (store.state === "1") {
                  return false;
                }

                return (
                  <Col sm="4" key={index} className="mt-3">
                    <div className="card">
                      <div className="card-body">
                        <h2 className="text-center">{store.name}</h2>

                        <div className="mt-2 text-center">
                          {store.city}
                        </div>

                        { this.props.models.User.userType === 2 ?
                          <React.Fragment>
                            <div className="mt-2 text-center">
                              Earnings: {this.props.Contract.web3.utils.fromWei(store.earnings, "ether")} Ether
                            </div>

                            <div className="text-center mt-3">
                              <a href={`/stores/${store.storeNumber}/edit`}>Edit Store</a>
                            </div>

                            <Row className="mt-4">
                              <Col sm="6">
                                <a href={`/stores/${store.storeNumber}/products`} className="btn btn-info btn-block">View Products</a>
                              </Col>
                              <Col sm="6">
                                <button onClick={this.deleteStore.bind(this, store.storeNumber)} className="btn btn-danger btn-block">Delete</button>
                              </Col>
                            </Row>

                            <Row className="mt-4">
                              <Col sm="12">
                                <button onClick={this.withdrawEarnings.bind(this, store.storeNumber, store.earnings)} className="btn btn-secondary btn-block">Withdraw Earnings</button>
                              </Col>
                            </Row>
                          </React.Fragment>
                        :
                          <Row className="mt-4">
                            <Col sm="12">
                              <a href={`/stores/${store.storeNumber}/products`} className="btn btn-info btn-block">View Products</a>
                            </Col>
                          </Row>
                        }
                      </div>
                    </div>
                  </Col>
                );
              }) }
            </Row>
          : null }
        </Container>

        <Modal isOpen={this.state.showAddStoreModal} toggle={this.toggleAddStoreModal}>
          <ModalHeader toggle={this.toggleAddStoreModal}>Add Store</ModalHeader>
        
          <ModalBody>
            <input onChange={this.handleChange} name="newStoreName" type="text" className="form-control mt-3" placeholder="Enter name of new store" />

            <input onChange={this.handleChange} name="newStoreCity" type="text" className="form-control mt-3" placeholder="Enter city of new store" />
          </ModalBody>

          <ModalFooter>
            <button onClick={this.addStore} className="btn btn-primary">Add Store</button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
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
      getAllStores: bindActionCreators(getAllStores, dispatch),
      addStore: bindActionCreators(addStore, dispatch),
      withdrawEarnings: bindActionCreators(withdrawEarnings, dispatch),
      deleteStore: bindActionCreators(deleteStore, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stores);
