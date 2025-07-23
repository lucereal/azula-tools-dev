# Contract Interaction Guide

This guide explains how to use the `scripts/interact.ts` script to interact with your deployed smart contracts.

## What is `interact.ts`?

The `interact.ts` script is designed to **connect to and test your already-deployed smart contracts**. After you deploy a contract using `deploy.ts`, you can use this script to:

- Read contract state (view functions)
- Modify contract state (write functions)
- Test contract functionality
- Verify your deployment worked correctly

## Prerequisites

1. **Hardhat node must be running**
   ```bash
   npx hardhat node
   ```

2. **Contract must be deployed**
   - Run your deploy script first
   - Note the contract address from the deployment output

## How to Use interact.ts

### Step 1: Deploy Your Contract First

Use either method:

**Option A: VS Code Debug**
- Run "🚀 Start Node & Debug Deploy" configuration
- Copy the contract address from Debug Console

**Option B: Terminal**
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

You'll see output like:
```
Deploying with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000.0 ETH
Greeter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Copy that contract address!**

### Step 2: Update the Contract Address

1. Open `scripts/interact.ts`
2. Find this line:
   ```typescript
   const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // UPDATE THIS!
   ```
3. Replace with your actual deployed contract address

### Step 3: Run the Interaction Script

**Option A: VS Code Debug (Recommended)**
- Select "Debug interact.ts with Hardhat" from debug dropdown
- Set breakpoints to step through the interaction
- Watch variables and see exactly what's happening

**Option B: Terminal**
```bash
npx hardhat run scripts/interact.ts --network localhost
```

## What the Script Does

The current `interact.ts` script performs these actions:

1. **Connects to the deployed contract**
   ```typescript
   const Greeter = await ethers.getContractAt("Greeter", contractAddress);
   ```

2. **Reads the current greeting**
   ```typescript
   console.log("Current greeting:", await Greeter.greet());
   ```

3. **Updates the greeting**
   ```typescript
   const tx = await Greeter.setGreeting("Hello from interact script!");
   await tx.wait(); // Wait for transaction to be mined
   ```

4. **Reads the updated greeting to verify the change**
   ```typescript
   console.log("Updated greeting:", await Greeter.greet());
   ```

## Expected Output

When you run the script, you should see:

```
Interacting with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Connecting to Greeter contract at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Current greeting: Hello, Hardhat!
Setting new greeting...
Updated greeting: Hello from interact script!
```

## Customizing the Script

You can extend `interact.ts` to test more functionality:

### Test Multiple Greetings
```typescript
// Test setting different greetings
const greetings = ["Hello, World!", "Bonjour!", "Hola!"];
for (const greeting of greetings) {
  await Greeter.setGreeting(greeting);
  console.log("Set greeting to:", await Greeter.greet());
}
```

### Test Edge Cases
```typescript
// Test empty string
await Greeter.setGreeting("");
console.log("Empty greeting:", await Greeter.greet());

// Test long string
await Greeter.setGreeting("A".repeat(100));
console.log("Long greeting length:", (await Greeter.greet()).length);
```

### Check Transaction Details
```typescript
const tx = await Greeter.setGreeting("New greeting");
console.log("Transaction hash:", tx.hash);
console.log("Gas used:", (await tx.wait()).gasUsed);
```

## Common Issues

### "Contract not deployed" Error
- Make sure you've deployed the contract first
- Check that the Hardhat node is still running
- Verify the contract address is correct

### "Invalid address" Error
- Make sure the contract address starts with `0x`
- Ensure you copied the complete address
- Check for any extra spaces or characters

### Network Connection Issues
- Confirm Hardhat node is running on `localhost:8545`
- Try restarting the node if needed

## Integration with VS Code

The interact script is fully integrated with your VS Code debugging setup:

- **Set breakpoints** on any line
- **Inspect variables** during execution
- **Step through** contract interactions
- **Watch** contract state changes in real-time

This makes it easy to understand exactly how your contract behaves and debug any issues.

## Next Steps

- Try modifying the script to test different contract functions
- Add error handling for edge cases
- Test interactions with multiple accounts
- Experiment with more complex contract scenarios

Happy contract testing! 🎯
