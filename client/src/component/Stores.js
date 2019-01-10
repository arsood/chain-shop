import React, { Component } from "react";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";

class Stores extends Component {
  constructor() {
    super();

    this.state = {
      newStoreName: "",
      newStoreCity: "",
      stores: [],
      showAddStoreModal: false
    };

    this.addStore = this.addStore.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleAddStoreModal = this.toggleAddStoreModal.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async addStore() {
    this
    .props
    .Contract
    .deployed
    .methods
    .addStore(this.state.newStoreName, this.state.newStoreCity)
    .send({ from: this.props.Contract.accounts[0] })
    .then(() => {
      this.setState({
        newStoreName: "",
        newStoreCity: "",
        showAddStoreModal: false
      });
    })
    .catch((err) => {
      console.log(err);
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
  
  render() {
    return (
      <React.Fragment>
        <Container>
          <h1 className="text-center mt-4">Someone's Stores</h1>

          <div className="mt-3 text-center">
            <a href="#" onClick={this.toggleAddStoreModal}>Add New Store +</a>
          </div>
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
    Contract: state.Contract
  }
};

export default connect(mapStateToProps, null)(Stores);
