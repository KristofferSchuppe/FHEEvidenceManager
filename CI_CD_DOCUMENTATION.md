# CI/CD Documentation

Comprehensive Continuous Integration and Continuous Deployment documentation for Privacy Evidence Manager.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [GitHub Actions Workflows](#github-actions-workflows)
3. [Automated Testing](#automated-testing)
4. [Code Quality Checks](#code-quality-checks)
5. [Coverage Reporting](#coverage-reporting)
6. [Deployment Pipeline](#deployment-pipeline)
7. [Setup Instructions](#setup-instructions)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project uses **GitHub Actions** for automated CI/CD workflows. All code pushed to the repository is automatically:

- ✅ Tested on multiple Node.js versions (18.x, 20.x)
- ✅ Tested on multiple operating systems (Ubuntu, Windows)
- ✅ Checked for code quality (Prettier, Solhint)
- ✅ Analyzed for test coverage (Codecov)
- ✅ Audited for security vulnerabilities
- ✅ Prepared for deployment

---

## 🔧 GitHub Actions Workflows

### Workflow Files Location

```
.github/
└── workflows/
    ├── test.yml        # Main testing workflow
    ├── ci.yml          # Comprehensive CI pipeline
    ├── coverage.yml    # Coverage reporting
    ├── deploy.yml      # Manual deployment
    └── release.yml     # Release automation
```

### 1. Test Workflow (`test.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**
- **test**: Runs on Node.js 18.x and 20.x
  - Prettier format check
  - Solhint linting
  - Contract compilation
  - Test execution
  - Coverage generation
  - Codecov upload

- **lint**: Code quality verification
  - Format checking
  - Solidity linting
  - Compilation check

- **security**: Security audit
  - npm audit
  - Outdated packages check

**Matrix Testing:**
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

### 2. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Jobs:**
- **build-and-test**: Multi-platform testing
  - Ubuntu + Windows
  - Node.js 18.x + 20.x
  - 4 test combinations total

- **code-quality**: Quality checks
  - Prettier verification
  - Solhint validation
  - Compilation verification

- **gas-report**: Gas usage analysis
  - Generates gas consumption report
  - Uploads as artifact

- **dependency-review**: Security review
  - Reviews dependency changes
  - Fails on moderate+ vulnerabilities

**Matrix Configuration:**
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18.x, 20.x]
```

### 3. Coverage Workflow (`coverage.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Features:**
- Comprehensive coverage analysis
- Codecov integration
- Coverage artifacts
- PR comments with coverage stats

**Outputs:**
- Coverage percentage
- LCOV reports
- HTML coverage reports
- Automated PR comments

### 4. Deploy Workflow (`deploy.yml`)

**Trigger:** Manual (workflow_dispatch)

**Inputs:**
- Network selection (sepolia, mumbai, localhost)
- Verification toggle

**Steps:**
1. Pre-deployment tests
2. Contract deployment
3. Optional Etherscan verification
4. Artifact upload
5. Deployment summary

**Required Secrets:**
- `PRIVATE_KEY`
- `SEPOLIA_RPC_URL`
- `MUMBAI_RPC_URL`
- `ETHERSCAN_API_KEY`
- `POLYGONSCAN_API_KEY`

### 5. Release Workflow (`release.yml`)

**Trigger:** Git tags (`v*.*.*`)

**Process:**
1. Run full test suite
2. Generate coverage
3. Build contracts
4. Create release artifacts
5. Generate changelog
6. Create GitHub release
7. Upload coverage

---

## 🧪 Automated Testing

### Test Execution

Tests run automatically on:
- ✅ Every push to `main` or `develop`
- ✅ Every pull request
- ✅ Multiple Node.js versions
- ✅ Multiple operating systems

### Test Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run with gas reporting
REPORT_GAS=true npm test
```

### Test Matrix

| OS | Node.js | Status |
|----|---------|--------|
| Ubuntu | 18.x | ✅ Tested |
| Ubuntu | 20.x | ✅ Tested |
| Windows | 18.x | ✅ Tested |
| Windows | 20.x | ✅ Tested |

---

## 🎨 Code Quality Checks

### Prettier

**Configuration:** `.prettierrc.json`

**Check Command:**
```bash
npm run format:check
```

**Auto-Fix Command:**
```bash
npm run format
```

**Files Checked:**
- `contracts/**/*.sol`
- `scripts/**/*.js`
- `test/**/*.js`

### Solhint

**Configuration:** `.solhint.json`

**Lint Command:**
```bash
npm run lint:sol
```

**Rules:**
- Solidity best practices
- Security checks
- Code style enforcement
- Max line length: 120

**Ignored Files:** (`.solhintignore`)
- `node_modules/`
- `artifacts/`
- `cache/`
- `coverage/`

---

## 📊 Coverage Reporting

### Codecov Integration

**Configuration:** `codecov.yml`

**Coverage Targets:**
- Project: 80% minimum
- Patch: 70% minimum
- Threshold: 2% variation allowed

**Flags:**
- `unittests`: Main test coverage
- `smartcontracts`: Contract-specific coverage
- Platform-specific flags for matrix builds

### Coverage Status Checks

Coverage is checked on:
- Every pull request
- Every push to main branches
- All test runs

**PR Comments:**
Automatically adds coverage report to PRs:
```
## 📊 Coverage Report

**Line Coverage:** 95.4%
**Covered Lines:** 254/266
```

### Viewing Coverage

**Local:**
```bash
npm run test:coverage
open coverage/index.html
```

**CI Artifacts:**
- Coverage reports uploaded as artifacts
- Retained for 30 days
- Downloadable from Actions tab

---

## 🚀 Deployment Pipeline

### Manual Deployment

Deployments are triggered manually via GitHub Actions:

1. Go to **Actions** tab
2. Select **Deploy** workflow
3. Click **Run workflow**
4. Choose network and verification option
5. Monitor deployment progress

### Deployment Process

```
1. Checkout code
   ↓
2. Setup Node.js
   ↓
3. Install dependencies
   ↓
4. Compile contracts
   ↓
5. Run pre-deployment tests
   ↓
6. Deploy to selected network
   ↓
7. Verify on block explorer (optional)
   ↓
8. Upload deployment artifacts
   ↓
9. Create deployment summary
```

### Deployment Artifacts

After deployment:
- Deployment JSON files
- Contract addresses
- Transaction hashes
- Block explorer links

**Retention:** 90 days

---

## ⚙️ Setup Instructions

### 1. Repository Secrets

Configure the following secrets in GitHub Settings → Secrets:

**Required for Testing:**
```
CODECOV_TOKEN          # Codecov upload token
```

**Required for Deployment:**
```
PRIVATE_KEY            # Deployer wallet private key
SEPOLIA_RPC_URL        # Sepolia network RPC
MUMBAI_RPC_URL         # Mumbai network RPC
ETHERSCAN_API_KEY      # Etherscan verification
POLYGONSCAN_API_KEY    # Polygonscan verification
```

### 2. Codecov Setup

1. Visit [codecov.io](https://codecov.io/)
2. Sign in with GitHub
3. Add your repository
4. Copy the upload token
5. Add as `CODECOV_TOKEN` secret

### 3. Branch Protection

Recommended branch protection rules for `main`:

- ✅ Require pull request reviews
- ✅ Require status checks to pass
  - `test (18.x)`
  - `test (20.x)`
  - `Code Quality Checks`
  - `codecov/project`
- ✅ Require branches to be up to date
- ✅ Require signed commits
- ✅ Include administrators

### 4. Workflow Permissions

Ensure workflows have proper permissions:

```yaml
permissions:
  contents: read        # Read repository
  pull-requests: write  # Comment on PRs
```

---

## 🔍 Workflow Status

### Viewing Workflow Runs

1. Go to **Actions** tab in GitHub
2. Select workflow from sidebar
3. View run history and logs

### Status Badges

Add to README:

```markdown
![Test](https://github.com/YOUR_USERNAME/privacy-evidence-manager/workflows/Test/badge.svg)
![CI](https://github.com/YOUR_USERNAME/privacy-evidence-manager/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/privacy-evidence-manager/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/privacy-evidence-manager)
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Tests Fail in CI But Pass Locally

**Possible Causes:**
- Node.js version mismatch
- Missing environment variables
- OS-specific issues

**Solution:**
```bash
# Test locally with same Node version
nvm use 18
npm test

# Or use Docker
docker run -it node:18 /bin/bash
```

#### 2. Coverage Upload Fails

**Possible Causes:**
- Missing CODECOV_TOKEN
- Network issues

**Solution:**
- Verify secret is set correctly
- Check Codecov service status
- Review workflow logs

#### 3. Deployment Fails

**Possible Causes:**
- Missing secrets
- Insufficient funds
- Network issues

**Solution:**
- Verify all required secrets are set
- Check wallet balance
- Verify RPC URLs are correct

#### 4. Prettier Check Fails

**Solution:**
```bash
# Auto-fix formatting issues
npm run format

# Verify fixes
npm run format:check
```

#### 5. Solhint Errors

**Solution:**
```bash
# Review errors
npm run lint:sol

# Fix manually based on output
# Update .solhint.json if needed
```

---

## 📈 Workflow Optimization

### Caching

All workflows use npm cache:

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

**Benefits:**
- Faster dependency installation
- Reduced network usage
- Improved workflow speed

### Artifact Retention

| Artifact Type | Retention | Purpose |
|---------------|-----------|---------|
| Coverage Reports | 30 days | Analysis |
| Gas Reports | 30 days | Optimization |
| Deployment Files | 90 days | Reference |
| Release Artifacts | Permanent | Distribution |

---

## 🎯 Best Practices

### 1. Commit Messages

Use conventional commits:
```
feat: add new feature
fix: resolve bug
docs: update documentation
test: add tests
ci: update workflows
```

### 2. Pull Requests

- Keep PRs focused and small
- Wait for all checks to pass
- Request reviews
- Update based on feedback

### 3. Testing

- Write tests for new features
- Maintain coverage >80%
- Test edge cases
- Run tests locally before pushing

### 4. Security

- Never commit secrets
- Use environment variables
- Keep dependencies updated
- Review security audits

---

## 📞 Support

### Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Codecov Docs**: https://docs.codecov.com/
- **Hardhat CI**: https://hardhat.org/hardhat-runner/docs/guides/continuous-integration

### Getting Help

1. Check workflow logs
2. Review this documentation
3. Search GitHub issues
4. Ask in discussions

---

## 📝 Changelog

### Version 1.0.0

- ✅ Initial CI/CD setup
- ✅ Multi-platform testing
- ✅ Coverage integration
- ✅ Deployment automation
- ✅ Security audits
- ✅ Gas reporting

---

**CI/CD Status:** ✅ Fully Configured

**Last Updated:** 2024

**Maintained By:** Privacy Evidence Manager Team

---

*Automated workflows ensure code quality and reliability.*
