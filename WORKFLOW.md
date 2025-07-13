# Development Workflow Guide

Complete workflow for developing, testing, and deploying the Privacy Evidence Manager smart contract.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Compile contracts
npm run compile

# 3. Run tests
npm test

# 4. Deploy to testnet
npm run deploy

# 5. Verify contract
npm run verify

# 6. Interact with contract
npm run interact
```

---

## Complete Development Workflow

### Phase 1: Setup and Configuration

#### 1.1 Initial Setup

```bash
# Navigate to project directory
cd D:\

# Install all dependencies
npm install

# Verify installation
npm run compile
```

#### 1.2 Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Add: PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY
```

#### 1.3 Verify Configuration

```bash
# Check Hardhat configuration
npx hardhat

# Should display available tasks:
# compile, test, deploy, verify, etc.
```

---

### Phase 2: Development

#### 2.1 Write Smart Contracts

Edit contracts in `contracts/` directory:

```
contracts/
└── PrivacyEvidenceManager.sol
```

#### 2.2 Compile Contracts

```bash
# Compile all contracts
npm run compile

# Clean and recompile
npm run clean && npm run compile
```

**Expected Output:**
```
Compiled 1 Solidity file successfully
```

#### 2.3 Check for Compilation Errors

If errors occur:
1. Check Solidity version in contract
2. Verify imports are correct
3. Review `hardhat.config.js` settings

---

### Phase 3: Testing

#### 3.1 Write Tests

Create tests in `test/` directory:

```
test/
└── PrivacyEvidenceManager.test.js
```

#### 3.2 Run All Tests

```bash
# Run complete test suite
npm test
```

**Expected Output:**
```
  PrivacyEvidenceManager
    Deployment
      ✓ Should set the correct owner
      ✓ Should authorize deployer as judge and reviewer
      ✓ Should initialize counters to zero
    Authorization Management
      ✓ Should allow owner to authorize judges
      ✓ Should allow owner to authorize reviewers
      ...

  42 passing (2s)
```

#### 3.3 Test Coverage

```bash
# Generate coverage report
npm run test:coverage
```

View coverage report:
- Terminal output shows coverage percentages
- HTML report in `coverage/index.html`

**Target**: Aim for >80% coverage

#### 3.4 Gas Report

```bash
# Enable gas reporting
REPORT_GAS=true npm test
```

Review gas costs for optimization opportunities.

---

### Phase 4: Local Testing

#### 4.1 Start Local Network

Terminal 1:
```bash
# Start Hardhat local network
npm run node
```

**Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...
```

#### 4.2 Deploy to Local Network

Terminal 2:
```bash
# Deploy to localhost
npm run deploy:local
```

#### 4.3 Test Locally

```bash
# Run interaction script on localhost
npx hardhat run scripts/interact.js --network localhost
```

---

### Phase 5: Testnet Deployment

#### 5.1 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Environment variables configured
- [ ] Sufficient testnet ETH in wallet
- [ ] Contract reviewed and audited

#### 5.2 Deploy to Sepolia

```bash
# Deploy to Sepolia testnet
npm run deploy
```

**Process:**
1. Checks deployer balance
2. Deploys contract
3. Waits for confirmations
4. Saves deployment info
5. Displays contract address

#### 5.3 Verify Deployment

Check the deployment file:

```bash
cat deployments/sepolia_deployment.json
```

Verify on Etherscan:
- Open the Etherscan URL from deployment output
- Check contract creation transaction
- Verify deployer address

---

### Phase 6: Contract Verification

#### 6.1 Verify on Etherscan

```bash
# Run verification script
npm run verify
```

#### 6.2 Manual Verification (if needed)

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

#### 6.3 Confirm Verification

Visit Etherscan:
- Contract tab should show "✓" verified
- Source code should be visible
- Read/Write contract tabs available

---

### Phase 7: Post-Deployment Testing

#### 7.1 Interact with Deployed Contract

```bash
# Run interaction script
npm run interact
```

This displays:
- Current contract state
- Owner address
- Statistics (cases, evidence, requests)
- Example interaction code

#### 7.2 Run Full Simulation

```bash
# Run complete scenario simulation
npm run simulate
```

**Simulation includes:**
1. Authorizing judges and reviewers
2. Creating test cases
3. Granting access permissions
4. Submitting evidence
5. Reviewing evidence
6. Sealing sensitive evidence
7. Retrieving information
8. Final statistics

**Output:**
- Creates simulation results in `simulations/` directory
- Displays detailed scenario execution
- Shows all transaction hashes

#### 7.3 Manual Testing

Use Etherscan's "Write Contract" interface:

1. Go to contract on Etherscan
2. Click "Contract" tab
3. Click "Write Contract"
4. Connect wallet
5. Execute functions

---

### Phase 8: Code Quality

#### 8.1 Linting

```bash
# Lint Solidity files
npm run lint:sol
```

Fix any warnings or errors reported.

#### 8.2 Formatting

```bash
# Check formatting
npm run format:check

# Auto-format files
npm run format
```

#### 8.3 Security Checks

Review for common vulnerabilities:
- Reentrancy attacks
- Integer overflow/underflow
- Access control issues
- Gas optimization

---

## Workflow Scenarios

### Scenario 1: Adding a New Feature

```bash
# 1. Create new branch (if using Git)
git checkout -b feature/new-functionality

# 2. Modify contract
# Edit contracts/PrivacyEvidenceManager.sol

# 3. Compile
npm run compile

# 4. Write tests
# Edit test/PrivacyEvidenceManager.test.js

# 5. Run tests
npm test

# 6. Deploy to local network
npm run node  # Terminal 1
npm run deploy:local  # Terminal 2

# 7. Test locally
npm run interact

# 8. Deploy to testnet
npm run deploy

# 9. Verify
npm run verify

# 10. Document changes
# Update README.md, DEPLOYMENT.md
```

### Scenario 2: Bug Fix

```bash
# 1. Reproduce bug in test
# Write failing test in test/

# 2. Run test to confirm failure
npm test

# 3. Fix bug in contract
# Edit contracts/

# 4. Recompile
npm run compile

# 5. Run tests to confirm fix
npm test

# 6. Deploy updated contract
npm run deploy

# 7. Verify
npm run verify

# 8. Test fix
npm run simulate
```

### Scenario 3: Contract Upgrade

```bash
# 1. Create new contract version
# contracts/PrivacyEvidenceManagerV2.sol

# 2. Update tests
# test/PrivacyEvidenceManagerV2.test.js

# 3. Update deployment script
# scripts/deploy.js

# 4. Test thoroughly
npm test
npm run test:coverage

# 5. Deploy new version
npm run deploy

# 6. Migrate data (if needed)
# Use custom migration script

# 7. Update documentation
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run compile
      - run: npm test
```

---

## Troubleshooting Workflow

### Issue: Tests Failing

```bash
# 1. Clean build artifacts
npm run clean

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Recompile
npm run compile

# 4. Run tests with verbose output
npx hardhat test --verbose
```

### Issue: Deployment Failing

```bash
# 1. Check balance
npx hardhat run scripts/interact.js --network sepolia

# 2. Verify network configuration
cat hardhat.config.js

# 3. Test RPC connection
curl -X POST SEPOLIA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# 4. Try with increased gas
# Edit deploy script to add gas settings
```

### Issue: Verification Failing

```bash
# 1. Wait 2-3 minutes after deployment

# 2. Check API key
echo $ETHERSCAN_API_KEY

# 3. Manual verification
npx hardhat verify --network sepolia \
  --contract contracts/PrivacyEvidenceManager.sol:PrivacyEvidenceManager \
  CONTRACT_ADDRESS
```

---

## Best Practices

### 1. Version Control

```bash
# Always commit before major changes
git add .
git commit -m "Description of changes"

# Create branches for features
git checkout -b feature/name

# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
```

### 2. Testing Strategy

- Write tests before implementing features (TDD)
- Test both success and failure cases
- Include edge cases and boundary conditions
- Maintain >80% code coverage

### 3. Deployment Strategy

- Always deploy to testnet first
- Test thoroughly before mainnet
- Use multi-sig wallets for production
- Have rollback plan ready

### 4. Documentation

- Document all public functions
- Update README with changes
- Maintain CHANGELOG.md
- Include deployment addresses

### 5. Security

- Never commit private keys
- Use hardware wallets for mainnet
- Conduct security audits
- Monitor deployed contracts

---

## Automated Workflow Scripts

### Quick Deploy Script

Create `scripts/quick-deploy.sh`:

```bash
#!/bin/bash
echo "🚀 Quick Deploy Workflow"
npm run compile && \
npm test && \
npm run deploy && \
npm run verify && \
npm run simulate
echo "✅ Complete!"
```

### Daily Development Script

Create `scripts/dev.sh`:

```bash
#!/bin/bash
npm run clean
npm run compile
npm test
npm run lint:sol
npm run format:check
```

---

## Performance Metrics

Track these metrics during development:

- **Compilation Time**: Should be <10 seconds
- **Test Execution**: Should be <30 seconds
- **Deployment Gas**: Monitor and optimize
- **Contract Size**: Stay under 24KB limit
- **Test Coverage**: Maintain >80%

---

## Next Steps

After completing the workflow:

1. **Frontend Integration**: Build UI to interact with contract
2. **Subgraph**: Create The Graph subgraph for indexing
3. **Documentation**: Complete API documentation
4. **Monitoring**: Set up contract monitoring
5. **Analytics**: Implement usage analytics

---

**Workflow Version**: 1.0.0

**Last Updated**: [Date]

**Maintainer**: [Your name]

---

*This workflow guide is a living document. Update as the project evolves.*
