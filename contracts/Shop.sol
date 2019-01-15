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
  address public contractOwner;
  uint private contractBalance;
  bool public emergencyStop;

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
    productNumber = 0;

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

    stores.push(Store({
      ownerAddress: msg.sender,
      storeNumber: storeNumber,
      name: name,
      city: city,
      earnings: 0,
      state: State.Active
    }));
  }

  /*
  @dev Deletes a store by its number assigned upon creation
  @param storeNumberGiven Store number provided
  */
  function deleteStore(uint storeNumberGiven) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    for (uint i = 0; i < stores.length; i++) {
      if (stores[i].storeNumber == storeNumberGiven) {
        delete stores[i];

        stores[i].state = State.Deleted;
      }
    }

    for (uint i = 0; i < products[storeNumberGiven].length; i++) {
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
  function saveStoreEdits(uint storeNumberGiven, string memory name, string memory city) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    for (uint i = 0; i < stores.length; i++) {
      if (stores[i].storeNumber == storeNumberGiven) {
        stores[i].name = name;
        stores[i].city = city;
      }
    }
  }

  /*
  @dev Adds a product to an existing store
  @param storeNumberGiven Number of store to add a product to
  @param name Name of the new product
  @param description Description of the new product
  @param price Price of the new product in Wei
  @param inventory Inventory number of the product
  */
  function addProduct(uint storeNumberGiven, string memory name, string memory description, uint price, uint inventory) public
  ensureNoEmergency()
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

  /*
  @dev Deletes a specific product via its associated store number and product number assined
  @param storeNumberGiven Number of store that the product is tied to
  @param productNumberGiven Product number assigned during creation
  */
  function deleteProduct(uint storeNumberGiven, uint productNumberGiven) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    for (uint i = 0; i < products[storeNumberGiven].length; i++) {
      if (products[storeNumberGiven][i].productNumber == productNumberGiven) {
        delete products[storeNumberGiven][i];

        products[storeNumberGiven][i].state = State.Deleted;
      }
    }
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
  function saveProductEdits(uint storeNumberGiven, uint productNumberGiven, string memory name, string memory description, uint price, uint inventory) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    for (uint i = 0; i < products[storeNumberGiven].length; i++) {
      if (products[storeNumberGiven][i].productNumber == productNumberGiven) {
        products[storeNumberGiven][i].name = name;
        products[storeNumberGiven][i].description = description;
        products[storeNumberGiven][i].price = price;
        products[storeNumberGiven][i].inventory = inventory;
      }
    }
  }

  /*
  @dev Allows a guest user to buy a specific product with Ether
  @param storeNumberGiven Store number that product is associated with
  @param productNumberGiven Specific number of product to be purchased
  */
  function buyProduct(uint storeNumberGiven, uint productNumberGiven) public payable
  ensureNoEmergency() {
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

  /*
  @dev Allows owner user to withdraw earnings for a specific store
  @param storeNumberGiven Store number for store to withdraw funds from
  */
  function withdrawEarnings(uint storeNumberGiven) public
  ensureNoEmergency()
  verifyOwner(msg.sender) {
    for (uint i = 0; i < stores.length; i++) {
      if (stores[i].storeNumber == storeNumberGiven) {
        require(contractBalance >= stores[i].earnings, "Contract must have enough balance to process this withdrawal");

        msg.sender.transfer(stores[i].earnings);
        stores[i].earnings = 0;
      }
    }
  }

  /*
  @dev Returns the length of stores array
  @return The length of the stores array
  */
  function getStoresLength() public view
  ensureNoEmergency()
  returns(uint) {
    return stores.length;
  }

  /*
  @dev Returns the length of the products array for a specific store
  @param storeNumberGiven Specific store number
  @return Length of products array associated with specific store
  */
  function getProductsLength(uint storeNumberGiven) public view
  ensureNoEmergency()
  returns(uint) {
    return products[storeNumberGiven].length;
  }
}
