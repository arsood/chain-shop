import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { getAllProducts } from "../actions/productActions";
import { getOneStore } from "../actions/storeActions";

class Products extends Component {
  constructor() {
    super();

    this.state = {
      showAddProductModal: false,
      newProductName: "",
      newProductDescription: "",
      newProductPrice: 0
    };

    this.toggleAddProductModal = this.toggleAddProductModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount() {
    this
    .props
    .actions
    .getAllProducts(this.props.Contract.deployed, this.props.match.params.storeNumber);

    this
    .props
    .actions
    .getOneStore(this.props.Contract.deployed, this.props.match.params.storeNumber);
  }

  toggleAddProductModal(event) {
    if (event) {
      event.preventDefault();

      this.setState({
        showAddProductModal: this.state.showAddProductModal ? false : true
      });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async addProduct() {
    const newProduct = await this
    .props
    .Contract
    .deployed
    .methods
    .addProduct(this.props.match.params.storeNumber, this.state.newProductName, this.state.newProductDescription, this.state.newProductPrice)
    .send({ from: this.props.Contract.accounts[0] });

    this.setState({
      newProductName: "",
      newProductDescription: "",
      newProductPrice: 0,
      showAddProductModal: false
    });

    this
    .props
    .actions
    .getAllProducts(this.props.Contract.deployed, this.props.match.params.storeNumber);
  }

  render() {
    return (
      <Container>
        <h1 className="text-center mt-3">{this.props.models.Store.store.name}'s Products</h1>

        <div className="mt-3 text-center">
          <a href="#" onClick={this.toggleAddProductModal}>Add New Product +</a>
        </div>

        { this.props.models.Product.products.length ?
          <Row className="mt-3">
            { this.props.models.Product.products.map((product, index) => {
              return (
                <Col sm="4" key={index} className="mt-3">
                  <div className="card">
                    <div className="card-body">
                      <h2 className="text-center">{product.name}</h2>

                      <div className="mt-2 text-center">
                        {product.description}
                      </div>

                      <div className="mt-2 text-center">
                        ${parseInt(product.price)}
                      </div>

                      <Row className="mt-4">
                        <Col sm="6">
                          <a href={`/stores/${index}/products`} className="btn btn-info btn-block">View Products</a>
                        </Col>
                        <Col sm="6">
                          <a href="" className="btn btn-warning btn-block">Edit</a>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              );
            }) }
          </Row>
        : null }

        <Modal isOpen={this.state.showAddProductModal} toggle={this.toggleAddProductModal}>
          <ModalHeader toggle={this.toggleAddProductModal}>Add Product</ModalHeader>
        
          <ModalBody>
            <input onChange={this.handleChange} name="newProductName" type="text" className="form-control mt-3" placeholder="Enter name of new product" />

            <input onChange={this.handleChange} name="newProductDescription" type="text" className="form-control mt-3" placeholder="Enter description of new product" />

            <input onChange={this.handleChange} name="newProductPrice" type="number" className="form-control mt-3" placeholder="Enter price of new product" />
          </ModalBody>

          <ModalFooter>
            <button onClick={this.addProduct} className="btn btn-primary">Add Product</button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Contract: state.Contract,
    models: {
      Store: state.Store,
      Product: state.Product
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      getAllProducts: bindActionCreators(getAllProducts, dispatch),
      getOneStore: bindActionCreators(getOneStore, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);
