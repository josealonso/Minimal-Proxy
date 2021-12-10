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

    // string public constant ORACLE_CONTRACT = "0xACC2d27400029904919ea54fFc0b18Bf07C57875";
    // address oracleAddress = address(ORACLE_CONTRACT);
    // address public immutable bankImplementation;
    address public immutable bankAddress;
    BankTag[] private _banks;

    event BankCreated(address newBankAddress, address owner);

    constructor(address _bankAddress) {
        bankAddress = _bankAddress;
        // bankImplementation = address(new Bank(ORACLE_CONTRACT));
    }

    function createBank(
        string memory name,
        // uint256 originationFee,
        // uint256 collateralizationRatio,
        // uint256 liquidationPenalty,
        // uint256 period,
        address payable oracleAddress
    ) public returns (address) {
        console.log("BankFactory.sol - Bank name: ");
        console.log(name);

        // address clone = Clones.clone(bankImplementation);
        address clone = Clones.clone(bankAddress);
        Bank(clone).init(
            msg.sender,
            name,
            // interestRate,
            // originationFee,
            // collateralizationRatio,
            // liquidationPenalty,
            // period,
            owner(),
            oracleAddress
        );
        BankTag memory newBankTag = BankTag(clone);
        _banks.push(newBankTag);
        emit BankCreated(clone, msg.sender);
        return clone;
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

/* OpenZeppelin example for the Clone Factory pattern

contract FactoryClone {
    address immutable tokenImplementation;

    constructor() public {
        tokenImplementation = address(new ERC20PresetFixedSupplyUpgradeable());
    }

    function createToken(string calldata name, string calldata symbol, uint256 initialSupply) external returns (address) {
        address clone = Clones.clone(tokenImplementation);
        ERC20PresetFixedSupplyUpgradeable(clone).initialize(name, symbol, initialSupply, msg.sender);
        return clone;
    }
}
*/
