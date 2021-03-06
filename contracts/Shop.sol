pragma solidity ^0.5.0;

import "../libraries/SafeMath.sol";

contract Shop {
  using SafeMath for uint256;

  enum UserType { Guest, Admin, Owner }
  enum State { Active, Deleted }

  struct User {
    string name;
    UserType userType;
  }

  struct Store {
    uint256 storeNumber;
    address ownerAddress;
    string name;
    string city;
    uint256 earnings;
    uint256 productNumber;
    State state;
  }

  struct Product {
    uint256 productNumber;
    string name;
    string description;
    uint256 price;
    uint256 inventory;
    State state;
  }

  // Contract owner state
  address public contractOwner;
  uint256 private contractBalance;
  bool public emergencyStop;

  // User state
  mapping (address => User) public users;

  // Store state
  uint256 public storeNumber;
  mapping (uint256 => Store) public stores;

  // Product state
  mapping (uint256 => mapping (uint256 => Product)) public products;

  modifier verifyAdmin(address userAddress) {
    require(users[userAddress].userType == UserType.Admin, "User must be an admin");
    _;
  }

  modifier verifyOwner(address ownerAddress) {
    require(users[ownerAddress].userType == UserType.Owner, "User must be an owner");
    _;
  }

  modifier ensureNoEmergency() {
    require(emergencyStop == false, "Contract is in emergency mode");
    _;
  }

  constructor() public {
    // Initializing state
    contractOwner = msg.sender;
    contractBalance = 0;
    emergencyStop = false;
    storeNumber = 0;

    // Add contract owner as an admin
    users[msg.sender] = User({
      name: "Super Admin",
      userType: UserType.Admin
    });
  }

  /*
  @dev Toggles the emergency stop boolean
  */
  function toggleEmergencyStop() public {
    require(msg.sender == contractOwner);

    if (emergencyStop == false) {
      emergencyStop = true;
    } else {
      emergencyStop = false;
    }
  }

  /*
  @dev Adds an admin tied to a user's address
  @param userAddress Address of user to add as admin
  @param name Name of admin user
  */
  function addAdmin(address userAddress, string memory name) public
  ensureNoEmergency()
  verifyAdmin(msg.sender) {
    users[userAddress] = User({
      name: name,
      userType: UserType.Admin
    });
  }

  /*
  @dev Adds an owner tied to a user's address
  @param userAddress Address of user to add as owner
  @param name Name of owner user
  */
  function addOwner(address userAddress, string memory name) public
  ensureNoEmergency()
  verifyAdmin(msg.sender) {
    users[userAddress] = User({
      name: name,
      userType: UserType.Owner
    });
  }

  /*
  @dev Adds a store tied to a specific owner
  @param name Name of the store
  @param city City of the store
  */
  function addStore(string memory name, string memory city) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    storeNumber = storeNumber + 1;

    stores[storeNumber] = Store({
      storeNumber: storeNumber,
      ownerAddress: msg.sender,
      name: name,
      city: city,
      earnings: 0,
      productNumber: 0,
      state: State.Active
    });
  }

  /*
  @dev Deletes a store by its number assigned upon creation
  @param storeNumberGiven Store number provided
  */
  function deleteStore(uint256 storeNumberGiven) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    delete stores[storeNumberGiven];

    stores[storeNumberGiven].state = State.Deleted;

    for (uint256 i = 1; i <= stores[storeNumberGiven].productNumber + 1; i++) {
      delete products[storeNumberGiven][i];

      products[storeNumberGiven][i].state = State.Deleted;
    }
  }

  /*
  @dev Saves the edits to a specific store using its store number
  @param storeNumberGiven Number of the store that was assigned on creation
  @param name Name of the store to edit
  @param city City of the store to edit
  */
  function saveStoreEdits(uint256 storeNumberGiven, string memory name, string memory city) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    stores[storeNumberGiven].name = name;
    stores[storeNumberGiven].city = city;
  }

  /*
  @dev Adds a product to an existing store
  @param storeNumberGiven Number of store to add a product to
  @param name Name of the new product
  @param description Description of the new product
  @param price Price of the new product in Wei
  @param inventory Inventory number of the product
  */
  function addProduct(uint256 storeNumberGiven, string memory name, string memory description, uint256 price, uint256 inventory) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    stores[storeNumberGiven].productNumber = stores[storeNumberGiven].productNumber + 1;

    products[storeNumberGiven][stores[storeNumberGiven].productNumber] = Product({
      productNumber: stores[storeNumberGiven].productNumber,
      name: name,
      description: description,
      price: price,
      inventory: inventory,
      state: State.Active
    });
  }

  /*
  @dev Deletes a specific product via its associated store number and product number assined
  @param storeNumberGiven Number of store that the product is tied to
  @param productNumberGiven Product number assigned during creation
  */
  function deleteProduct(uint256 storeNumberGiven, uint256 productNumberGiven) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    delete products[storeNumberGiven][productNumberGiven];

    products[storeNumberGiven][productNumberGiven].state = State.Deleted;
  }

  /*
  @dev Saves edits to a specific product
  @param storeNumberGiven Store number that the product is tied to
  @param productNumberGiven Product number assigned to specific product
  @param name Edited name of product
  @param description Edited description of product
  @param price Edited price of the product
  @param inventory Edited inventory of product
  */
  function saveProductEdits(uint256 storeNumberGiven, uint256 productNumberGiven, string memory name, string memory description, uint256 price, uint256 inventory) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    products[storeNumberGiven][productNumberGiven].name = name;
    products[storeNumberGiven][productNumberGiven].description = description;
    products[storeNumberGiven][productNumberGiven].price = price;
    products[storeNumberGiven][productNumberGiven].inventory = inventory;
  }

  /*
  @dev Allows a guest user to buy a specific product with Ether
  @param storeNumberGiven Store number that product is associated with
  @param productNumberGiven Specific number of product to be purchased
  */
  function buyProduct(uint256 storeNumberGiven, uint256 productNumberGiven) public payable
  ensureNoEmergency() {
    Product memory product = products[storeNumberGiven][productNumberGiven];

    require(product.inventory >= 1, "Store must have inventory of this product");

    products[storeNumberGiven][productNumberGiven].inventory = SafeMath.sub(product.inventory, 1);

    require(product.price == msg.value, "Product price and value sent must be equal");

    contractBalance = SafeMath.add(contractBalance, product.price);

    stores[storeNumberGiven].earnings = SafeMath.add(stores[storeNumberGiven].earnings, product.price);
  }

  /*
  @dev Allows owner user to withdraw earnings for a specific store
  @param storeNumberGiven Store number for store to withdraw funds from
  */
  function withdrawEarnings(uint256 storeNumberGiven) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    require(contractBalance >= stores[storeNumberGiven].earnings, "Contract must have enough balance to process this withdrawal");
    require(stores[storeNumberGiven].earnings > 0, "Store must have positive earnings");
    
    uint256 amountToWithdraw = stores[storeNumberGiven].earnings;

    stores[storeNumberGiven].earnings = 0;

    msg.sender.transfer(amountToWithdraw);
  }
}
