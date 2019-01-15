# Avoiding Common Attacks

This document outlines a couple common attacks and how the contract code has attempted to avoid them.

## Race Conditions / Re-entrancy

If a function is called rapidly many times, it is possible to execute pieces of code such as transfers multiple times before the rest of the code executes. For example, in my Shop contract in the withdrawEarnings function I set the earnings to 0 for the store during the withdrawal process. I have set the earnings to 0 before executing the transfer to ensure that only the amount of Ether the store has legitimately earned will be sent to the owner's address.

```solidity
stores[i].earnings = 0;

msg.sender.transfer(stores[i].earnings);
```

## Integer Overflows / Underflows

Integer overflows / underflows happen when uint's are incremented or decremented past their limits. In the case of an overflow, the integer will return back to 0. In the case of an underflow, the integer will become its maximum possible value.

In order to protect against this, the Shop contract makes use of SafeMath, which is a library to help prevent this situation.

```solidity
contractBalance = SafeMath.add(contractBalance, product.price);
```
