pragma solidity ^0.5.0;

contract Shop {
  enum UserType { Guest, Admin, Owner }
  enum State { Active, Deleted }

  struct User {
    string name;
    UserType userType;
  }

  struct Store {
    address ownerAddress;
    uint storeNumber;
    string name;
    string city;
    uint earnings;
    State state;
  }

  struct Product {
    uint productNumber;
    string name;
    string description;
    uint price;
    uint inventory;
    State state;
  }

  // Contract owner state
  uint private contractBalance;

  // User state
  mapping (address => User) public users;

  // Store state
  uint public storeNumber;
  Store[] public stores;

  // Product state
  uint public productNumber;
  mapping (uint => Product[]) public products;

  modifier verifyAdmin(address userAddress) {
    require(users[userAddress].userType == UserType.Admin, "User must be an admin");
    _;
  }

  modifier verifyOwner(address ownerAddress) {
    require(users[ownerAddress].userType == UserType.Owner, "User must be an owner");
    _;
  }

  constructor() public {
    // Initializing state
    contractBalance = 0;
    storeNumber = 0;
    productNumber = 0;

    // Add contract owner as an admin
    users[msg.sender] = User({
      name: "Super Admin",
      userType: UserType.Admin
    });
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
      city: city,
      earnings: 0,
      state: State.Active
    }));
  }

  function addProduct(uint storeNumberGiven, string memory name, string memory description, uint price, uint inventory) public
  verifyOwner(msg.sender) {
    productNumber = productNumber + 1;

    products[storeNumberGiven].push(Product({
      productNumber: productNumber,
      name: name,
      description: description,
      price: price,
      inventory: inventory,
      state: State.Active
    }));
  }

  function deleteProduct(uint storeNumberGiven, uint productNumberGiven) public
  verifyOwner(msg.sender) {
    for (uint i = 0; i < products[storeNumberGiven].length; i++) {
      if (products[storeNumberGiven][i].productNumber == productNumberGiven) {
        delete products[storeNumberGiven][i];

        products[storeNumberGiven][i].state = State.Deleted;
      }
    }
  }

  function buyProduct(uint storeNumberGiven, uint productNumberGiven) public payable {
    Product memory product;

    for (uint i = 0; i < products[storeNumberGiven].length; i++) {
      if (products[storeNumberGiven][i].productNumber == productNumberGiven) {
        product = products[storeNumberGiven][i];

        require(product.inventory >= 1, "Store must have inventory of this product");

        products[storeNumberGiven][i].inventory = products[storeNumberGiven][i].inventory - 1;
      }
    }

    require(product.price == msg.value, "Product price and value sent must be equal");

    contractBalance += product.price;

    for (uint i = 0; i < stores.length; i++) {
      if (stores[i].storeNumber == storeNumberGiven) {
        stores[i].earnings += product.price;
      }
    }
  }

  function withdrawEarnings(uint storeNumberGiven) public {
    for (uint i = 0; i < stores.length; i++) {
      if (stores[i].storeNumber == storeNumberGiven) {
        require(contractBalance >= stores[i].earnings, "Contract must have enough balance to process this withdrawal");

        msg.sender.transfer(stores[i].earnings);
        stores[i].earnings = 0;
      }
    }
  }

  function getStoresLength() public view returns(uint) {
    return stores.length;
  }

  function getProductsLength(uint storeNumberGiven) public view returns(uint) {
    return products[storeNumberGiven].length;
  }
}
