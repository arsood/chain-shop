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
    string name;
    string description;
    uint price;
    uint inventory;
  }

  // Contract owner state
  address payable public contractOwner;
  uint public contractOwnerBalance;

  // User state
  mapping (address => User) public users;

  // Store state
  uint public storeNumber;
  Store[] public stores;

  // Product state
  mapping (uint => Product[]) public products;

  modifier verifyAdmin(address userAddress) {
    require(users[userAddress].userType == UserType.Admin, "User must be an admin");
    _;
  }

  modifier verifyOwner(address ownerAddress) {
    require(users[ownerAddress].userType == UserType.Owner, "User must be an owner");
    _;
  }

  constructor() public payable {
    contractOwner = msg.sender;
    contractOwnerBalance = 0;

    // Add contract owner as an admin
    users[msg.sender] = User({
      name: "Super Admin",
      userType: UserType.Admin
    });

    // Initializing state
    storeNumber = 0;
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
    products[storeNumberGiven].push(Product({
      name: name,
      description: description,
      price: price,
      inventory: inventory
    }));
  }

  function buyProduct(uint storeNumberGiven, uint productIndex) public payable {
    Product memory product = products[storeNumberGiven][productIndex];

    contractOwner.transfer(product.price);
    contractOwnerBalance += product.price;
    product.inventory = product.inventory - 1;
  }

  function getStoresLength() public view returns(uint) {
    return stores.length;
  }

  function getProductsLength(uint storeNumberGiven) public view returns(uint) {
    return products[storeNumberGiven].length;
  }
}
