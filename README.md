# az-tools-dev

A Hardhat development environment for smart contract development and debugging.

## What This Demo Does

This project demonstrates **smart contract deployment to a local blockchain** with full debugging capabilities in VS Code.

### Overview

You're deploying a smart contract to a local blockchain and debugging the deployment process step-by-step.

## Step-by-Step Breakdown

### 1. **Local Blockchain Setup**
```bash
npx hardhat node
```
- Creates a **local Ethereum blockchain** running on `localhost:8545`
- Provides 20 pre-funded test accounts (each with 10,000 ETH)
- Acts like a mini version of Ethereum for development

### 2. **Smart Contract Compilation**
- Your `contracts/greeter.sol` file gets compiled into bytecode
- Creates ABI (Application Binary Interface) - tells you how to interact with the contract
- Compiled artifacts stored in `artifacts/` folder

### 3. **Contract Deployment** (`scripts/deploy.ts`)

```typescript
const Greeter = await ethers.getContractFactory("Greeter");
```
- Gets the compiled contract and prepares it for deployment

```typescript
const greeter = await Greeter.deploy("Hello, Hardhat!");
```
- **Deploys the contract** to your local blockchain
- Passes `"Hello, Hardhat!"` as the constructor argument
- Returns a contract instance

```typescript
await greeter.waitForDeployment();
```
- Waits for the deployment transaction to be mined (confirmed)

```typescript
console.log("Greeter deployed to:", await greeter.getAddress());
```
- Shows you the **contract address** where it was deployed

## What This Simulates

This is **exactly what happens** when you deploy to real networks like:
- Ethereum mainnet
- Polygon
- Arbitrum
- Any other EVM blockchain

## Why This Is Useful

1. **Safe Testing** - No real money involved
2. **Fast Development** - Instant transactions, no gas fees
3. **Debugging** - Set breakpoints and step through deployment logic
4. **Contract Interaction** - After deployment, you can interact with the contract

## Getting Started

### Prerequisites
- Node.js installed
- VS Code with this workspace open

### Quick Start with VS Code Debugging

1. **Open the Debug panel** (Ctrl+Shift+D)
2. **Select "🚀 Start Node & Debug Deploy"** from the dropdown
3. **Click the green play button** or press F5

This will automatically:
- Start the Hardhat node
- Wait for it to be ready
- Deploy your contract in debug mode
- Show the deployment address in the Debug Console

### Manual Commands

If you prefer running commands manually:

```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.ts --network localhost
```

## Project Structure

```
├── contracts/          # Smart contracts (.sol files)
├── scripts/            # Deployment and utility scripts
├── test/              # Contract tests
├── artifacts/         # Compiled contract artifacts
├── cache/             # Hardhat cache
├── typechain-types/   # TypeScript contract interfaces
└── .vscode/           # VS Code debug configuration
```

## Next Steps You Could Try

- Add more constructor parameters to the Greeter contract
- Deploy multiple contracts in sequence
- Call functions on the deployed contract
- Test different deployment scenarios
- Write and run contract tests

---

You're essentially running your own private Ethereum network! 🚀