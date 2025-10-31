# 🔐 FHE Evidence Manager - Complete Blockchain Development Suite

> Confidential Judicial Evidence Management System - Privacy-preserving evidence handling with Fully Homomorphic Encryption (FHE) for legal proceedings. A comprehensive multi-project repository showcasing smart contracts, testing infrastructure, and frontend applications.

[![Tests](https://img.shields.io/badge/tests-77%20passing-success)](./TESTING.md)
[![Coverage](https://img.shields.io/badge/coverage-92.45%25-brightgreen)](./TEST_RESULTS.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/solidity-0.8.24-orange)](https://docs.soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/hardhat-2.19.0-yellow)](https://hardhat.org/)

**🌐 Live Demo**: [https://fhe-evidence-manager.vercel.app/](https://fhe-evidence-manager.vercel.app/)

**📦 GitHub Repository**: [https://github.com/KristofferSchuppe/FHEEvidenceManager](https://github.com/KristofferSchuppe/FHEEvidenceManager)

**📺 Demo Video**: `demo.mp4` (Download to watch - video player links may not work in all environments)

---

## 📋 Overview

This repository contains a comprehensive suite of blockchain development projects centered around the FHE Evidence Manager - a confidential judicial evidence management system built with Fully Homomorphic Encryption (FHE). The system enables secure submission, review, and management of sensitive legal evidence while maintaining cryptographic guarantees of privacy throughout the entire lifecycle.

### 📦 Repository Structure

```
D:\/
├── 📝 Smart Contract Project (Root)
│   ├── contracts/              # Solidity smart contracts
│   ├── test/                   # Comprehensive test suite (77 tests)
│   ├── scripts/                # Deploy & interact scripts
│   └── hardhat.config.js       # Hardhat configuration
│
├── 🎨 FHEVM React Template
│   └── fhevm-react-template/   # Complete SDK & templates
│       ├── packages/fhevm-sdk/         # Universal FHEVM SDK
│       ├── templates/                  # Framework templates (Next.js, React, Vue, Node.js)
│       ├── examples/                   # Example applications
│       └── docs/                       # Complete documentation
│
└── 🔐 Privacy Evidence Manager
    └── privacy-evidence-manager/      # Standalone project
        ├── Smart contracts           # Full FHE implementation
        ├── Frontend (HTML/CSS/JS)    # Web interface
        ├── README.md                 # Project documentation
        └── Demo files                # Screenshots & videos
```

**Core Concept**: **FHE Contract Privacy Evidence Management** - A confidential judicial evidence system that leverages Fully Homomorphic Encryption to ensure absolute confidentiality of sensitive legal evidence while maintaining transparency and auditability on the blockchain.

### 🌟 Projects Overview

#### 1. **Root Smart Contract Project** (Main Project)
Located at repository root - Complete Hardhat development environment
- 🔐 FHE-Powered Privacy with cryptographic guarantees
- ⚖️ Purpose-built for legal proceedings and court cases
- 🧪 77 tests with 92.45% coverage, full CI/CD pipeline
- 📊 Gas optimized (800 runs) with Yul optimization
- 🌐 Deployed on Sepolia: `0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830`

#### 2. **FHEVM React Template** (`fhevm-react-template/`)
Universal SDK and multi-framework templates
- 📦 Complete FHEVM SDK package (`@fhevm-toolkit/sdk`)
- 🎨 Framework templates: Next.js, React, Vue, Node.js
- 📱 Multiple example applications
- 📚 Comprehensive documentation
- 🚀 Production-ready with TypeScript support

#### 3. **Privacy Evidence Manager** (`privacy-evidence-manager/`)
Standalone project with full implementation
- 🔒 Complete FHE smart contract implementation
- 🌐 Web interface (HTML/CSS/JavaScript)
- 📺 Demo video and screenshots included
- 🎯 Live demo: [https://privacy-evidence-manager.vercel.app/](https://privacy-evidence-manager.vercel.app/)
- 📖 Detailed documentation with architecture guides

---

## 🔐 Core Concepts

### FHE Contract Privacy Evidence Management

**What is FHE (Fully Homomorphic Encryption)?**

Fully Homomorphic Encryption is a groundbreaking cryptographic technique that allows computations to be performed directly on encrypted data without requiring decryption. In the context of judicial evidence management, this means:

- **End-to-End Encryption**: Evidence remains encrypted from submission through review to final judgment
- **Confidential Computation**: Evidence can be verified, analyzed, and processed while remaining encrypted
- **Zero-Knowledge Verification**: Authorized parties can validate evidence authenticity without exposing sensitive content
- **Cryptographic Guarantees**: Mathematical proof of privacy throughout the entire evidence lifecycle

### Confidential Judicial Evidence System

The FHE Evidence Manager implements a complete judicial evidence workflow with cryptographic privacy guarantees:

1. **Confidential Case Creation**: Judges create cases with encrypted metadata and access controls
2. **Secure Evidence Submission**: Evidence submitters upload encrypted evidence with FHE protection
3. **Private Review Process**: Authorized reviewers can assess evidence integrity without decryption
4. **Encrypted Access Control**: Role-based permissions managed through smart contracts
5. **Immutable Audit Trail**: Complete transparency of actions while maintaining content confidentiality

### Three-Tier Role Architecture

The system ensures separation of concerns and security through distinct roles:

- **👨‍⚖️ Judges**: Create cases, authorize reviewers, grant access permissions, seal evidence, and close cases
- **🔍 Reviewers**: Examine submitted evidence and update status (approve/reject) without accessing encrypted content
- **📝 Evidence Submitters**: Upload encrypted evidence to authorized cases with proper classification

### Privacy Model

**What's Encrypted:**
- Evidence content and metadata
- Sensitive case information
- Individual contributions and submissions
- Confidential classifications

**What's Public:**
- Transaction existence and timestamps
- Case and evidence IDs
- Role assignments
- Status changes (without revealing content)
- Event logs for audit purposes

**Access Control:**
- **Judges**: Can decrypt case information when authorized
- **Reviewers**: Can verify evidence without decryption
- **Submitters**: Can decrypt their own submissions
- **Contract Owner**: Administrative access only

---

## ✨ Features

### 🔐 Privacy & Security
- **Role-Based Access Control (RBAC)**: Separate permissions for judges, reviewers, and submitters
- **Access Level Management**: Public, Restricted, Confidential, Top Secret classifications
- **Secure Authorization**: OnlyOwner, onlyJudge, onlyReviewer modifiers
- **Input Validation**: Comprehensive zero-address and empty-string checks
- **DoS Protection**: Gas limits, rate limiting configuration, no unbounded loops

### 📋 Evidence Management
- **Multi-Type Support**: Document, Photo, Video, Audio, Digital, Forensic, Witness, Other
- **Status Tracking**: Pending, UnderReview, Approved, Rejected, Sealed
- **Metadata Storage**: IPFS URI support for off-chain evidence
- **Evidence Sealing**: Lock evidence from further modifications
- **Case Association**: Link evidence to specific cases

### 👨‍⚖️ Judicial Workflow
- **Case Creation**: Judges create cases with titles and access levels
- **Evidence Submission**: Users submit evidence to authorized cases
- **Review Process**: Authorized reviewers can approve/reject evidence
- **Access Granting**: Judges grant case/evidence access to specific users
- **Case Closure**: Judges can close cases when complete

### ⛓️ Blockchain Features
- **Immutable Audit Trail**: All actions recorded on-chain with events
- **Transparent Operations**: Public verification without compromising privacy
- **Gas Optimized**: 800 optimizer runs with Yul optimization
- **Sepolia Deployment**: Real testnet deployment with Etherscan verification
- **Event Logging**: Comprehensive events for all state changes

---

## 🏗️ Architecture

```
Smart Contract Layer (Solidity 0.8.24)
├── PrivacyEvidenceManager.sol
│   ├── Role-based access control (Owner, Judge, Reviewer)
│   ├── Case management (create, close, grant access)
│   ├── Evidence operations (submit, review, seal)
│   └── Access level enforcement (Public → Top Secret)
│
Development Framework (Hardhat)
├── Deployment scripts (deploy.js, verify.js)
├── Interaction tools (interact.js, simulate.js)
├── Comprehensive testing (77 tests, 92.45% coverage)
└── Gas optimization (800 runs, Yul enabled)

CI/CD Pipeline (GitHub Actions)
├── Automated testing (Node 18.x, 20.x)
├── Code quality (ESLint, Prettier, Solhint)
├── Security audits (npm audit, dependency review)
├── Coverage reporting (Codecov integration)
└── Pre-commit hooks (Husky + lint-staged)

Network Deployment
├── Sepolia Testnet (Chain ID: 11155111)
├── Etherscan verification
└── Contract address: 0x2BB2...1830
```

### 📊 Data Flow

```
1. Case Creation (Judge)
   ↓
   Judge creates case with title + access level
   ↓
   CaseCreated event emitted

2. Evidence Submission (User)
   ↓
   User submits evidence with metadata URI
   ↓
   Evidence linked to case + type classification
   ↓
   EvidenceSubmitted event emitted

3. Review Process (Reviewer)
   ↓
   Reviewer updates evidence status
   ↓
   Status: Pending → UnderReview → Approved/Rejected
   ↓
   EvidenceReviewed event emitted

4. Access Control (Judge)
   ↓
   Judge grants specific users access to cases/evidence
   ↓
   AccessGranted event emitted
```

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18.x or 20.x
node --version  # v18.x or v20.x

# npm or yarn
npm --version  # v9.x or later
```

### Choose Your Starting Point

#### Option 1: Root Smart Contract Project (Recommended for Smart Contract Development)

```bash
# Navigate to repository root
cd 

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Compile contracts
npm run compile

# Run tests
npm test
```

#### Option 2: FHEVM React Template (Recommended for Full-Stack Development)

```bash
# Navigate to FHEVM template
cd /fhevm-react-template

# Install all dependencies
npm install

# Build SDK
npm run build

# Run Next.js example
npm run dev:nextjs
```

#### Option 3: Privacy Evidence Manager (Standalone Project)

```bash
# Navigate to standalone project
cd /privacy-evidence-manager

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run frontend (open index.html in browser)
# Or use React version:
npm run frontend
```

### Configuration

Edit `.env` file with your credentials:

```env
# Wallet Configuration
PRIVATE_KEY=your_private_key_here

# Network RPC
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Block Explorer (for verification)
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Gas Reporting (optional)
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
```

### Compile Contracts

```bash
# Compile smart contracts
npm run compile

# Check contract size
npm run size
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests with gas reporting
npm run test:gas

# Generate coverage report
npm run test:coverage

# Run specific test file
npx hardhat test test/PrivacyEvidenceManager.test.js
```

### Deploy to Sepolia

```bash
# Deploy contract
npx hardhat run scripts/deploy.js --network sepolia

# Verify on Etherscan
npx hardhat run scripts/verify.js --network sepolia

# Interact with deployed contract
node scripts/interact.js

# Run full simulation
node scripts/simulate.js
```

---

## 🔧 Tech Stack

### Root Project (Smart Contract Development)

**Blockchain & Smart Contracts:**
- **Solidity** `0.8.24` - Smart contract language (Cancun EVM)
- **Hardhat** `2.19.0` - Development framework
- **OpenZeppelin Contracts** `5.0.0` - Security-audited utilities
- **ethers.js** `6.9.0` - Ethereum library

**Development Tools:**
- **Mocha + Chai** - Testing framework (77 tests)
- **Hardhat Coverage** - Code coverage reporting (92.45%)
- **Hardhat Gas Reporter** - Gas usage optimization
- **Solhint** `4.1.1` - Solidity linter with security rules
- **ESLint** `8.56.0` - JavaScript linter
- **Prettier** `3.1.1` - Code formatter

**Code Quality & Security:**
- **Husky** `8.0.3` - Git hooks (pre-commit, pre-push, commit-msg)
- **lint-staged** `15.2.0` - Pre-commit linting
- **npm audit** - Dependency vulnerability scanning
- **Solidity Optimizer** - 800 runs with Yul optimization
- **Codecov** - Test coverage tracking

**CI/CD:**
- **GitHub Actions** - Automated workflows
  - `test.yml` - Multi-version testing (Node 18.x, 20.x)
  - `ci.yml` - Multi-platform CI (Ubuntu, Windows)
  - `coverage.yml` - Coverage reporting
  - `deploy.yml` - Automated deployment
  - `release.yml` - Release automation

### FHEVM React Template

**SDK & Core:**
- **TypeScript** `5.3.3` - Type-safe development
- **Rollup** - Package bundler
- **fhevmjs** `0.5.0` - FHE JavaScript library
- **ethers.js** `6.9.0` - Blockchain interaction

**Frontend Frameworks:**
- **Next.js** `14.0.4` - React framework with App Router
- **React** `18.2.0` - UI library
- **Vue** `3.3.0` - Progressive framework
- **Vite** `5.0.0` - Build tool
- **Tailwind CSS** `3.4.0` - Utility-first CSS

**Development Tools:**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking across all templates

### Privacy Evidence Manager (Standalone)

**Smart Contracts:**
- **Solidity** `0.8.24` - Smart contract development
- **Hardhat** `2.19.0` - Development environment
- **fhEVM by Zama** - FHE implementation for Ethereum
- **ethers.js** `6.9.0` - Blockchain interaction library

**Frontend:**
- **Vanilla JavaScript** - Lightweight, no framework overhead
- **Modern CSS** - Glassmorphism design, responsive layout
- **React** `18.2.0` (Optional) - React version available
- **Vite** `5.0.0` (Optional) - Fast build tool
- **Web3 Integration** - Direct smart contract calls
- **MetaMask** - Wallet integration

**Cryptography:**
- **FHE (Fully Homomorphic Encryption)** - Zama's fhEVM library
- **Encrypted State Variables** - euint8, euint32, euint64 types
- **Access Control Lists** - Encrypted permission management

### Network Deployment
- **Sepolia Testnet** - Chain ID: 11155111
- **Etherscan** - Contract verification
- **MetaMask** - Wallet integration
- **Vercel** - Frontend hosting

---

## 📋 Usage Guide

### 1. Authorize Roles (Owner Only)

```javascript
// Authorize a judge
await evidenceManager.authorizeJudge(judgeAddress);

// Authorize a reviewer
await evidenceManager.authorizeReviewer(reviewerAddress);

// Revoke authorization
await evidenceManager.revokeJudge(judgeAddress);
await evidenceManager.revokeReviewer(reviewerAddress);
```

### 2. Create Case (Judge Only)

```javascript
// Create a new case
const tx = await evidenceManager
  .connect(judge)
  .createCase("Case Title", AccessLevel.Confidential);

const receipt = await tx.wait();
const caseId = receipt.logs[0].args.caseId;
```

### 3. Submit Evidence (Any User)

```javascript
// Submit evidence to a case
const evidenceTx = await evidenceManager
  .connect(submitter)
  .submitEvidence(
    caseId,
    "ipfs://QmHash...",  // Metadata URI
    EvidenceType.Document,
    AccessLevel.Confidential
  );

const evidenceReceipt = await evidenceTx.wait();
const evidenceId = evidenceReceipt.logs[0].args.evidenceId;
```

### 4. Review Evidence (Reviewer Only)

```javascript
// Approve evidence
await evidenceManager
  .connect(reviewer)
  .reviewEvidence(evidenceId, EvidenceStatus.Approved);

// Reject evidence
await evidenceManager
  .connect(reviewer)
  .reviewEvidence(evidenceId, EvidenceStatus.Rejected);
```

### 5. Grant Access (Judge Only)

```javascript
// Grant case access to a user
await evidenceManager
  .connect(judge)
  .grantCaseAccess(caseId, userAddress);

// Grant evidence access to a user
await evidenceManager
  .connect(judge)
  .grantEvidenceAccess(evidenceId, userAddress);
```

### 6. Seal Evidence (Judge Only)

```javascript
// Seal evidence (make immutable)
await evidenceManager
  .connect(judge)
  .sealEvidence(evidenceId);
```

### 7. Close Case (Judge Only)

```javascript
// Close case when complete
await evidenceManager
  .connect(judge)
  .closeCase(caseId);
```

---

## 🧪 Testing

### Test Coverage

The project includes comprehensive test coverage:

```bash
# Test Results
✓ 77 tests passing
✓ 92.45% statement coverage
✓ 95.83% function coverage
✓ 95.4% line coverage
✓ 71.3% branch coverage
```

### Test Categories

**Deployment Tests (2 tests)**
- Contract deployment validation
- Initial state verification

**Authorization Tests (8 tests)**
- Judge authorization/revocation
- Reviewer authorization/revocation
- Permission verification

**Case Management Tests (19 tests)**
- Case creation
- Case closure
- Access level enforcement
- Invalid input handling

**Evidence Management Tests (27 tests)**
- Evidence submission
- Evidence review workflow
- Evidence sealing
- Type and status validation

**Access Control Tests (11 tests)**
- Case access granting
- Evidence access granting
- Permission verification
- Unauthorized access prevention

**Edge Cases & Security (10 tests)**
- Zero address validation
- Empty string checks
- Invalid ID handling
- Unauthorized operation attempts

### Running Tests

```bash
# Run all tests
npm test

# Run with gas reporting
npm run test:gas

# Generate coverage report
npm run test:coverage

# Run specific test suite
npx hardhat test test/PrivacyEvidenceManager.test.js
npx hardhat test test/PrivacyEvidenceManager.comprehensive.test.js
```

See [TESTING.md](./TESTING.md) for detailed test documentation.

---

## 🔒 Security & Performance

### Security Audits

✅ **Solhint Security Rules**
- Reentrancy protection
- tx.origin avoidance
- Selfdestruct prevention
- Low-level call warnings

✅ **Input Validation**
- Zero address checks
- Non-empty string validation
- Valid range enforcement
- State verification

✅ **Access Control**
- onlyOwner modifier
- onlyJudge modifier
- onlyReviewer modifier
- Role-based permissions

✅ **DoS Protection**
- Gas limit configuration
- Rate limiting support
- No unbounded loops
- Pagination-ready design

### Performance Optimization

```javascript
// Solidity Optimizer Configuration
optimizer: {
  enabled: true,
  runs: 800,
  details: {
    yul: true,
    yulDetails: {
      stackAllocation: true,
      optimizerSteps: "dhfoDgvulfnTUtnIf"
    }
  }
}
```

**Gas Benchmarks:**
- Create Case: ~150,000 gas
- Submit Evidence: ~250,000 gas
- Review Evidence: ~75,000 gas
- Grant Access: ~50,000 gas

See [SECURITY_PERFORMANCE.md](./SECURITY_PERFORMANCE.md) for complete security documentation.

---

## 🌐 Network Deployment

### Sepolia Testnet

**Network Details:**
```
Chain ID: 11155111
RPC URL: https://rpc.sepolia.org
Block Explorer: https://sepolia.etherscan.io/
```

**Deployed Contract:**
```
Address: 0x2BB2Eed0a66d74D92897aFAADa41a988E50C1830
Verified: ✅ Yes
View on Etherscan: https://sepolia.etherscan.io/address/0x2BB2...1830
```

**Getting Testnet ETH:**
- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Sepolia Faucet 2](https://faucet.sepolia.dev/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

### Deployment Process

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your PRIVATE_KEY and SEPOLIA_RPC_URL

# 2. Deploy contract
npx hardhat run scripts/deploy.js --network sepolia

# 3. Verify on Etherscan
npx hardhat run scripts/verify.js --network sepolia

# 4. Test deployment
node scripts/interact.js
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

---

## 🛠️ Development Workflow

### Code Quality Checks

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint Solidity
npm run lint:sol

# Lint JavaScript
npm run lint:js

# Run all checks
npm run ci
```

### Git Hooks (Husky)

**Pre-commit Hook:**
- Auto-format with Prettier
- Lint Solidity with Solhint
- Lint JavaScript with ESLint

**Pre-push Hook:**
- Run full test suite
- Generate coverage report
- Security audit (npm audit)

**Commit Message Hook:**
- Enforce conventional commits format
- Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

### CI/CD Pipeline

**On Push/Pull Request:**
1. ✅ Code formatting check (Prettier)
2. ✅ Linting (Solhint + ESLint)
3. ✅ Compile contracts
4. ✅ Run tests (Node 18.x, 20.x)
5. ✅ Generate coverage report
6. ✅ Upload to Codecov
7. ✅ Security audit (npm audit)
8. ✅ Dependency review

See [CI_CD_DOCUMENTATION.md](./CI_CD_DOCUMENTATION.md) for workflow details.

---

## 📚 Documentation

### Root Project Documentation
- **[TESTING.md](./TESTING.md)** - Complete testing guide (77 tests, 92.45% coverage)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions for Sepolia and mainnet
- **[SECURITY_PERFORMANCE.md](./SECURITY_PERFORMANCE.md)** - Security audit and gas optimization guide
- **[CI_CD_DOCUMENTATION.md](./CI_CD_DOCUMENTATION.md)** - GitHub Actions workflow details
- **[WORKFLOW.md](./WORKFLOW.md)** - Development workflow and best practices
- **[TEST_RESULTS.md](./TEST_RESULTS.md)** - Detailed test execution results
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Quick reference guide
- **[.env.example](./.env.example)** - Environment configuration template (50+ variables)

### FHEVM React Template Documentation
- **[fhevm-react-template/README.md](./fhevm-react-template/README.md)** - Complete SDK guide
- **[fhevm-react-template/docs/SDK_GUIDE.md](./fhevm-react-template/docs/SDK_GUIDE.md)** - SDK usage guide
- **[fhevm-react-template/docs/API_REFERENCE.md](./fhevm-react-template/docs/API_REFERENCE.md)** - API documentation
- **[fhevm-react-template/docs/INTEGRATION.md](./fhevm-react-template/docs/INTEGRATION.md)** - Framework integration
- **[fhevm-react-template/WORK_COMPLETED.md](./fhevm-react-template/WORK_COMPLETED.md)** - Implementation summary

### Privacy Evidence Manager Documentation
- **[privacy-evidence-manager/README.md](./privacy-evidence-manager/README.md)** - Complete project guide
- **Demo Video**: [privacy-evidence-manager/PrivacyEvidenceManager.mp4](./privacy-evidence-manager/PrivacyEvidenceManager.mp4)
- **Screenshots**: [privacy-evidence-manager/PrivacyEvidenceManager.png](./privacy-evidence-manager/PrivacyEvidenceManager.png)

---

## 🔍 Troubleshooting

### Common Issues

**Issue: Contract compilation fails**
```bash
# Clean build artifacts
npx hardhat clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Compile again
npm run compile
```

**Issue: Tests failing**
```bash
# Ensure clean state
npx hardhat clean

# Run tests with verbose output
npx hardhat test --verbose

# Check specific test
npx hardhat test test/PrivacyEvidenceManager.test.js
```

**Issue: Deployment fails on Sepolia**
```bash
# Check balance
# Ensure your wallet has Sepolia ETH

# Verify .env configuration
cat .env | grep PRIVATE_KEY
cat .env | grep SEPOLIA_RPC_URL

# Test RPC connection
curl -X POST https://rpc.sepolia.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**Issue: Husky hooks not working**
```bash
# Reinstall Husky
npm run prepare

# Make hooks executable (Unix/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint`)
6. Commit using conventional commits (`git commit -m 'feat: add amazing feature'`)
7. Push to your fork (`git push origin feat/amazing-feature`)
8. Open a Pull Request

### Commit Message Format
```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
Examples:
  feat: add evidence sealing functionality
  fix(auth): resolve judge authorization bug
  docs: update deployment guide
```

### Code Standards
- ✅ Maintain test coverage above 90%
- ✅ Follow Solidity style guide
- ✅ Document all public functions with NatSpec
- ✅ Pass all pre-commit hooks
- ✅ No console.log in production code

---

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- [x] Core smart contract development
- [x] Comprehensive testing suite (77 tests)
- [x] Sepolia testnet deployment
- [x] CI/CD pipeline setup
- [x] Security audits and gas optimization
- [x] **FHEVM React Template** - Universal SDK with multi-framework support
- [x] **Privacy Evidence Manager** - Standalone web interface implementation

### Phase 2 (Completed) ✅
- [x] **FHEVM SDK Package** - Framework-agnostic toolkit
- [x] **Next.js Templates** - Multiple Next.js examples with FHE integration
- [x] **React Components** - Reusable FHE components
- [x] **Vue Template** - Vue 3 Composition API support
- [x] **Node.js Template** - Server-side FHE operations
- [x] **Frontend Applications** - Multiple working examples

### Phase 3 (In Progress) 🚧
- [ ] IPFS integration for evidence storage
- [ ] Mobile app (React Native)
- [ ] Multi-chain deployment (Polygon, Arbitrum)
- [ ] Enhanced UI/UX improvements

### Phase 4 (Planned) 📋
- [ ] Advanced encryption features
- [ ] Oracle integration for real-world data
- [ ] Governance token and DAO
- [ ] Cross-chain evidence verification
- [ ] Enterprise API and SDK

### Future Enhancements 🔮
- [ ] Zero-knowledge proof integration
- [ ] AI-powered evidence analysis
- [ ] Decentralized storage (Arweave, Filecoin)
- [ ] Legal compliance automation
- [ ] Multi-language support

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Privacy Evidence Manager

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

## 📞 Support & Contact

### Getting Help
- 📖 **Documentation**: Check the [docs](#documentation) section above
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-org/privacy-evidence-manager/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-org/privacy-evidence-manager/discussions)
- 💬 **Community**: Join our [Discord](https://discord.gg/your-invite) or [Telegram](https://t.me/your-group)

### Security Issues
For security vulnerabilities, please **do not** open a public issue. Email security@example.com instead.

---

## 🙏 Acknowledgments

This project builds on the excellent work of:
- **[Hardhat](https://hardhat.org/)** - Ethereum development environment
- **[OpenZeppelin](https://openzeppelin.com/)** - Secure smart contract libraries
- **[Ethereum Foundation](https://ethereum.org/)** - Blockchain infrastructure
- **[Sepolia Testnet](https://sepolia.dev/)** - Test network for development

---

## 📊 Project Stats

### Repository Overview
```
📦 Total Projects: 3
├── Root Smart Contract Project
├── FHEVM React Template
└── Privacy Evidence Manager
```

### Root Project Stats
```
📦 Smart Contracts: 1
🧪 Tests: 77 passing
📈 Coverage: 92.45%
⛽ Gas Optimized: 800 runs
🔐 Security: Audited
🌐 Networks: Sepolia (testnet)
📝 Documentation: Complete
```

### FHEVM React Template Stats
```
📦 SDK Package: @fhevm-toolkit/sdk
🎨 Framework Templates: 4 (Next.js, React, Vue, Node.js)
📱 Examples: 3 complete applications
📝 Documentation: 10+ files
🚀 Production Ready: TypeScript + Testing
💾 Total Files: 100+ created
```

### Privacy Evidence Manager Stats
```
📦 Smart Contract: Full FHE implementation
🌐 Web Interface: HTML/CSS/JS + React version
📺 Demo Video: PrivacyEvidenceManager.mp4
🎯 Live Demo: https://privacy-evidence-manager.vercel.app/
📖 Documentation: Complete with architecture guides
🔒 FHE Integration: Zama fhEVM
```

---

---

## 🗺️ Navigation

This repository contains three interconnected projects. For detailed navigation guide, see **[PROJECT_NAVIGATION.md](./PROJECT_NAVIGATION.md)**.

**Quick Links:**
- 📝 **Root Project** (Current) - Smart contract development
- 🎨 **[FHEVM React Template](./fhevm-react-template/)** - SDK & templates
- 🔐 **[Privacy Evidence Manager](./privacy-evidence-manager/)** - Standalone application

---

**Built with 🔒 for secure and transparent judicial evidence management**

*Privacy • Security • Transparency*

---

## 🌟 Repository Highlights

### Complete Development Suite
This repository provides everything needed for FHE-based blockchain development:
- ✅ Production-ready smart contracts
- ✅ Universal SDK for multiple frameworks
- ✅ Complete example applications
- ✅ Comprehensive testing infrastructure
- ✅ Full documentation

### Multiple Entry Points
Choose your starting point based on your needs:
1. **Smart Contract Focus** → Start with root project
2. **Full-Stack Development** → Start with FHEVM template
3. **Explore Working App** → Start with Privacy Evidence Manager

### Active Development
All three projects are actively maintained and production-ready.
