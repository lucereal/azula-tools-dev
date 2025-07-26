import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "dotenv/config";

const config: HardhatUserConfig = {
    solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      // Built-in network for testing
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      timeout: 120000, // 2 minutes
      httpHeaders: {},
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1.2,
      accounts: "remote", // Use accounts from the running node
    },
    sepolia: {
      url: `${process.env.ALCHEMY_API_URL}${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            timeout: 60000,
      gas: "auto",
      gasPrice: "auto",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
    // Add this to prevent Hardhat from trying to use unsupported methods
  mocha: {
    timeout: 60000
  },
  
};

export default config;
