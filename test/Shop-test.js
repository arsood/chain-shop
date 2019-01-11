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
});
