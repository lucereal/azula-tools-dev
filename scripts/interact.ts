// scripts/interact.ts
import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Interacting with account:", signer.address);

  const contractAddress = "0xC52808F09e45D26c8DD5747f2b7c5beB40be0Ae8";
  
  console.log("Connecting to Greeter contract at:", contractAddress);
  
  // Check if contract exists FIRST
  const code = await ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    console.log("Contract not deployed at this address");
    return;
  }
  
  console.log("Contract code found, proceeding with interaction...");
  
  // NOW create the contract instance
  const Greeter = await ethers.getContractAt("Greeter", contractAddress);
  
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "Chain ID:", network.chainId);

  try {
    // Read the current greeting
    console.log("Current greeting:", await Greeter.greet());
    
    // Change the greeting
    console.log("Setting new greeting...");
    const tx = await Greeter.setGreeting("Hello from interact script!");
    await tx.wait();
    
    // Read the updated greeting
    console.log("Updated greeting:", await Greeter.greet());
    
  } catch (error: any) {
    console.error("Error interacting with contract:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
