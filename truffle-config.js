const HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = require("./mnemonic").MNEMONIC;
const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/270cf01b7a034cbe97af3daf32b6b39f")
      },
      network_id: 3,
      gas: 4000000
    }
  }
};
