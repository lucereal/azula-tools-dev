# Testnet Deployment Guide

This guide walks you through deploying your smart contracts to the Ethereum Sepolia testnet.

## 🎯 Why Sepolia Testnet?

- ✅ Official Ethereum testnet (most stable)
- ✅ Free test ETH available
- ✅ Supported by all major tools
- ✅ Same experience as mainnet Ethereum
- ✅ Great for learning and testing

## 📋 Prerequisites

### 1. **MetaMask Wallet Setup**
1. Install [MetaMask browser extension](https://metamask.io/)
2. Create a new wallet (save your seed phrase securely!)
3. Add Sepolia network to MetaMask:
   - Network Name: `Sepolia`
   - RPC URL: `https://sepolia.infura.io/v3/`
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`

### 2. **Get Test ETH**
1. Copy your wallet address from MetaMask
2. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
3. Request test ETH (usually 0.5 ETH per request)
4. Wait a few minutes for the transaction to complete

### 3. **Get API Keys**

#### Alchemy (RPC Provider)
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Create account → "Create new app"
3. Choose "Ethereum" → "Sepolia"
4. Copy your API key from the dashboard

#### Etherscan (Contract Verification)
1. Go to [etherscan.io/apis](https://etherscan.io/apis)
2. Create account → "API Keys" → "Add"
3. Copy your API key

## 🛠 Setup Steps

### Step 1: Create Environment File

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**
   ```env
   # Alchemy API Key
   ALCHEMY_API_KEY=your_alchemy_api_key_here
   
   # Your wallet's private key (export from MetaMask)
   PRIVATE_KEY=your_private_key_here
   
   # Etherscan API Key
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

### Step 2: Export Private Key from MetaMask

⚠️ **SECURITY WARNING:** Never share your private key or commit it to git!

1. Open MetaMask
2. Click account menu (three dots)
3. Account Details → Export Private Key
4. Enter your password
5. Copy the private key to your `.env` file

### Step 3: Verify Your Setup

Test that everything is configured correctly:

```bash
# Check if you can connect to Sepolia
npx hardhat console --network sepolia
```

In the console, test your connection:
```javascript
const [deployer] = await ethers.getSigners();
console.log("Deployer address:", deployer.address);
console.log("Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
```

## 🚀 Deployment Process

### Step 1: Deploy Your Contract

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

**Expected output:**
```
Deploying with account: 0x1234...
Account balance: 0.5 ETH
Greeter deployed to: 0x5678...
```

**⏱ Time:** Usually takes 15-30 seconds

### Step 2: Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "Hello, Hardhat!"
```

Replace `<CONTRACT_ADDRESS>` with the address from your deployment.

**Example:**
```bash
npx hardhat verify --network sepolia 0x5678... "Hello, Hardhat!"
```

### Step 3: Interact with Your Deployed Contract

1. **Update your interact script:**
   - Open `scripts/interact.ts`
   - Replace the `contractAddress` with your deployed contract address

2. **Run the interaction:**
   ```bash
   npx hardhat run scripts/interact.ts --network sepolia
   ```

## 🔍 Viewing Your Contract

### On Etherscan
1. Go to [sepolia.etherscan.io](https://sepolia.etherscan.io)
2. Search for your contract address
3. View transactions, contract code, and interact with functions

### In MetaMask
1. Add your contract as a custom token (if it were an ERC-20)
2. View transaction history
3. Monitor gas usage

## 💰 Gas Costs & Optimization

### Typical Costs on Sepolia:
- **Contract Deployment:** ~0.001-0.005 ETH
- **Function Calls:** ~0.0001-0.0005 ETH
- **Contract Verification:** Free

### Gas Optimization Tips:
```typescript
// In your deploy script, you can set gas limits
const greeter = await Greeter.deploy("Hello, Hardhat!", {
  gasLimit: 500000, // Set explicit gas limit
});
```

## 🐛 Common Issues & Solutions

### "Insufficient funds for gas"
- **Solution:** Get more test ETH from the faucet
- **Check:** Your balance with the console command above

### "Invalid API key"
- **Solution:** Double-check your Alchemy/Etherscan API keys
- **Verify:** Keys are correctly pasted in `.env` file

### "Transaction underpriced"
- **Solution:** Network is congested, wait and retry
- **Alternative:** Increase gas price in hardhat config

### "Contract verification failed"
- **Solution:** Make sure constructor arguments match exactly
- **Check:** Contract address is correct

## 📁 File Structure After Deployment

```
├── contracts/
│   └── greeter.sol           # Your smart contract
├── scripts/
│   ├── deploy.ts            # Deployment script
│   └── interact.ts          # Interaction script  
├── docs/
│   ├── interact-guide.md    # Local interaction guide
│   └── testnet-deployment.md # This guide
├── .env                     # Your API keys (DO NOT COMMIT!)
├── .env.example            # Template for environment variables
└── hardhat.config.ts       # Network configurations
```

## 🎯 Next Steps

After successful deployment:

1. **Share Your Contract:** 
   - Send the Etherscan link to friends
   - Add it to your portfolio

2. **Build More Features:**
   - Add more functions to your contract
   - Create a web frontend to interact with it

3. **Learn More:**
   - Try deploying to other testnets (Goerli, Mumbai)
   - Explore Layer 2 solutions (Polygon, Arbitrum)

4. **Security:**
   - Learn about smart contract security
   - Run tests before deploying to mainnet

## 🛡️ Security Reminders

- ❌ **Never commit `.env` to git**
- ❌ **Never share your private key**
- ✅ **Use separate wallets for testing and mainnet**
- ✅ **Test thoroughly on testnets first**
- ✅ **Verify contracts on Etherscan for transparency**

## 🏆 Congratulations!

Once you complete this guide, you'll have:
- Deployed a smart contract to a real blockchain
- Verified your contract on Etherscan  
- Interacted with your contract on a live network
- Built a complete Web3 development workflow

You're now ready for mainnet deployment when you're ready! 🚀

---

**Need Help?** 
- Check the [Hardhat documentation](https://hardhat.org/docs)
- Visit [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- Join the [Hardhat Discord](https://hardhat.org/discord)
