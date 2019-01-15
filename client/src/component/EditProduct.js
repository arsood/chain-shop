import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Container } from "reactstrap";

import CurrentState from "./CurrentState";

import { getOneProduct, saveProductEdits } from "../actions/productActions";

class EditProduct extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      description: "",
      price: "",
      inventory: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this
    .props
    .actions
    .getOneProduct(this.props.Contract.deployed, this.props.match.params.storeNumber, this.props.match.params.productNumber)
    .then((product) => {
      this.setState({
        name: product.name,
        description: product.description,
        price: this.props.Contract.web3.utils.fromWei(product.price, "ether"),
        inventory: product.inventory
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
    .saveProductEdits(this.props.Contract.deployed, this.props.Contract.accounts, this.props.Contract.web3, this.props.match.params.storeNumber, this.props.match.params.productNumber, this.state)
    .then(() => {
      window.location.href = `/stores/${this.props.match.params.storeNumber}/products`;
    });
  }

  render() {
    return (
      <Container>
        <CurrentState />

        <h2 className="text-center">Edit {this.props.models.Product.product.name}</h2>

        <div className="mt-3 text-center">
          <a href={`/stores/${this.props.match.params.storeNumber}/products`}>Back to Store</a>
        </div>

        <form onSubmit={this.handleSubmit} className="mt-3">
          <input name="name" onChange={this.handleChange} type="text" className="form-control" placeholder="Name" value={this.state.name} />

          <input name="description" onChange={this.handleChange} type="text" className="form-control mt-3" placeholder="Description" value={this.state.description} />

          <input name="price" onChange={this.handleChange} type="number" className="form-control mt-3" placeholder="Price" value={this.state.price} />

          <input name="inventory" onChange={this.handleChange} type="number" className="form-control mt-3" placeholder="Inventory" value={this.state.inventory} />

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
      Product: state.Product
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      getOneProduct: bindActionCreators(getOneProduct, dispatch),
      saveProductEdits: bindActionCreators(saveProductEdits, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
