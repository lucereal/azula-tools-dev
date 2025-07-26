import { ethers } from "hardhat";
import { AccessContract } from "../typechain-types";

// Replace with your deployed contract address
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

async function main() {
  const [owner] = await ethers.getSigners();
  
  console.log("🔗 Simple test connecting to AccessContract at:", contractAddress);
  console.log("👤 Owner address:", owner.address);
  
  // Connect to the deployed contract
  const accessContract = await ethers.getContractAt("AccessContract", contractAddress) as AccessContract;
  
  // Check current state
  const nextResourceId = await accessContract.nextResourceId();
  console.log("Next Resource ID:", nextResourceId.toString());
  
  // Test with minimal parameters
  const resourceCid = "test123";
  const price = ethers.parseEther("0.001"); // Very small amount
  const duration = 60; // 1 minute
  
  console.log("\n🧪 Testing with minimal parameters...");
  console.log(`CID: ${resourceCid}, Price: ${ethers.formatEther(price)} ETH, Duration: ${duration}s`);
  
  try {
    // Try a dry run first (call, not transaction)
    console.log("🔍 Testing with staticCall (dry run)...");
    try {
      await accessContract.connect(owner).createResource.staticCall(
        resourceCid,
        price,
        duration
      );
      console.log("✅ Static call succeeded - function logic is OK");
    } catch (staticError: any) {
      console.error("❌ Static call failed:", staticError.message);
      console.log("🔍 The contract function itself has an issue");
      throw staticError;
    }
    
    // Now try gas estimation
    console.log("⛽ Estimating gas...");
    const gasEstimate = await accessContract.connect(owner).createResource.estimateGas(
      resourceCid,
      price,
      duration
    );
    console.log(`✅ Gas estimation succeeded: ${gasEstimate.toString()}`);
    
    // Now try the actual transaction
    console.log("🚀 Sending actual transaction...");
    const tx = await accessContract.connect(owner).createResource(
      resourceCid,
      price,
      duration,
      { gasLimit: gasEstimate * 110n / 100n } // Add 10% buffer
    );
    
    console.log(`✅ Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block ${receipt?.blockNumber}`);
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
    
    if (error.message.includes('ECONNRESET')) {
      console.log("🔌 Connection reset detected");
      console.log("💡 Try restarting the Hardhat node");
    }
  }
}

main().catch((error) => {
  console.error("❌ Script error:", error);
  process.exitCode = 1;
});
