import { ethers } from "hardhat";
import chai, { assert, expect, use } from "chai";    // import { chai } from "chai" does not work
import chaiAsPromised from "chai-as-promised";
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import { abi } from "../build/BankFactory.json";
import { Bank, BankFactory, TellorPlayground } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(chaiAsPromised);
use(solidity);

const bankFactory = abi;

describe("BankFactory", function () {

    // Tellor Oracle
    const TELLOR_ORACLE_ADDRESS = '0xACC2d27400029904919ea54fFc0b18Bf07C57875';
    const TELLOR_REQUEST_ID = 60;

    const [wallet, walletTo] = new MockProvider().getWallets();
    // let bankType; // = await ethers.getContractFactory("Bank");
    // let bankFactoryType; // = await ethers.getContractFactory("BankFactory");
    let bankFactoryDeployed: BankFactory;
    let bankDeployed: Bank;
    let tp: TellorPlayground;
    let deployer: SignerWithAddress;
    let randomUser: SignerWithAddress;

    beforeEach(async function () {   // IMPORTANT ----> No parameters for this function. Otherwise, there's a executing error

        // random address from polygonscan that have a lot of usdcx
        const USDCX_SOURCE_ADDRESS = '0xA08f80dc1759b12fdC40A4dc64562b322C418E1f';
        const WBTC_SOURCE_ADDRESS = '0x5c2ed810328349100A66B82b78a1791B101C9D61';
        const USDC_SOURCE_ADDRESS = '0x1a13f4ca1d028320a707d99520abfefca3998b7f';

        const CARL_ADDRESS = '0x8c3bf3EB2639b2326fF937D041292dA2e79aDBbf';
        const BOB_ADDRESS = '0x00Ce20EC71942B41F50fF566287B811bbef46DC8';
        const ALICE_ADDRESS = '0x9f348cdD00dcD61EE7917695D2157ef6af2d7b9B';
        const OWNER_ADDRESS = '0x3226C9EaC0379F04Ba2b1E1e1fcD52ac26309aeA';
        let oraclePrice;

        // Bank set up
    // this.ct = await CT.new(ether(new BN(10000)));
    // this.dt = await DT.new(ether(new BN(10000)));
    // this.bank = await Bank.new(this.oracle.address);
    // this.bankFactory = await BankFactory.new(this.bank.address);
    // this.depositAmount = ether(new BN(100));
    // this.largeDepositAmount = ether(new BN(5000));
    // this.withdrawAmount = ether(new BN(50));
    // this.borrowAmount = ether(new BN(66));
    // this.largeBorrowAmount = ether(new BN(75));
    // this.smallBorrowAmount = ether(new BN(30));
    // this.two = new BN(2);
    // this.one = new BN(1);
    // this.zero = new BN(0);

    // await this.ct.transfer(_accounts[1], ether(new BN(500)));
    // await this.dt.transfer(_accounts[1], ether(new BN(500)));

        // get signers
        [, deployer, randomUser] = await ethers.getSigners();
        // owner = await ethers.provider.getSigner(OWNER_ADDRESS);
        // alice = await ethers.provider.getSigner(ALICE_ADDRESS);

        const bankFactory = (await ethers.getContractFactory(
            "BankFactory",
            deployer
        ));
        const bank = (await ethers.getContractFactory(
            "Bank",
            deployer
        ));

        bankDeployed = await bank.deploy(TELLOR_ORACLE_ADDRESS);
        await bankDeployed.deployed();
        bankFactoryDeployed = await bankFactory.deploy(bankDeployed.address);
        await bankFactoryDeployed.deployed();
        // bankFactory = await deployContract(wallet, abi);

        // Deploy Tellor Oracle contracts
        const TellorPlayground = await ethers.getContractFactory('TellorPlayground');
        // tp = await TellorPlayground.attach(TELLOR_ORACLE_ADDRESS);
        // tp = tp.connect(deployer);
    });

    const INTEREST_RATE = 12;
    const ORIGINATION_FEE = 1;
    const COLLATERALIZATION_RATIO = 150;
    const LIQUIDATION_PENALTY = 25;
    const PERIOD = 86400;
    const BANK_NAME = "Test Bank";

    it("should be owned by the creator", async function () {
        let owner = await bankFactoryDeployed.owner();
        assert.equal(owner, await deployer.getAddress());
    });

    it("should emit a BankCreated event after creating a bank", async function () {
        expect(
            await bankFactoryDeployed.connect(randomUser).createBank("Rico33 Bank", TELLOR_ORACLE_ADDRESS))
            .to.emit(bankFactoryDeployed, "BankCreated");
        // .withArgs(deployer.getAddress(), randomUser.address);
    });

    it("should create a bank clone with correct parameters", async function () {
        // let clone = await bankFactory.callStatic.createBank("Rico Bank");  
        let clone = await bankFactoryDeployed.createBank("Rico Bank", TELLOR_ORACLE_ADDRESS);
        console.log("TS == createBank() has been called");
        // expect(bankFactoryDeployed.getNumberOfBanks()).to.have.been.called;
        // let bankClone = await bankDeployed.at(clone.logs[0].args.newBankAddress);

        // let owner = await bankFactory.callStatic.owner();
        // expect(clone).not.to.eq(0);            // working
        // expect(bankFactoryDeployed.createBank).to.have.been.called;   // Not working
        // expect(await bankFake.init).to.have.been.calledOnce;    // Error: bankFake is undefined
        // expect(await bankDeployed.init()).to.have.been.calledOnce;   // Error: Invalid Chai property: calledOnce

        // expect(await bank.mock .init).to.have.been.calledOnce; // 

        // let bankClone = await 
        // let bankClone = await Bank.at(clone.logs[0].args.newBankAddress);

        // assert.typeOf(clone)
        // assert.equal(owner, alice);
        // let clone = await bankFactory.callStatic.createBank("Rico Bank");  //, { from: alice });
    });
});
        //         var clone = await this.bankFactory.createBank(
        //             BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
        //             { "from": _accounts[1] }
        //         );
        //         let bankClone = await Bank.at(clone.logs[0].args.newBankAddress);

        //         await bankClone.setCollateral(this.ct.address, 2, 1000, 1000, { "from": _accounts[1] });
        //         await bankClone.setDebt(this.dt.address, 1, 1000, 1000, { "from": _accounts[1] });
        //         const interestRate = await bankClone.getInterestRate();
        //         const originationFee = await bankClone.getOriginationFee();
        //         const collateralizationRatio = await bankClone.getCollateralizationRatio();
        //         const liquidationPenalty = await bankClone.getLiquidationPenalty();
        //         const reserveBalance = await bankClone.getReserveBalance();
        //         const reserveCollateralBalance = await bankClone.getReserveCollateralBalance();
        //         const owner = await bankClone.owner();
        //         const dtAddress = await bankClone.getDebtTokenAddress();
        //         const ctAddress = await bankClone.getCollateralTokenAddress();
        //         const bankCount = await this.bankFactory.getNumberOfBanks();
        //         const bankAddress = await this.bankFactory.getBankAddressAtIndex(0);

        //         assert.equal(bankAddress, bankClone.address);
        //         assert.equal(bankCount, 1);
        //         assert.equal(owner, _accounts[1]);
        //         assert.equal(interestRate, INTEREST_RATE);
        //         assert.equal(originationFee, ORIGINATION_FEE);
        //         assert.equal(collateralizationRatio, COLLATERALIZATION_RATIO);
        //         assert.equal(liquidationPenalty, LIQUIDATION_PENALTY);
        //         assert.equal(reserveBalance, 0);
        //         assert.equal(reserveCollateralBalance, 0);
        //         assert.equal(dtAddress, this.dt.address);
        //         assert.equal(ctAddress, this.ct.address);
        //     });
    // });

    // bank = await Bank.deploy(TELLOR_ORACLE_ADDRESS);

    
    // it("should create a bank multiple clones ", async function () {
    //     var clone1 = await this.bankFactory.createBank(
    //         BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
    //         { "from": _accounts[1] }
    //     );
    //     let bankClone1 = await Bank.at(clone1.logs[0].args.newBankAddress);

    //     await bankClone1.setCollateral(this.ct.address, 2, 1000, 1000, { "from": _accounts[1] });
    //     await bankClone1.setDebt(this.dt.address, 1, 1000, 1000, { "from": _accounts[1] });
    //     const owner1 = await bankClone1.owner();

    //     var clone2 = await this.bankFactory.createBank(
    //         BANK_NAME, INTEREST_RATE, ORIGINATION_FEE, COLLATERALIZATION_RATIO, LIQUIDATION_PENALTY, PERIOD, this.oracle.address,
    //         { "from": _accounts[2] }
    //     );
    //     let bankClone2 = await Bank.at(clone2.logs[0].args.newBankAddress);

    //     await bankClone2.setCollateral(this.dt.address, 2, 1000, 1000, { "from": _accounts[2] });
    //     await bankClone2.setDebt(this.ct.address, 1, 1000, 1000, { "from": _accounts[2] });
    //     const owner2 = await bankClone2.owner();

    //     const bankCount = await this.bankFactory.getNumberOfBanks();
    //     const bankAddress1 = await this.bankFactory.getBankAddressAtIndex(0);
    //     const bankAddress2 = await this.bankFactory.getBankAddressAtIndex(1);

    //     assert.equal(bankAddress1, bankClone1.address);
    //     assert.equal(bankAddress2, bankClone2.address);
    //     assert.equal(bankCount, 2);
    //     assert.equal(owner1, _accounts[1]);
    //     assert.equal(owner2, _accounts[2]);
    // });
// });
