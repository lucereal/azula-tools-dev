import { ethers } from "hardhat";
import { AccessContract } from "../typechain-types";

// Replace with your deployed contract address
const contractAddress = "0x68B242cD623Aa93f368247B428bd3d90DAE63d30";

async function main() {
  const signers = await ethers.getSigners();
  
  const deployer = signers[0];
  const owner = deployer;
  const buyer = deployer;
  const anotherUser = deployer; 

  console.log("🔗 Connecting to AccessContract at:", contractAddress);
  console.log("👤 Owner address:", owner.address);
  console.log("🛒 Buyer address:", buyer.address);
  console.log("👥 Another user address:", anotherUser.address);
  
  // Connect to the deployed contract
  const accessContract = await ethers.getContractAt("AccessContract", contractAddress) as AccessContract;
  
  console.log("\n📊 Getting contract state...");
  
  // Test connection and get current state
  console.log("🔍 Testing contract connection...");
  const network = await ethers.provider.getNetwork();
  console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
  
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(`Current block number: ${blockNumber}`);
  
  // Get current nextResourceId
  const nextResourceId = await accessContract.nextResourceId();
  console.log("Next Resource ID:", nextResourceId.toString());
  
  // Get all existing resources
  const allResources = await accessContract.getAllResources();
  console.log("Total existing resources:", allResources.length);
  
  if (allResources.length > 0) {
    console.log("\n📋 Existing resources:");
    allResources.forEach((resource, index) => {
      console.log(`  Resource ${index}:`);
      console.log(`    Owner: ${resource.owner}`);
      console.log(`    CID: ${resource.cid}`);
      console.log(`    Price: ${ethers.formatEther(resource.price)} ETH`);
      console.log(`    Duration: ${resource.duration} seconds`);
      console.log(`    Active: ${resource.isActive}`);
    });
  }
  
  console.log("\n🆕 Creating a new resource...");
  
  // Create a new resource - using parameters that worked in simple test
  const resourceCid = "test123";
  const price = ethers.parseEther("0.001"); // 0.001 ETH (same as simple test)
  const duration = 60; // 1 minute (same as simple test)
  
  try {
    console.log("📝 Preparing transaction...");
    console.log(`  CID: ${resourceCid}`);
    console.log(`  Price: ${ethers.formatEther(price)} ETH`);
    console.log(`  Duration: ${duration} seconds`);
    console.log(`  From: ${owner.address}`);
    
    const gasLimit = await safeGasEstimation(
    accessContract.connect(owner), 
    'createResource', 
    [resourceCid, price, duration], 
    300000
    );

    console.log("🚀 Sending transaction...");
    const createTx = await accessContract.connect(owner).createResource(
    resourceCid,
    price,
    duration,
    {
        gasLimit: gasLimit
    }
    );
    
    console.log("⏳ Waiting for transaction confirmation...");
    console.log(`  Transaction hash: ${createTx.hash}`);
    
    const receipt = await createTx.wait();
    console.log("✅ Resource created successfully!");
    console.log(`  Block number: ${receipt?.blockNumber}`);
    console.log(`  Gas used: ${receipt?.gasUsed.toString()}`);

  } catch (error: any) {
    console.error("❌ Error creating resource:", error.message);
    console.error("Full error:", error);
    
    // Check if it's a revert or connection issue
    if (error.code === 'CALL_EXCEPTION') {
      console.log("🔍 This looks like a contract revert - check contract requirements");
    } else if (error.code === 'NETWORK_ERROR') {
      console.log("🌐 Network error - check Hardhat node connection");
    } else if (error.message.includes('ECONNRESET')) {
      console.log("🔌 Connection reset - Hardhat node may have restarted");
    }
    
    throw error; // Re-throw to stop execution
  }
  
  // Get the newly created resource ID
  const newResourceId = await accessContract.nextResourceId() - 1n;
  console.log("📄 New resource ID:", newResourceId.toString());
  
  // Get the created resource details
  const newResource = await accessContract.resources(newResourceId);
  console.log("📋 New resource details:");
  console.log(`  Owner: ${newResource.owner}`);
  console.log(`  CID: ${newResource.cid}`);
  console.log(`  Price: ${ethers.formatEther(newResource.price)} ETH`);
  console.log(`  Duration: ${newResource.duration} seconds`);
  console.log(`  Active: ${newResource.isActive}`);
  
  console.log("\n🛒 Buyer purchasing access...");
  


  // Check buyer's balance before purchase
  const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
  console.log("Buyer balance before:", ethers.formatEther(buyerBalanceBefore), "ETH");
  
  // Buy access as the buyer
  const buyTx = await accessContract.connect(buyer).buyAccess(newResourceId, {
    value: price
  });
  const buyReceipt = await buyTx.wait();
  console.log("✅ Access purchased successfully!");
  console.log("Gas used:", buyReceipt?.gasUsed.toString());
  
  // Check buyer's balance after purchase
  const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
  console.log("Buyer balance after:", ethers.formatEther(buyerBalanceAfter), "ETH");
  
  // Check access details
  const access = await accessContract.accessMap(buyer.address, newResourceId);
  console.log("\n🎫 Access details:");
  console.log(`  Amount paid: ${ethers.formatEther(access.amountPaid)} ETH`);
  console.log(`  Expires at: ${new Date(Number(access.expiresAt) * 1000).toLocaleString()}`);
  
  // Check if buyer has access
  const hasAccess = await accessContract.hasAccess(buyer.address, newResourceId);
  console.log(`  Has access: ${hasAccess}`);
  
  // Check seller balance in contract
  const sellerBalance = await accessContract.sellerBalances(owner.address);
  console.log(`\n💰 Seller balance in contract: ${ethers.formatEther(sellerBalance)} ETH`);
  
  console.log("\n💸 Owner withdrawing earnings...");
  
  // Check owner's balance before withdrawal
  const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
  console.log("Owner balance before withdrawal:", ethers.formatEther(ownerBalanceBefore), "ETH");
  
  // Withdraw earnings
  const withdrawTx = await accessContract.connect(owner).withdraw();
  const withdrawReceipt = await withdrawTx.wait();
  console.log("✅ Withdrawal successful!");
  console.log("Gas used:", withdrawReceipt?.gasUsed.toString());
  
  // Check owner's balance after withdrawal
  const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
  console.log("Owner balance after withdrawal:", ethers.formatEther(ownerBalanceAfter), "ETH");
  
  // Check seller balance in contract after withdrawal
  const sellerBalanceAfter = await accessContract.sellerBalances(owner.address);
  console.log("Seller balance in contract after withdrawal:", ethers.formatEther(sellerBalanceAfter), "ETH");
  
  console.log("\n🔒 Testing access expiration (simulated)...");
  
  // Test with another user who doesn't have access
  const anotherUserHasAccess = await accessContract.hasAccess(anotherUser.address, newResourceId);
  console.log(`Another user has access: ${anotherUserHasAccess}`);
  
  console.log("\n🚫 Testing deactivation...");
  
  // Deactivate the resource
  const deactivateTx = await accessContract.connect(owner).deactivateResource(newResourceId);
  await deactivateTx.wait();
  console.log("✅ Resource deactivated!");
  
  // Check resource status after deactivation
  const deactivatedResource = await accessContract.resources(newResourceId);
  console.log(`Resource active status: ${deactivatedResource.isActive}`);
  
  // Try to buy access to deactivated resource (should fail)
  console.log("\n❌ Testing purchase of deactivated resource...");
  try {
    await accessContract.connect(anotherUser).buyAccess(newResourceId, { value: price });
    console.log("❌ Purchase should have failed but didn't!");
  } catch (error: any) {
    console.log("✅ Purchase correctly failed:", error.reason || error.message);
  }
  
  console.log("\n🎉 Interaction script completed successfully!");
}

// Network-aware gas handling
async function safeGasEstimation(contract: any, method: string, args: any[], fallbackGas: number) {
  const network = await ethers.provider.getNetwork();
  const isLocalhost = network.name === "localhost" || network.chainId === 31337n;
  
  if (isLocalhost) {
    console.log("⚠️ Using fallback gas limit for localhost");
    return fallbackGas;
  }
  
  try {
    console.log("⛽ Estimating gas...");
    const gasEstimate = await contract[method].estimateGas(...args);
    console.log(`  Estimated gas: ${gasEstimate.toString()}`);
    return gasEstimate * 120n / 100n; // 20% buffer
  } catch (error) {
    console.log("⚠️ Gas estimation failed, using fallback");
    return fallbackGas;
  }
}



main().catch((error) => {
  console.error("❌ Error in interaction script:", error);
  process.exitCode = 1;
});
