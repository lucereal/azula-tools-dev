// scripts/interact.ts
import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Interacting with account:", signer.address);

  // Replace this with your actual deployed contract address
  // You can get this from your deploy script output
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // UPDATE THIS!
  
  console.log("Connecting to Greeter contract at:", contractAddress);
  
  // Connect to the deployed contract
  const Greeter = await ethers.getContractAt("Greeter", contractAddress);
  
  // Read the current greeting
  console.log("Current greeting:", await Greeter.greet());
  
  // Change the greeting
  console.log("Setting new greeting...");
  const tx = await Greeter.setGreeting("Hello from interact script!");
  await tx.wait(); // Wait for transaction to be mined
  
  // Read the updated greeting
  console.log("Updated greeting:", await Greeter.greet());
  
  // You can add more interactions here:
  // - Test edge cases
  // - Call other contract functions
  // - Check contract state
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
