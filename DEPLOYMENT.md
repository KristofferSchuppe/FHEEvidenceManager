# Deployment Documentation

## Privacy Evidence Manager - Deployment Guide

This document provides comprehensive information about deploying, verifying, and interacting with the Privacy Evidence Manager smart contract.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Process](#deployment-process)
4. [Contract Verification](#contract-verification)
5. [Deployment Information](#deployment-information)
6. [Post-Deployment Tasks](#post-deployment-tasks)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: Latest version
- **MetaMask**: Browser wallet extension

### Required Accounts

1. **Wallet with Testnet ETH**
   - Sepolia testnet ETH for deployment
   - Get from: [Sepolia Faucet](https://sepoliafaucet.com/)

2. **Etherscan API Key**
   - Required for contract verification
   - Obtain from: [Etherscan API Keys](https://etherscan.io/myapikey)

3. **RPC Endpoint**
   - Use public RPC or services like Infura/Alchemy
   - Sepolia RPC: `https://rpc.sepolia.org`

---

## Environment Setup

### 1. Install Dependencies

```bash
cd D:\
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Private Key (DO NOT SHARE OR COMMIT)
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://rpc.sepolia.org
# Or use Infura/Alchemy:
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# API Keys for Contract Verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Gas Reporter (Optional)
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
```

### 3. Verify Configuration

```bash
npm run compile
```

If successful, you should see:
```
Compiled 1 Solidity file successfully
```

---

## Deployment Process

### Step 1: Run Tests

Before deploying, ensure all tests pass:

```bash
npm test
```

Expected output:
```
  PrivacyEvidenceManager
    Deployment
      ✓ Should set the correct owner
      ✓ Should authorize deployer as judge and reviewer
      ...

  XX passing (XXs)
```

### Step 2: Deploy to Sepolia Testnet

```bash
npm run deploy
```

The deployment script will:

1. ✅ Check deployer balance
2. ✅ Deploy the PrivacyEvidenceManager contract
3. ✅ Wait for deployment confirmation
4. ✅ Save deployment information
5. ✅ Display contract address and Etherscan link

**Sample Output:**

```
╔═══════════════════════════════════════════════════════════════╗
║   Privacy Evidence Manager - Deployment Script                ║
╚═══════════════════════════════════════════════════════════════╝

📋 Deployment Information:
─────────────────────────────────────────────────────────────────
Network:          sepolia
Chain ID:         11155111
Deployer:         0x1234567890123456789012345678901234567890
Balance:          1.5 ETH
─────────────────────────────────────────────────────────────────

🚀 Deploying PrivacyEvidenceManager contract...

✅ Deployment Successful!

📝 Contract Details:
─────────────────────────────────────────────────────────────────
Contract Name:    PrivacyEvidenceManager
Contract Address: 0xABCDEF1234567890ABCDEF1234567890ABCDEF12
Deployer Address: 0x1234567890123456789012345678901234567890
Network:          sepolia (Chain ID: 11155111)
Deployment Tx:    0xabcdef...
─────────────────────────────────────────────────────────────────

🔗 Block Explorer Links:
─────────────────────────────────────────────────────────────────
Contract: https://sepolia.etherscan.io/address/0xABCDEF...
Deployment Tx: https://sepolia.etherscan.io/tx/0xabcdef...
─────────────────────────────────────────────────────────────────

💾 Deployment information saved to:
   D:\\deployments\sepolia_deployment.json

⏳ Waiting for block confirmations...
✅ Block confirmations received

📝 To verify the contract, run:
   npx hardhat run scripts/verify.js --network sepolia

🎉 Deployment Complete!
```

### Step 3: Deployment Information File

After deployment, check the generated file:

```bash
cat deployments/sepolia_deployment.json
```

**Example Content:**

```json
{
  "network": "sepolia",
  "chainId": "11155111",
  "contractName": "PrivacyEvidenceManager",
  "contractAddress": "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
  "deployer": "0x1234567890123456789012345678901234567890",
  "deploymentTx": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "blockNumber": 1234567,
  "etherscanUrl": "https://sepolia.etherscan.io/address/0xABCDEF..."
}
```

---

## Contract Verification

Verify your contract on Etherscan to allow public interaction and transparency.

### Run Verification Script

```bash
npm run verify
```

**Sample Output:**

```
╔═══════════════════════════════════════════════════════════════╗
║   Privacy Evidence Manager - Verification Script              ║
╚═══════════════════════════════════════════════════════════════╝

📋 Verification Information:
─────────────────────────────────────────────────────────────────
Network:          sepolia
Contract Address: 0xABCDEF1234567890ABCDEF1234567890ABCDEF12
Contract Name:    PrivacyEvidenceManager
─────────────────────────────────────────────────────────────────

🔍 Verifying contract on Etherscan...

✅ Contract Verification Successful!

🔗 Verified Contract Link:
─────────────────────────────────────────────────────────────────
https://sepolia.etherscan.io/address/0xABCDEF...#code
─────────────────────────────────────────────────────────────────

💾 Deployment info updated with verification status

🎉 Verification Process Complete!
```

### Manual Verification (Alternative)

If the script fails, verify manually:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

---

## Deployment Information

### Sepolia Testnet Deployment

#### Contract Details

| **Property**              | **Value**                                                         |
|---------------------------|-------------------------------------------------------------------|
| **Contract Name**         | PrivacyEvidenceManager                                            |
| **Contract Address**      | `[Update after deployment]`                                       |
| **Network**               | Sepolia Testnet                                                   |
| **Chain ID**              | 11155111                                                          |
| **Deployer Address**      | `[Update after deployment]`                                       |
| **Deployment Transaction** | `[Update after deployment]`                                      |
| **Block Number**          | `[Update after deployment]`                                       |
| **Deployment Date**       | `[Update after deployment]`                                       |
| **Verification Status**   | ✅ Verified / ❌ Not Verified                                     |

#### Etherscan Links

- **Contract**: `https://sepolia.etherscan.io/address/[CONTRACT_ADDRESS]`
- **Contract Code**: `https://sepolia.etherscan.io/address/[CONTRACT_ADDRESS]#code`
- **Read Contract**: `https://sepolia.etherscan.io/address/[CONTRACT_ADDRESS]#readContract`
- **Write Contract**: `https://sepolia.etherscan.io/address/[CONTRACT_ADDRESS]#writeContract`
- **Deployment Transaction**: `https://sepolia.etherscan.io/tx/[TX_HASH]`

#### Contract Configuration

```javascript
{
  solidity: "0.8.24",
  optimizer: {
    enabled: true,
    runs: 200
  },
  evmVersion: "cancun"
}
```

---

## Post-Deployment Tasks

### 1. Interact with Contract

Run the interaction script to verify deployment:

```bash
npm run interact
```

This will:
- Connect to the deployed contract
- Display current contract state
- Show available interaction examples

### 2. Run Simulation

Test the full workflow with simulated scenarios:

```bash
npm run simulate
```

This will execute:
- Authorizing judges and reviewers
- Creating test cases
- Submitting evidence
- Reviewing and sealing evidence
- Retrieving information

### 3. Update Frontend Configuration

If you have a frontend application, update the contract address:

```javascript
// Update in your frontend config
const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS";
const NETWORK_ID = 11155111; // Sepolia
```

### 4. Document Deployment

Update the following files with deployment information:

1. **README.md** - Update deployment section
2. **.env** - Add CONTRACT_ADDRESS
3. **Frontend config** - Update contract address

### 5. Test Production Functions

Verify core functionality:

```javascript
// Example: Create a test case
const tx = await contract.createCase("Test Case", 1);
await tx.wait();
console.log("Case created successfully!");
```

---

## Troubleshooting

### Common Issues

#### 1. Insufficient Balance

**Error**: `Error: insufficient funds for gas * price + value`

**Solution**:
- Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Check balance: `npm run interact`

#### 2. Nonce Too Low

**Error**: `Error: nonce has already been used`

**Solution**:
```bash
# Reset nonce in MetaMask
# Settings > Advanced > Reset Account
```

#### 3. Network Mismatch

**Error**: `Error: network mismatch`

**Solution**:
- Verify RPC URL in `.env`
- Check network in `hardhat.config.js`
- Ensure correct network flag: `--network sepolia`

#### 4. Verification Failed

**Error**: `Error: Verification failed`

**Solution**:
- Wait 2-3 minutes after deployment
- Check Etherscan API key
- Verify constructor arguments match
- Try manual verification

#### 5. Contract Already Verified

**Message**: `Already Verified`

**Action**: This is normal - contract is already verified!

### Debug Mode

Enable detailed logging:

```bash
# Set environment variable
export DEBUG=hardhat:*

# Run deployment
npm run deploy
```

### Getting Help

If issues persist:

1. Check [Hardhat Documentation](https://hardhat.org/docs)
2. Review [Etherscan Verification Guide](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
3. Check contract compilation: `npm run compile`
4. Verify environment variables: `cat .env`

---

## Deployment Checklist

Before deploying to mainnet:

- [ ] All tests pass (`npm test`)
- [ ] Test coverage > 80% (`npm run test:coverage`)
- [ ] Code linted (`npm run lint:sol`)
- [ ] Code formatted (`npm run format:check`)
- [ ] Security audit completed
- [ ] Gas optimization reviewed
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Sufficient balance for deployment
- [ ] Backup private keys securely
- [ ] Deployment plan reviewed
- [ ] Rollback strategy prepared

---

## Network Information

### Sepolia Testnet

- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Block Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com
- **Currency**: SepoliaETH (Test ETH)

### Alternative Testnets

#### Mumbai (Polygon Testnet)
- **Chain ID**: 80001
- **RPC URL**: https://rpc-mumbai.maticvigil.com
- **Block Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology

---

## Production Deployment Notes

### Security Considerations

1. **Private Key Management**
   - Never commit private keys to git
   - Use hardware wallets for mainnet
   - Consider multi-sig wallets

2. **Contract Deployment**
   - Deploy during low gas periods
   - Use gas limit calculators
   - Have backup deployment plan

3. **Post-Deployment**
   - Transfer ownership to multi-sig
   - Monitor contract activity
   - Set up alerts for anomalies

### Gas Optimization

Estimated deployment cost on Sepolia:
- **Contract Deployment**: ~2,500,000 gas
- **At 50 gwei**: ~0.125 ETH
- **USD Equivalent**: Varies by ETH price

---

## Additional Resources

- **Hardhat Config**: `hardhat.config.js`
- **Deploy Script**: `scripts/deploy.js`
- **Verify Script**: `scripts/verify.js`
- **Interact Script**: `scripts/interact.js`
- **Simulate Script**: `scripts/simulate.js`

---

**Last Updated**: [Update after deployment]

**Deployed By**: [Your name/organization]

**Contact**: [Your contact information]

---

*For production deployments, please conduct a thorough security audit and follow best practices for smart contract deployment.*
