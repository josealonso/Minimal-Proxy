### Minimal Proxy Pattern

This pattern allows to create tiny clones of a given smart contract. This is achieved by delegating all the clones calls to the *main* contract.

### IMPORTANT

Although the contract clones are not upgradeable, the contracts inside **@openzeppelin/contracts-upgradeable** must be used. This is not done in this project, so **the Bank.sol contract is INCORRECT**.

I'm working on a different project that uses this pattern properly.


