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

  // User state
  mapping (address => User) public users;

  // Store state
  uint public storeNumber;
  Store[] public stores;

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

  function getStoresLength() public returns(uint) {
    return stores.length;
  }
}
