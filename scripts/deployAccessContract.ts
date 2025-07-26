import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  const AccessContract = await ethers.getContractFactory("AccessContract");

  // ⬇️ No constructor args anymore
  const contract = await AccessContract.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("AccessContract deployed to:", address);

  // Only verify on real networks, not localhost
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("Waiting 30 seconds before verification...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [], // ⬅️ Now empty
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error);
      console.log(`Manual verification command:`);
      console.log(`npx hardhat verify --network ${hre.network.name} ${address}`);
    }
  } else {
    console.log("📍 Deployed to localhost - skipping verification");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
