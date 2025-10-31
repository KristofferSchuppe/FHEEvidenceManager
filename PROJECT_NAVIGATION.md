# 🗺️ Project Navigation Guide

Quick reference guide to navigate between the three main projects in this repository.

---

## 📍 Repository Structure

```
D:\/
├── 📝 Root Project (Smart Contract Development)
│   └── Main Hardhat project with comprehensive testing
│
├── 🎨 fhevm-react-template/ (Full-Stack SDK & Templates)
│   └── Universal SDK with multi-framework support
│
└── 🔐 privacy-evidence-manager/ (Standalone Application)
    └── Complete FHE implementation with web interface
```

---

## 🚀 Quick Navigation

### 1️⃣ Root Smart Contract Project

**Location**: Repository root (`D:\\`)

**What it contains**:
- Smart contract source code (`contracts/`)
- Comprehensive test suite (`test/`)
- Deployment scripts (`scripts/`)
- CI/CD configuration (`.github/`)

**When to use**:
- When working on smart contract development
- Running tests and coverage reports
- Deploying to networks
- Contributing to core contract logic

**Quick commands**:
```bash
cd D:\
npm install
npm run compile
npm test
```

**Key files**:
- `README.md` - This file
- `TESTING.md` - Test documentation
- `DEPLOYMENT.md` - Deployment guide
- `hardhat.config.js` - Configuration

---

### 2️⃣ FHEVM React Template

**Location**: `D:\\fhevm-react-template\`

**What it contains**:
- Universal FHEVM SDK (`packages/fhevm-sdk/`)
- Framework templates (`templates/`)
  - Next.js 14 template
  - React 18 + Vite template
  - Vue 3 template
  - Node.js/TypeScript template
- Example applications (`examples/`)
  - nextjs-fhe-integration
  - nextjs-evidence-manager
  - privacy-evidence-manager (React version)
- Complete documentation (`docs/`)

**When to use**:
- Building full-stack dApps with FHE
- Learning SDK integration
- Starting a new project with templates
- Developing frontend applications

**Quick commands**:
```bash
cd D:\\fhevm-react-template

# Build SDK
npm install
npm run build

# Run Next.js example
npm run dev:nextjs

# Run specific example
cd examples/nextjs-fhe-integration
npm install
npm run dev
```

**Key files**:
- `README.md` - SDK overview
- `WORK_COMPLETED.md` - Implementation details
- `packages/fhevm-sdk/README.md` - SDK documentation
- `docs/SDK_GUIDE.md` - Usage guide

---

### 3️⃣ Privacy Evidence Manager (Standalone)

**Location**: `D:\\privacy-evidence-manager\`

**What it contains**:
- Complete FHE smart contracts (`contracts/`)
- Web interface (`index.html`)
- React version (`src/` + Vite)
- Demo video (`PrivacyEvidenceManager.mp4`)
- Screenshots (`PrivacyEvidenceManager.png`)
- Test suite (`test/`)

**When to use**:
- Exploring complete FHE implementation
- Running standalone application
- Learning from working example
- Testing both vanilla JS and React versions

**Quick commands**:
```bash
cd D:\\privacy-evidence-manager

# Install and compile
npm install
npm run compile

# Run static HTML version
# Open index.html in browser

# Run React version
npm run frontend
```

**Key files**:
- `README.md` - Project documentation
- `index.html` - Vanilla JS interface
- `src/App.tsx` - React interface
- `PrivacyEvidenceManager.mp4` - Demo video

---

## 🔄 Common Workflows

### Starting a New dApp
```bash
# Use FHEVM React Template
cd D:\\fhevm-react-template
cd templates/nextjs  # or react, vue, nodejs
npm install
npm run dev
```

### Testing Smart Contracts
```bash
# Use Root Project
cd D:\
npm test
npm run test:coverage
```

### Viewing a Working Example
```bash
# Use Privacy Evidence Manager
cd D:\\privacy-evidence-manager
# Open index.html in browser
```

### Building with SDK
```bash
# Build SDK first
cd D:\\fhevm-react-template
npm run build

# Then use in your project
cd examples/nextjs-fhe-integration
npm install
npm run dev
```

---

## 📚 Documentation Quick Links

### Root Project
- [Main README](../README.md)
- [Testing Guide](../TESTING.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Security & Performance](../SECURITY_PERFORMANCE.md)

### FHEVM React Template
- [Template README](../fhevm-react-template/README.md)
- [SDK Guide](../fhevm-react-template/docs/SDK_GUIDE.md)
- [API Reference](../fhevm-react-template/docs/API_REFERENCE.md)
- [Integration Guide](../fhevm-react-template/docs/INTEGRATION.md)

### Privacy Evidence Manager
- [Project README](../privacy-evidence-manager/README.md)
- [Demo Video](../privacy-evidence-manager/PrivacyEvidenceManager.mp4)

---

## 💡 Tips

### Which Project Should I Use?

**For Smart Contract Development:**
→ Use **Root Project**

**For Full-Stack Development:**
→ Use **FHEVM React Template**

**For Learning/Exploring:**
→ Use **Privacy Evidence Manager**

### Dependencies

**Root Project:**
- Independent project
- No dependencies on other projects

**FHEVM React Template:**
- Can reference root project contracts
- SDK is self-contained

**Privacy Evidence Manager:**
- Standalone project
- Complete implementation

---

## 🔗 Related Projects

All three projects share the common goal of demonstrating FHE (Fully Homomorphic Encryption) in blockchain applications, but serve different purposes:

1. **Root**: Core smart contract development and testing
2. **FHEVM Template**: SDK and framework templates for developers
3. **Privacy Manager**: Complete working application example

---

**Choose your path and start building! 🚀**
