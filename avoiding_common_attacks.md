# Avoiding Common Attacks

This document outlines a couple common attacks and how the contract code has attempted to avoid them.

## Race Conditions / Re-entrancy

If a function is called rapidly many times, it is possible to execute pieces of code such as transfers multiple times before the rest of the code executes. For example, in my Shop contract in the withdrawEarnings function I set the earnings to 0 for the store during the withdrawal process. I have set the earnings to 0 before executing the transfer to ensure that only the amount of Ether the store has legitimately earned will be sent to the owner's address.

```solidity
uint256 amountToWithdraw = stores[storeNumberGiven].earnings;

stores[storeNumberGiven].earnings = 0;

msg.sender.transfer(amountToWithdraw);
```

## Integer Overflows / Underflows

Integer overflows / underflows happen when uint's are incremented or decremented past their limits. In the case of an overflow, the integer will return back to 0. In the case of an underflow, the integer will become its maximum possible value.

In order to protect against this, the Shop contract makes use of SafeMath, which is a library to help prevent this situation.

```solidity
contractBalance = SafeMath.add(contractBalance, product.price);
```

## Forcibly Sending Ether

It is possible to send Ether to a contract without triggering the fallback function. As a result, the contract balance can be considered more than 0 at certain points. It is important as a result to not write functionality that directly relies on the contract balance.

In order to protect against malicious injections of Ether, the Shop contract relies on balance as part of the contract state that is updated only when a payment is made to buy a product. The contractBalance storage variable is updated on purchase and withdrawal using SafeMath, and the contract does not rely on `this.balance` at any point.
