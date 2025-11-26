require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800, // Optimized for function call frequency
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
      },
      evmVersion: "cancun",
      viaIR: true, // Enabled for stack too deep issues
      metadata: {
        bytecodeHash: "none" // Reduces bytecode size
      }
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: false, // Enforce 24KB limit
      gas: "auto",
      gasPrice: "auto",
      blockGasLimit: 30000000,
      initialBaseFeePerGas: 0,
      accounts: {
        mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
        count: 20,
        accountsBalance: "10000000000000000000000"
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      timeout: 60000
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1.2,
      timeout: 60000,
      confirmations: 2
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
      gas: "auto",
      gasPrice: "auto",
      timeout: 60000
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: process.env.REPORT_GAS === "true" ? "gas-report.txt" : undefined,
    noColors: process.env.REPORT_GAS === "true",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "",
    gasPriceApi: process.env.GAS_PRICE_API || "",
    token: "ETH",
    gasPrice: 21,
    showTimeSpent: true,
    showMethodSig: true,
    maxMethodDiff: 10,
    excludeContracts: ["Mock", "Test"],
    src: "./contracts",
    // Performance tracking
    L1: "ethereum",
    L2: "optimism",
    L2Etherscan: process.env.L2_ETHERSCAN_API_KEY,
    forceTerminalOutput: false,
    forceTerminalOutputFormat: "legacy"
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 100000,
    parallel: false,
    jobs: 4,
    retries: 0,
    bail: false
  },
  // Solidity coverage configuration
  coverage: {
    skipFiles: ["test", "mock"],
    measureStatementCoverage: true,
    measureFunctionCoverage: true,
    measureBranchCoverage: true,
    measureLineCoverage: true
  },
  // Contract size monitoring
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: process.env.CONTRACT_SIZER === "true",
    strict: true,
    only: [],
    except: []
  },
  // Defender configuration (optional)
  defender: {
    apiKey: process.env.DEFENDER_API_KEY || "",
    apiSecret: process.env.DEFENDER_API_SECRET || "",
  },
  // Tenderly configuration (optional)
  tenderly: {
    project: process.env.TENDERLY_PROJECT || "",
    username: process.env.TENDERLY_USERNAME || "",
    privateVerification: false
  }
};
