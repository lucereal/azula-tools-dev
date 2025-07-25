import { expect } from "chai";
import { ethers } from "hardhat";
import { AccessContract } from "../typechain-types";

describe("AccessContract", function () {
  let accessContract: AccessContract;
  let owner: any;
  let buyer: any;

  beforeEach(async () => {
    [owner, buyer] = await ethers.getSigners();

    const AccessContract = await ethers.getContractFactory("AccessContract");
    accessContract = (await AccessContract.deploy()) as AccessContract;
    await accessContract.waitForDeployment();
  });

  it("should let a seller create a resource", async () => {
    await accessContract.connect(owner).createResource("ipfsCID", ethers.parseEther("0.01"), 7 * 24 * 60 * 60);
    const resource = await accessContract.resources(0);

    expect(resource.owner).to.equal(owner.address);
    expect(resource.price).to.equal(ethers.parseEther("0.01"));
    expect(resource.isActive).to.equal(true);
  });

  it("should let a buyer purchase access and update balances", async () => {
    await accessContract.connect(owner).createResource("ipfsCID", ethers.parseEther("0.01"), 3600);
    const price = ethers.parseEther("0.01");

    await expect(
      accessContract.connect(buyer).buyAccess(0, { value: price })
    ).to.emit(accessContract, "AccessPurchased");

    const access = await accessContract.accessMap(buyer.address, 0);
    expect(access.amountPaid).to.equal(price);

    const balance = await accessContract.sellerBalances(owner.address);
    expect(balance).to.equal(price);
  });

  it("should confirm access is valid within time window", async () => {
    await accessContract.connect(owner).createResource("ipfsCID", ethers.parseEther("0.01"), 1000);
    await accessContract.connect(buyer).buyAccess(0, { value: ethers.parseEther("0.01") });

    const hasAccess = await accessContract.hasAccess(buyer.address, 0);
    expect(hasAccess).to.be.true;
  });

  it("should allow seller to withdraw earnings", async () => {
    await accessContract.connect(owner).createResource("ipfsCID", ethers.parseEther("0.01"), 1000);
    await accessContract.connect(buyer).buyAccess(0, { value: ethers.parseEther("0.01") });

    const before = await ethers.provider.getBalance(owner.address);
    const tx = await accessContract.connect(owner).withdraw();
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error("Transaction receipt is null");
    }
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    const after = await ethers.provider.getBalance(owner.address);
    expect(after).to.be.gt(before - gasUsed);
  });

  it("should let seller deactivate a resource", async () => {
    await accessContract.connect(owner).createResource("ipfsCID", ethers.parseEther("0.01"), 1000);
    await accessContract.connect(owner).deactivateResource(0);

    const res = await accessContract.resources(0);
    expect(res.isActive).to.be.false;
  });

  it("should reject buying access to an inactive resource", async () => {
    await accessContract.connect(owner).createResource("ipfsCID", ethers.parseEther("0.01"), 1000);
    await accessContract.connect(owner).deactivateResource(0);

    await expect(
      accessContract.connect(buyer).buyAccess(0, { value: ethers.parseEther("0.01") })
    ).to.be.revertedWith("Resource not active");
  });

  it("should fail if buyer sends wrong ETH amount", async () => {
    await accessContract.connect(owner).createResource("ipfsCID", ethers.parseEther("0.01"), 1000);

    await expect(
      accessContract.connect(buyer).buyAccess(0, { value: ethers.parseEther("0.005") })
    ).to.be.revertedWith("Incorrect payment");
  });
});
