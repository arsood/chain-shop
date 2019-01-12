const Shop = artifacts.require("./Shop.sol");

contract("Shop", accounts => {
  it("Should create a new admin type user", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .addAdmin(accounts[1], "Admin Name", { from: accounts[0] });

    const newAdmin = await shopInstance.users(accounts[0]);

    expect(parseInt(newAdmin.userType)).to.equal(1);
  });

  it("Should create a new owner type user", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .addOwner(accounts[2], "Owner Name", { from: accounts[0] });

    const newOwner = await shopInstance.users(accounts[2]);

    expect(parseInt(newOwner.userType)).to.equal(2);
  });

  it("Should add a store for an owner type", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .addStore("Test Store", "San Francisco, CA", { from: accounts[2] });

    const store = await shopInstance.stores(0);

    expect(parseInt(store.storeNumber)).to.equal(1);
    expect(store.ownerAddress).to.equal(accounts[2]);
  });

  it("Should add a product for a specific store", async () => {
    const shopInstance = await Shop.deployed();

    await shopInstance
    .addProduct(1, "Sandwich", "It is good", 5, 10, { from: accounts[2] });

    const product = await shopInstance.products(1, 0);

    expect(product.name).to.equal("Sandwich");
    expect(parseInt(product.price)).to.equal(5);
  });
});
