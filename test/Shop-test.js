const Shop = artifacts.require("./Shop.sol");

contract("Shop", accounts => {
  // This test checks to make sure we can create an admin type user
  // This test was written to ensure user creation of a specific type is possible
  it("Should create a new admin type user", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .addAdmin(accounts[1], "Admin Name", { from: accounts[0] });

    const newAdmin = await shopInstance.users(accounts[0]);

    expect(parseInt(newAdmin.userType)).to.equal(1);
  });

  // This test checks to make sure we can create an owner type user
  // This test was written to ensure user creation of a specific type is possible
  it("Should create a new owner type user", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .addOwner(accounts[2], "Owner Name", { from: accounts[0] });

    const newOwner = await shopInstance.users(accounts[2]);

    expect(parseInt(newOwner.userType)).to.equal(2);
  });

  // This test checks that a store can be added for a specific owner
  // This test was written to ensure that a store can be created that is tied directly to an owner user
  it("Should add a store for an owner type", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .addStore("Test Store", "San Francisco, CA", { from: accounts[2] });

    const store = await shopInstance.stores(1);

    expect(parseInt(store.storeNumber)).to.equal(1);
    expect(store.ownerAddress).to.equal(accounts[2]);
  });

  // This test checks that a store's name and city can be updated
  // This test was written to ensure that the edit functionality works properly
  it("Should edit a specific store", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .saveStoreEdits(1, "New Name Here", "New City Here", { from: accounts[2] });

    const store = await shopInstance.stores(1);

    expect(store.name).to.equal("New Name Here");
    expect(store.city).to.equal("New City Here");
  });

  // This test checks to see if we can add a product to a specific store
  // This test was written to ensure that products can be associated to stores successfully
  it("Should add a product for a specific store", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .addProduct(1, "Sandwich", "It is good", 5, 10, { from: accounts[2] });

    const product = await shopInstance.products(1, 0);

    expect(product.name).to.equal("Sandwich");
    expect(parseInt(product.price)).to.equal(5);
  });

  // This test checks the capability to purchase a product using Ether
  // This test was written to ensure that guests can send Ether to the contract which will be used to purchase a specific inventory item
  it("Should buy a product for a specific store", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .buyProduct(1, 1, { from: accounts[3], value: "5" });

    const product = await shopInstance.products(1, 0);

    expect(parseInt(product.inventory)).to.equal(9);
  });

  // This test checks the ability to delete a store with its associated products
  // This test was written to make sure stores can be deleted and associated products are also removed
  it("Should delete a store with its products", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .deleteStore(1, { from: accounts[2] });

    const product = await shopInstance.products(1, 0);

    expect(parseInt(product.state)).to.equal(1);
  }); 
});
