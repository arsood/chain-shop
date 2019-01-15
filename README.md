# Chain Shop

This dApp is a shopping application in which there are three user types - guest, admin, and owner. Guests can shop at a variety of store fronts and check out using Ether, whereas admins can add owners and other admins. Owners can add store fronts and products for guests to purchase.

The purpose of this application is to practice using the Ethereum set of tools to build a decentralized application. This application can be deployed on the local development blockchain, and can also be found on the Ropsten network here: 0xa2a379fd570A02E86452a7E5c57daD67DDd85592.

## Setup

1. Start Ganache on port 8545.
2. Migrate contracts: `truffle migrate --reset --all`
3. `cd client && npm install`
4. `npm start`

## Testing Flow

The easiest way to test the flow is the following:

1. Deploy the contract with account 1
2. Add account 2 as an admin
3. Add account 3 as an owner
4. Switch to account 3 and add a store and then add a product for that store
5. Switch to account 4 and attempt a purchase
6. Switch back to account 3 and withdraw earnings from the transaction
7. Use account 3 to test updating / deleting stores and products

## Design Pattern Decisions

To see information on design pattern decisions for this application, please refer to the [documentation here](design_pattern_decisions.md).

## Avoiding Common Attacks

To see information on how this application has avoided common attacks, please refer to the [documentation here](avoiding_common_attacks.md).
