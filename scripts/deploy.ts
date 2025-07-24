// scripts/deploy.ts
import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  const Greeter = await ethers.getContractFactory("Greeter");
    
  const constructorArg = "Hello World!";
  console.log("Constructor argument:", constructorArg);

  const greeter = await Greeter.deploy(constructorArg);

  await greeter.waitForDeployment();

  const address = await greeter.getAddress();
    console.log("Greeter deployed to:", address);
    
    // Wait a bit for the contract to be indexed
    console.log("Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Verify the contract
    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [constructorArg],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error);
      console.log(`Manual verification command:`);
      console.log(`npx hardhat verify --network sepolia ${address} "${constructorArg}"`);
    }
  }

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
