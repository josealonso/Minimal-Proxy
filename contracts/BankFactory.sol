//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./Bank.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BankFactory is Ownable {
    /*Variables*/
    struct BankTag {
        address bankAddress;
    }

    address public bankAddress;
    BankTag[] private _banks;

    event BankCreated(address newBankAddress, address owner);

    // constructor(address _bankAddress) {
    constructor() {
        // bankAddress = _bankAddress;
        bankAddress = address(new Bank());
    }

    function createBank(string memory name) public // uint256 interestRate,
    // uint256 originationFee,
    // uint256 collateralizationRatio,
    // uint256 liquidationPenalty,
    // uint256 period,
    // address payable oracleAddress
    {
        console.log("BankFactory.sol - Bank name: ");
        console.log(name);

        address clone = Clones.clone(bankAddress);
        Bank(clone).init(
            msg.sender,
            name,
            // interestRate,
            // originationFee,
            // collateralizationRatio,
            // liquidationPenalty,
            // period,
            owner()
            // oracleAddress
        );
        BankTag memory newBankTag = BankTag(clone);
        _banks.push(newBankTag);
        emit BankCreated(clone, msg.sender);
    }

    function getNumberOfBanks() public view returns (uint256) {
        return _banks.length;
    }

    function getBankAddressAtIndex(uint256 index)
        public
        view
        returns (address)
    {
        BankTag storage bank = _banks[index];
        return bank.bankAddress;
    }
}
