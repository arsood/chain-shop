pragma solidity ^0.5.0;

contract Shop {
  enum UserType { Guest, Admin, Owner }

  struct User {
    string name;
    UserType userType;
  }

  struct Store {
    address ownerAddress;
    uint storeNumber;
    string name;
    string city;
  }

  struct Product {
    address payable ownerAddress;
    uint productNumber;
    uint storeNumber;
    string name;
    string description;
    uint price;
    uint inventory;
  }

  // User state
  mapping (address => User) public users;

  // Store state
  uint public storeNumber;
  Store[] public stores;

  // Product state
  uint public productNumber;
  Product[] public products;

  modifier verifyAdmin(address userAddress) {
    require(users[userAddress].userType == UserType.Admin, "User must be an admin");
    _;
  }

  modifier verifyOwner(address ownerAddress) {
    require(users[ownerAddress].userType == UserType.Owner, "User must be an owner");
    _;
  }

  constructor() public {
    // Add contract owner as an admin
    users[msg.sender] = User({
      name: "Super Admin",
      userType: UserType.Admin
    });

    // Initializing state
    storeNumber = 0;
    productNumber = 0;
  }

  function addAdmin(address userAddress, string memory name) public
  verifyAdmin(msg.sender) {
    users[userAddress] = User({
      name: name,
      userType: UserType.Admin
    });
  }

  function addOwner(address userAddress, string memory name) public
  verifyAdmin(msg.sender) {
    users[userAddress] = User({
      name: name,
      userType: UserType.Owner
    });
  }

  function addStore(string memory name, string memory city) public
  verifyOwner(msg.sender) {
    storeNumber = storeNumber + 1;

    stores.push(Store({
      ownerAddress: msg.sender,
      storeNumber: storeNumber,
      name: name,
      city: city
    }));
  }

  function addProduct(uint storeNumberGiven, string memory name, string memory description, uint price, uint inventory) public
  verifyOwner(msg.sender) {
    productNumber = productNumber + 1;

    products.push(Product({
      ownerAddress: msg.sender,
      productNumber: productNumber,
      storeNumber: storeNumberGiven,
      name: name,
      description: description,
      price: price,
      inventory: inventory
    }));
  }

  function buyProduct(uint productNumberSelected) public payable {
    Product memory product;

    for (uint i = 0; i < products.length; i++) {
      if (products[i].productNumber == productNumberSelected) {
        product = products[i];
      }
    }

    product.ownerAddress.transfer(product.price);
    product.inventory = product.inventory - 1;
  }

  function getStoresLength() public view returns(uint) {
    return stores.length;
  }

  function getProductsLength() public view returns(uint) {
    return products.length;
  }
}
