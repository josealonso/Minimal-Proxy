import Web3 from "web3";

import { artifacts, ethers } from "hardhat";
import { assert, expect } from "chai";
import { Bank, BankFactory, TellorPlayground } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { EventFilter } from "ethers";

// chai.use(chaiAsPromised);  // This initialization is already handled by @nomiclabs/hardhat-waffle
const bankFactoryForTruffle = artifacts.require("BankFactory");
const bankForTruffle = artifacts.require("Bank");
const web3 = new Web3("ws://localhost:8545");

describe("BankFactory", function () {

    // Tellor Oracle
    const TELLOR_ORACLE_ADDRESS = '0xACC2d27400029904919ea54fFc0b18Bf07C57875';
    const TELLOR_REQUEST_ID = 60;

    let bankFactoryInstance: BankFactory;
    let bankInstance: Bank;
    let tp: TellorPlayground;
    let deployer: SignerWithAddress;
    let randomUser: SignerWithAddress;
    let accounts: any[];  // for web3js
    let eventSearched: EventFilter;

    before(async function () {

        // accounts = await web3.eth.getAccounts();    // for web3js

        // get signers
        [, deployer, randomUser] = await ethers.getSigners();

        const bankFactory = (await ethers.getContractFactory(
            "BankFactory",
            deployer
        ));
        const bank = (await ethers.getContractFactory(
            "Bank",
            deployer
        ));

        bankInstance = await bank.deploy(TELLOR_ORACLE_ADDRESS);
        await bankInstance.deployed();
        bankFactoryInstance = await bankFactory.deploy(bankInstance.address);
        await bankFactoryInstance.deployed();

        // Deploy Tellor Oracle contracts
        const TellorPlayground = await ethers.getContractFactory('TellorPlayground');
        tp = await TellorPlayground.attach(TELLOR_ORACLE_ADDRESS);
        tp = tp.connect(deployer);

        // this.emitter = await bankFactoryInstance.deployed().send();   // for web3js
    });

    describe("createBank", () => {
        it.skip("should be owned by the creator", async function () {
            let owner = await bankFactoryInstance.owner();
            assert.equal(owner, await deployer.getAddress());
        });

        it("should emit a BankCreated event", async function () {
            expect(
                await bankFactoryInstance.connect(randomUser).createBank("Rico33 Bank", TELLOR_ORACLE_ADDRESS))
                .to.emit(bankFactoryInstance, "BankCreated");
        });

        // For examples using the ethers Events API ---> https://github.com/ethers-io/ethers.js/issues/463
        it("should accept emitted events with correct bank address", async function () {
            const bankAddress = await bankFactoryInstance.getBankAddressAtIndex(0);
            const filter = bankFactoryInstance.filters.BankCreated();
            // beware about an error regarding the block number in mainnet forking
            const logs = bankFactoryInstance.queryFilter(filter, parseInt(`${process.env.FORK_BLOCK_NUMBER}`));
            (await logs).forEach((log) => {
                console.log("new bank: " + log.args.newBankAddress + "  owner: " + log.args.owner);
                console.log();
                assert.equal(log.args.newBankAddress, bankAddress);
            });


            it.skip("should create a bank clone with correct parameters", async function () {
                let clone = await bankFactoryInstance.createBank("Rico Bank", TELLOR_ORACLE_ADDRESS);
                console.log("TS == createBank() has been called");
            });
        });

        describe.skip("getNumberOfBanks", () => {
            it("should return the correct number", async () => {

            });
        });

        describe.skip("getBankAddressAtIndex", () => {
            it("should return the correct address", async () => {

            });
        });
    });
});

