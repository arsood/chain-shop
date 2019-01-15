# Design Pattern Decisions

This document is a brief outline of the design decisions made throughout this project.

## Withdrawal Pattern

The withdrawal design pattern is meant to separate contract accounting logic from transfer logic. Effectively this allows the accounting logic to run in isolation and run through all of its checks before the transfer functionality even executes.

This pattern can be observed in the following functions from the Shop contract:

- buyProduct
- withdrawEarnings

## Restricting Access

Restricting access is a means by which we limit the access to certain functionality through constructs such as function modifiers. We generally do this to prevent unauthorized use of functionality meant for a specific use case.

This pattern can be observed in the following functions from the Shop contract:

- toggleEmergencyStop
- addAdmin
- addOwner
- addStore
- deleteStore
- saveStoreEdits
- addProduct
- deleteProduct
- saveProductEdits
- withdrawEarnings

## Emergency Stop / Circuit Breaker

This pattern allows the contract's functionality to be limited by the contract owner by calling a function that toggles a boolean that is then checked throughout the rest of the functions. The purpose of this is to prevent the contract from executing further if the contract owner decides that there is an issue with its execution.

This pattern can be found in every function in the contract with the ensureNoEmergency modifier. It is toggled through the toggleEmergencyStop function.
