// const { inputToConfig } = require("@ethereum-waffle/compiler");
// const chai = require("chai");
// const { solidity } = require("ethereum-waffle");
// const { BigNumber } = require("ethers");
// chai.use(solidity);
// const expect = chai.expect;
// const { ethers } = require("hardhat");

// describe("Vesting Token Tests", function () {
//   let deployer;
//   let adds;
//   let secondAccount;
//   let ERC20Account;
//   let VestingContract;
//   let vestingAmount = 10000000;
//   const r = 0;
//   const cliff = 0;
//   const duration = 100;
//   const interval = 50;
//   const isRevokable = true;
//   const amount = 1000;
//   const tge = 10;
//   const amts = [100, 200, 300, 50, 15, 40, 100, 50];
//   const cliffs = [
//     60 * 60 * 24 * 30 * 2,
//     0,
//     60 * 60 * 24 * 30 * 6,
//     0,
//     60 * 60 * 24 * 30 * 6,
//     0,
//     0,
//     60 * 60 * 24 * 30 * 6,
//   ];
//   const tges = [0, 5, 0, 25, 0, 14, 50, 0];
//   const durations = [
//     60 * 60 * 24 * 30 * 24,
//     60 * 60 * 24 * 30 * 18,
//     60 * 60 * 24 * 30 * 18,
//     60 * 60 * 24 * 30 * 24,
//     60 * 60 * 24 * 30 * 18, 
//     60 * 60 * 24 * 30 * 24,
//     60 * 60 * 24 * 30 * 2, 
//     60 * 60 * 24 * 30 * 14,
//   ];
//   const intervals = [
//     60 * 60 * 24 * 30,
//     60 * 60 * 24 * 30,
//     60 * 60 * 24 * 30,
//     60 * 60 * 24 * 30,
//     60 * 60 * 24 * 30,
//     60 * 60 * 24 * 30,
//     60 * 60 * 24 * 30 * 1, //prev 2 now 1 ??
//     60 * 60 * 24 * 30 * 3,
//   ];

//   beforeEach(async () => {
//     [deployer, ERC20Account, secondAccount, ...adds] =
//       await ethers.getSigners();
//     const ERC20Token = await ethers.getContractFactory("TimeToken");
//     ERC20TokenContract = await ERC20Token.connect(ERC20Account).deploy();
//     ERC20TokenContract = await ERC20TokenContract.deployed();
//     const vesting = await ethers.getContractFactory("Vesting");
//     VestingContract = await vesting
//       .connect(deployer)
//       .deploy(ERC20TokenContract.address);
//     VestingContract = await VestingContract.deployed();
//   });

//   const TransferTokensAllocateTokensAddBeneficiary = async () => {
//     await ERC20TokenContract.connect(ERC20Account).transfer(
//       VestingContract.address,
//       vestingAmount
//     );
//     await VestingContract.connect(deployer).allocateTokensForRoles();
//     await VestingContract.connect(deployer).addBeneficiary(
//       secondAccount.address,
//       r,
//       amount,
//       cliffs[0],
//       durations[0],
//       intervals[0],
//       isRevokable
//     );
//   };

//   describe("allocateTokensForRoles test ", function () {
//       it("Only owner can call this function", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await expect(VestingContract.connect(secondAccount).allocateTokensForRoles()).to.be.revertedWith("Ownable: caller is not the owner");
//       });
//       it("Should first allocate token to contract", async () => {
//           await expect(VestingContract.connect(deployer).allocateTokensForRoles()).to.be.revertedWith("No tokens allocated to the contract");
//       });
//       it("Should allocate proper tokens for roles", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           // let CompanyReserve = (vestingAmount * 15) / 100;
//           // let EquityInvestor = (vestingAmount * 3) / 100;
//           // let Team = (vestingAmount * 10) / 100;
//           // let ExchageListingAndLiquidity = (vestingAmount * 25) / 100;
//           // let Ecosystem = (vestingAmount * 10) / 100;
//           // let StakingAndReward = (vestingAmount * 15) / 100;
//           // let AirOrBurn = (vestingAmount * 2) / 100;
//           // let AdvisersAndPartnership = (vestingAmount * 10) / 100;
//           // expect(await VestingContract.totalTokensForRole(0)).to.equal(CompanyReserve);
//           // expect(await VestingContract.totalTokensForRole(1)).to.equal(EquityInvestor);
//           // expect(await VestingContract.totalTokensForRole(2)).to.equal(Team);
//           // expect(await VestingContract.totalTokensForRole(3)).to.equal(ExchageListingAndLiquidity);
//           // expect(await VestingContract.totalTokensForRole(4)).to.equal(Ecosystem);
//           // expect(await VestingContract.totalTokensForRole(5)).to.equal(StakingAndReward);
//           // expect(await VestingContract.totalTokensForRole(6)).to.equal(AirOrBurn);
//           // expect(await VestingContract.totalTokensForRole(7)).to.equal(AdvisersAndPartnership);

//       });

//   });

//   const addAllBeneficiariesRoles = async (addrs) => {
//       for (let i = 0; i < 15; i++) {

//           if (i < 5) {
//               await await VestingContract.connect(deployer).addBeneficiary(
//                   adds[i].address,
//                   r,
//                   amts[0],
//                   cliffs[0],
//                   durations[0],
//                   intervals[0],
//                   isRevokable
//               );
//           } else if (i < 10) {
//               await VestingContract.connect(deployer).addBeneficiary(
//                   adds[i].address,
//                   1,
//                   amts[1],
//                   cliffs[1],
//                   durations[1],
//                   intervals[1],
//                   isRevokable
//               );
//           } else {
//               await VestingContract.connect(deployer).addBeneficiary(
//                   adds[i].address,
//                   2,
//                   amts[2],
//                   cliffs[2],
//                   durations[2],
//                   intervals[2],
//                   isRevokable
//               );
//           }
//       }
//   };

//   describe("addBeneficiary test ", function () {
//       it("Only owner can call this function", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();

//           await expect(VestingContract.connect(secondAccount).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           )).to.be.revertedWith("Ownable: caller is not the owner");

//       });
//       // it("Owner Should not be benificiary", async () => {
//       //     await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//       //     expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//       //     await VestingContract.connect(deployer).allocateTokensForRoles();

//       //     await expect(VestingContract.connect(deployer).addBeneficiary(
//       //         deployer.address,
//       //         r,
//       //         amount,
//       //         cliff,
//       //         duration,
//       //         tge,
//       //         interval,
//       //         isRevokable
//       //     )).to.be.revertedWith("Owner cannot be a benificiary");

//       // });
//       it("Should not add a Beneficiary of 0 address", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();

//           await expect(VestingContract.connect(deployer).addBeneficiary(
//               "0x0000000000000000000000000000000000000000",
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           )).to.be.revertedWith("Cannot add a Beneficiary of 0 address");

//       });

//       it("amount should be greater than 0", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await expect(VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               0,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           )).to.be.revertedWith("amount should be greater than 0");

//       });
//       it("should not add Beneficiary twise", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           );
//           await expect(VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           )).to.be.revertedWith("Beneficiary already exist in the role");

//       });

//       it("amount should be greater than reserve token for this role", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           let CompanyReserve = (vestingAmount * 15) / 100;
//           await expect(VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               CompanyReserve + 10,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           )).to.be.revertedWith("Not enough Tokens for this role");

//       });
//       it("add Beneficiary ", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           // beforeTotalAmount0 = await VestingContract.totalTokensForRole(0);
//           // beforeTotalAmount1 = await VestingContract.totalTokensForRole(1);
//           // beforeTotalAmount2 = await VestingContract.totalTokensForRole(2);

//           await addAllBeneficiariesRoles(adds);
//           // expect(await VestingContract.totalTokensForRole(0)).to.be.equal(beforeTotalAmount0 - (amts[0] * 5));
//           // expect(await VestingContract.totalTokensForRole(1)).to.be.equal(beforeTotalAmount1 - (amts[1] * 5));
//           // expect(await VestingContract.totalTokensForRole(2)).to.be.equal(beforeTotalAmount2 - (amts[2] * 5));

//           // TGT amount transfer check
//           const tgeAmount0 = (amts[0] * tges[0]) / 100;
//           const tgeAmount1 = (amts[1] * tges[1]) / 100;
//           const tgeAmount2 = (amts[2] * tges[2]) / 100;
//           // expect(await ERC20TokenContract.balanceOf(adds[0].address)).to.be.equal(tgeAmount0);
//           // expect(await ERC20TokenContract.balanceOf(adds[5].address)).to.be.equal(tgeAmount1);
//           // expect(await ERC20TokenContract.balanceOf(adds[10].address)).to.be.equal(tgeAmount2);

//           //count of benificiary role (should be 5 because we add 5 per roles)
//           // expect(await VestingContract.totalbeneficiariesInRole(0)).to.be.equal(5);
//           // expect(await VestingContract.totalbeneficiariesInRole(1)).to.be.equal(5);
//           // expect(await VestingContract.totalbeneficiariesInRole(2)).to.be.equal(5);

//           // chech for the benificiry

//           let ID=await VestingContract.getId(adds[0].address,0);
//           expect((await VestingContract.beneficiaries(ID))[0]).to.be.equal(adds[0].address);
//           expect((await VestingContract.beneficiaries(ID))[1]).to.be.equal(0);
//           expect((await VestingContract.beneficiaries(ID))[2]).to.be.equal(amts[0]-tgeAmount0);
//           expect((await VestingContract.beneficiaries(ID))[4]).to.be.equal(0);
//           expect((await VestingContract.beneficiaries(ID))[6]).to.be.equal(cliffs[0]);
//           expect((await VestingContract.beneficiaries(ID))[7]).to.be.equal(durations[0]);
//           expect((await VestingContract.beneficiaries(ID))[8]).to.be.equal(intervals[0]);
//           expect((await VestingContract.beneficiaries(ID))[9]).to.be.equal(isRevokable);
//           expect((await VestingContract.beneficiaries(ID))[10]).to.be.equal(false);

//           ID=await VestingContract.getId(adds[5].address,1);
//           expect((await VestingContract.beneficiaries(ID))[0]).to.be.equal(adds[5].address);
//           expect((await VestingContract.beneficiaries(ID))[1]).to.be.equal(1);
//           expect((await VestingContract.beneficiaries(ID))[2]).to.be.equal(amts[1]-tgeAmount1);
//           expect((await VestingContract.beneficiaries(ID))[4]).to.be.equal(0);
//           expect((await VestingContract.beneficiaries(ID))[6]).to.be.equal(cliffs[1]);
//           expect((await VestingContract.beneficiaries(ID))[7]).to.be.equal(durations[1]);
//           expect((await VestingContract.beneficiaries(ID))[8]).to.be.equal(intervals[1]);
//           expect((await VestingContract.beneficiaries(ID))[9]).to.be.equal(isRevokable);
//           expect((await VestingContract.beneficiaries(ID))[10]).to.be.equal(false);

//           ID=await VestingContract.getId(adds[10].address,2);
//           expect((await VestingContract.beneficiaries(ID))[0]).to.be.equal(adds[10].address);
//           expect((await VestingContract.beneficiaries(ID))[1]).to.be.equal(2);
//           expect((await VestingContract.beneficiaries(ID))[2]).to.be.equal(amts[2]-tgeAmount2);
//           expect((await VestingContract.beneficiaries(ID))[4]).to.be.equal(0);
//           expect((await VestingContract.beneficiaries(ID))[6]).to.be.equal(cliffs[2]);
//           expect((await VestingContract.beneficiaries(ID))[7]).to.be.equal(durations[2]);
//           expect((await VestingContract.beneficiaries(ID))[8]).to.be.equal(intervals[2]);
//           expect((await VestingContract.beneficiaries(ID))[9]).to.be.equal(isRevokable);
//           expect((await VestingContract.beneficiaries(ID))[10]).to.be.equal(false);

//       });

//   });

//   describe("revokeBenificiary test ", function () {
//       it("Only owner can call this function", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           );
//           await expect(VestingContract.connect(secondAccount).revokeBeneficiary(secondAccount.address, 0)).to.be.revertedWith("Ownable: caller is not the owner");
//       });
//       it("should not call with non exist beneficiary", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await expect(VestingContract.connect(deployer).revokeBeneficiary(secondAccount.address, 0)).to.be.revertedWith("Beneficiary is not exist in the role");
//       });
//       it("Benificiriy should be revokable", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               false
//           );
//           await expect(VestingContract.connect(deployer).revokeBeneficiary(secondAccount.address, 0)).to.be.revertedWith("beneficiary is not revokable");
//       });
//       it("Benificiriy should be revoke", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           );
//           await VestingContract.connect(deployer).revokeBeneficiary(secondAccount.address, 0);
//           let ID=await VestingContract.getId(secondAccount.address,r);
//           expect((await VestingContract.beneficiaries(ID))[9]).to.be.equal(true);
//       });

//   });

//   describe("withdraw test ", function () {
//       it("should not call with non exist beneficiary", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await expect(VestingContract.connect(secondAccount).withdraw(secondAccount.address, 0, 100)).to.be.revertedWith("Beneficiary is not exist in the role");
//       });

//       it("Admin or beneficiary required", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           );
//           await expect(VestingContract.connect(adds[0]).withdraw(secondAccount.address, 0, 100)).to.be.revertedWith("Admin or beneficiary required");
//       });

//       it("Withdrawable should be greater than 0", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           );
//           await expect(VestingContract.connect(secondAccount).withdraw(secondAccount.address, 0, 0)).to.be.revertedWith("Withdrawable should be greater than 0");
//       });

//       it("Token released amount is less", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               r,
//               amount,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           );
//           await expect(VestingContract.connect(secondAccount).withdraw(secondAccount.address, 0, 10000)).to.be.revertedWith("Token released amount is less");
//       });
//       it("Can withdrow TGE amount", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               1,
//               1000,
//               cliff,
//               duration,
//               interval,
//               isRevokable
//           );
//           const tgeAmount1 = (1000 * tges[1]) / 100;
//           await VestingContract.connect(secondAccount).withdraw(secondAccount.address, 1, tgeAmount1);
//           expect(await ERC20TokenContract.balanceOf(secondAccount.address)).to.be.equal(tgeAmount1);
//       });
//       it("Can withdrow TGE and release token amount", async () => {
//           await ERC20TokenContract.connect(ERC20Account).transfer(VestingContract.address, vestingAmount);
//           expect(await ERC20TokenContract.balanceOf(VestingContract.address)).to.equal(vestingAmount);
//           await VestingContract.connect(deployer).allocateTokensForRoles();
//           await VestingContract.connect(deployer).addBeneficiary(
//               secondAccount.address,
//               0,
//               100000,
//               cliffs[0],
//               durations[0],
//               intervals[0],
//               isRevokable
//           );
//           await ethers.provider.send("evm_increaseTime", [cliffs[0]+intervals[0]] );
//           await ethers.provider.send("evm_mine");
//           await VestingContract.connect(deployer).release(secondAccount.address, 0);
//           let getTokenWithdrawable=await VestingContract.getTokenWithdrawable(secondAccount.address,0);
//           console.log(getTokenWithdrawable)
//           let CompanyReserveReleseForMonth = Math.floor(100000/24);   //why 100000??
//           console.log(CompanyReserveReleseForMonth)
//           await VestingContract.connect(secondAccount).withdraw(secondAccount.address, 0, CompanyReserveReleseForMonth);
//       });

//   });
//   describe("Release Function Test ", function () {
//     it("Admin or beneficiary required", async () => {
//       //above function added beneficiary to 0 role
//       await TransferTokensAllocateTokensAddBeneficiary();
//       await expect(
//         VestingContract.connect(adds[0]).release(secondAccount.address, 0)
//       ).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("should not call with non exist beneficiary", async () => {
//       //above function added beneficiary to 0 role
//       await TransferTokensAllocateTokensAddBeneficiary();

//       await expect(
//         VestingContract.connect(deployer).release(ERC20Account.address, 0)
//       ).to.be.revertedWith("Beneficiary is not exist in the role");
//     });

//     it("Cannot Release Tokens For Revoked Beneficiary", async () => {
//       //above function added beneficiary to 0 role
//       await TransferTokensAllocateTokensAddBeneficiary();

//       //Second address is added As a beneficiary for role 0
//       //revoke the beneficiary
//       await VestingContract.revokeBeneficiary(secondAccount.address, 0);

//       //Now try to Release Tokens For second address
//       await expect(
//         VestingContract.release(secondAccount.address, 0)
//       ).to.be.revertedWith("beneficiary is revoked");
//     });

//     it("Should Revert if released amount is 0", async () => {
//       //above function added beneficiary to 0 role
//       await TransferTokensAllocateTokensAddBeneficiary();

//       //second address added as a beneficiary with role 0 ,cliff = 2 months ,duration = 24 months,TGE = 0
//       //As the TGE is 0 so no tokens will be allocated at the time of adding Beneficiary
//       //so If we try to release with in the cliff period the release amount will be 0

//       //now try to release
//       await expect(
//         VestingContract.release(secondAccount.address, 0)
//       ).to.be.revertedWith("No Tokens released yet,try after some time");
//     });

    
//     it("Should Release correct token amount for Company reserve", async () => {
//       //above function added beneficiary to 0 role
//       await TransferTokensAllocateTokensAddBeneficiary();

//       //second address added as a beneficiary with role 0 ,cliff = 2 months ,duration = 24 months,TGE = 0
//       //Amount for vesting is 1000
//       //So after cliff period and 1st interval (interval 1 month)
//       //contract should release 1000 / 24 (months) tokens (duration 24 months)
//       const tokenReleasedForCompanyReserve = Math.floor(amount / 24);

//       //increase block time
//       await ethers.provider.send("evm_increaseTime", [
//         cliffs[0] + intervals[0],
//       ]);
//       await ethers.provider.send("evm_mine");

//       const tx = await VestingContract.connect(deployer).release(
//         secondAccount.address,
//         0
//       );
//       const allEvents = (await tx.wait()).events;
//       const tokenReleasedEvent = allEvents.find(
//         (el) => el.event === "TokenReleased"
//       );
//       const [Beneficiary, tokenReleased, totalTokenWithdrawable] =
//         tokenReleasedEvent.args;

//       expect(tokenReleased).be.equal(tokenReleasedForCompanyReserve);
//     });

//     it("Should release correct token amount for Exchange listings & liquidity", async () => {
//       //above function added beneficiary to 0 role
//       await TransferTokensAllocateTokensAddBeneficiary();

//       //add a beneficiary for Exchange listings & liquidity (role 3).
//       // For role 3 , TGE = 25% , Cliff = 0 , duration = 24 months
//       await  VestingContract.addBeneficiary(
//         secondAccount.address,
//         3,
//         amount,
//         cliffs[3],
//         durations[3],
//         intervals[3],
//         isRevokable
//       );

//       //As TGE is 25% so, 25% of amount will go to withdrawAble amount
//       //Amount for vesting is 1000
//       //So after cliff period and 1st interval (interval 1 month)
//       //contract should release (1000 - tgeAmount) / 24 (months) tokens (duration = 24 months)

//       const tgeAmount = Math.floor((amount* tges[3])/100);
//       const tokenReleasedForExchangeListingsAndLiquidity = Math.floor((amount - tgeAmount) / 24);

//       //increase block time
//       await ethers.provider.send("evm_increaseTime", [
//         cliffs[3] + intervals[3],
//       ]);
//       await ethers.provider.send("evm_mine");

//       const tx = await VestingContract.connect(deployer).release(
//         secondAccount.address,
//         3
//       );
//       const allEvents = (await tx.wait()).events;
//       const tokenReleasedEvent = allEvents.find(
//         (el) => el.event === "TokenReleased"
//       );
//       const [Beneficiary, tokenReleased, totalTokenWithdrawable] =
//         tokenReleasedEvent.args;

//       expect(tokenReleased).be.equal(tokenReleasedForExchangeListingsAndLiquidity);
//     });

//     it("Should release correct token amount for AIR/BURN ", async () => {
//       //above function added beneficiary to 0 role
//       await TransferTokensAllocateTokensAddBeneficiary();

//       //add a beneficiary for AIR/BURN  (role 6).
//       // For role 6 , TGE = 50% , Cliff = 0 , duration = 2 months
//       await  VestingContract.addBeneficiary(
//         secondAccount.address,
//         6,
//         amount,
//         cliffs[6],
//         durations[6],
//         intervals[6],
//         isRevokable
//       );

//       //As TGE is 50% so, 50% of amount will go to withdrawAble amount
//       //Amount for vesting is 1000
//       //So after cliff period and 1st interval (interval 1 month)
//       //contract should release (1000 - tgeAmount) / 2 (months) tokens (duration = 2 months)

//       const tgeAmount = Math.floor((amount* tges[6])/100);
//       const tokenReleasedForAIROrBURN  = Math.floor((amount - tgeAmount) / 2);

//       //increase block time
//       await ethers.provider.send("evm_increaseTime", [
//         cliffs[6] + intervals[6],
//       ]);
//       await ethers.provider.send("evm_mine");

//       const tx = await VestingContract.connect(deployer).release(
//         secondAccount.address,
//         6
//       );
//       const allEvents = (await tx.wait()).events;
//       const tokenReleasedEvent = allEvents.find(
//         (el) => el.event === "TokenReleased"
//       );
//       const [Beneficiary, tokenReleased, totalTokenWithdrawable] =
//         tokenReleasedEvent.args;

//       expect(tokenReleased).be.equal(tokenReleasedForAIROrBURN);
//     });

//     it("Should release correct token amount for Partnerships And Advisors ", async () => {
//       //above function added beneficiary to 0 role
//       await TransferTokensAllocateTokensAddBeneficiary();

//       //add a beneficiary for AIR/BURN  (role 7).
//       // For role 7 , TGE = 0 , Cliff = 1 month , duration = 14 months , interval = 3 months
//       await  VestingContract.addBeneficiary(
//         secondAccount.address,
//         7,
//         amount,
//         cliffs[7],
//         durations[7],
//         intervals[7],
//         isRevokable
//       );

      
//       //Amount for vesting is 1000
//       //So after cliff period and 1st interval (3 month)
//       //contract should release ((1000 ) / 14 (months) ) tokens per month
//       //as the interval is 3 so amount * 3 will be released  after first interval

    
//       const tokenReleasedForPartnershipAndAdvisors   = Math.floor((amount * 3) / 14) ; //as interval is 3

//       //increase block time
//       await ethers.provider.send("evm_increaseTime", [
//         cliffs[7] + intervals[7],
//       ]);
//       await ethers.provider.send("evm_mine");

//       const tx = await VestingContract.connect(deployer).release(
//         secondAccount.address,
//         7
//       );
//       const allEvents = (await tx.wait()).events;
//       const tokenReleasedEvent = allEvents.find(
//         (el) => el.event === "TokenReleased"
//       );
//       const [Beneficiary, tokenReleased, totalTokenWithdrawable] = 
//         tokenReleasedEvent.args;

//       expect(tokenReleased).be.equal(tokenReleasedForPartnershipAndAdvisors);
//     });
//   });
// });