const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("PrivacyEvidenceManager - Comprehensive Test Suite", function () {
  // Deployment fixture for test isolation
  async function deployFixture() {
    const [owner, judge1, judge2, reviewer1, reviewer2, submitter1, submitter2, user1, user2] = await ethers.getSigners();

    const PrivacyEvidenceManager = await ethers.getContractFactory("PrivacyEvidenceManager");
    const evidenceManager = await PrivacyEvidenceManager.deploy();
    await evidenceManager.waitForDeployment();
    const contractAddress = await evidenceManager.getAddress();

    return {
      evidenceManager,
      contractAddress,
      owner,
      judge1,
      judge2,
      reviewer1,
      reviewer2,
      submitter1,
      submitter2,
      user1,
      user2
    };
  }

  describe("Deployment and Initialization", function () {
    it("should deploy successfully with valid address", async function () {
      const { evidenceManager, contractAddress } = await loadFixture(deployFixture);
      expect(contractAddress).to.be.properAddress;
      expect(contractAddress).to.not.equal(ethers.ZeroAddress);
    });

    it("should set correct owner address", async function () {
      const { evidenceManager, owner } = await loadFixture(deployFixture);
      expect(await evidenceManager.owner()).to.equal(owner.address);
    });

    it("should authorize deployer as both judge and reviewer", async function () {
      const { evidenceManager, owner } = await loadFixture(deployFixture);
      expect(await evidenceManager.isJudge(owner.address)).to.be.true;
      expect(await evidenceManager.isReviewer(owner.address)).to.be.true;
    });

    it("should initialize all counters to zero", async function () {
      const { evidenceManager } = await loadFixture(deployFixture);
      const stats = await evidenceManager.getTotalStats();
      expect(stats[0]).to.equal(0); // caseCount
      expect(stats[1]).to.equal(0); // evidenceCount
      expect(stats[2]).to.equal(0); // requestCount
    });

    it("should not authorize random addresses", async function () {
      const { evidenceManager, user1 } = await loadFixture(deployFixture);
      expect(await evidenceManager.isJudge(user1.address)).to.be.false;
      expect(await evidenceManager.isReviewer(user1.address)).to.be.false;
    });
  });

  describe("Authorization Management - Judges", function () {
    it("should allow owner to authorize new judge", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);
      expect(await evidenceManager.isJudge(judge1.address)).to.be.true;
    });

    it("should allow owner to authorize multiple judges", async function () {
      const { evidenceManager, judge1, judge2 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);
      await evidenceManager.authorizeJudge(judge2.address);
      expect(await evidenceManager.isJudge(judge1.address)).to.be.true;
      expect(await evidenceManager.isJudge(judge2.address)).to.be.true;
    });

    it("should reject non-owner from authorizing judge", async function () {
      const { evidenceManager, user1, judge1 } = await loadFixture(deployFixture);
      await expect(
        evidenceManager.connect(user1).authorizeJudge(judge1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("should reject zero address for judge", async function () {
      const { evidenceManager } = await loadFixture(deployFixture);
      await expect(
        evidenceManager.authorizeJudge(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });

    it("should allow owner to revoke judge", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);
      await evidenceManager.revokeJudge(judge1.address);
      expect(await evidenceManager.isJudge(judge1.address)).to.be.false;
    });

    it("should not allow revoking owner as judge", async function () {
      const { evidenceManager, owner } = await loadFixture(deployFixture);
      await expect(
        evidenceManager.revokeJudge(owner.address)
      ).to.be.revertedWith("Cannot revoke owner");
    });
  });

  describe("Authorization Management - Reviewers", function () {
    it("should allow owner to authorize new reviewer", async function () {
      const { evidenceManager, reviewer1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeReviewer(reviewer1.address);
      expect(await evidenceManager.isReviewer(reviewer1.address)).to.be.true;
    });

    it("should allow owner to authorize multiple reviewers", async function () {
      const { evidenceManager, reviewer1, reviewer2 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeReviewer(reviewer1.address);
      await evidenceManager.authorizeReviewer(reviewer2.address);
      expect(await evidenceManager.isReviewer(reviewer1.address)).to.be.true;
      expect(await evidenceManager.isReviewer(reviewer2.address)).to.be.true;
    });

    it("should reject non-owner from authorizing reviewer", async function () {
      const { evidenceManager, user1, reviewer1 } = await loadFixture(deployFixture);
      await expect(
        evidenceManager.connect(user1).authorizeReviewer(reviewer1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("should reject zero address for reviewer", async function () {
      const { evidenceManager } = await loadFixture(deployFixture);
      await expect(
        evidenceManager.authorizeReviewer(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });

    it("should allow owner to revoke reviewer", async function () {
      const { evidenceManager, reviewer1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeReviewer(reviewer1.address);
      await evidenceManager.revokeReviewer(reviewer1.address);
      expect(await evidenceManager.isReviewer(reviewer1.address)).to.be.false;
    });

    it("should not allow revoking owner as reviewer", async function () {
      const { evidenceManager, owner } = await loadFixture(deployFixture);
      await expect(
        evidenceManager.revokeReviewer(owner.address)
      ).to.be.revertedWith("Cannot revoke owner");
    });
  });

  describe("Case Management - Creation", function () {
    it("should allow authorized judge to create case", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      const tx = await evidenceManager.connect(judge1).createCase("Criminal Investigation", 2);
      await tx.wait();

      const stats = await evidenceManager.getTotalStats();
      expect(stats[0]).to.equal(1);
    });

    it("should emit CaseCreated event with correct parameters", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await expect(evidenceManager.connect(judge1).createCase("Test Case", 1))
        .to.emit(evidenceManager, "CaseCreated")
        .withArgs(1, "Test Case", judge1.address);
    });

    it("should reject case creation from non-judge", async function () {
      const { evidenceManager, user1 } = await loadFixture(deployFixture);
      await expect(
        evidenceManager.connect(user1).createCase("Test Case", 1)
      ).to.be.revertedWith("Not authorized judge");
    });

    it("should reject case with empty title", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await expect(
        evidenceManager.connect(judge1).createCase("", 1)
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("should auto-grant access to case creator", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);

      expect(await evidenceManager.hasAccessToCase(judge1.address, 1)).to.be.true;
    });

    it("should create multiple cases with incremental IDs", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Case 1", 0);
      await evidenceManager.connect(judge1).createCase("Case 2", 1);
      await evidenceManager.connect(judge1).createCase("Case 3", 2);

      const stats = await evidenceManager.getTotalStats();
      expect(stats[0]).to.equal(3);
    });

    it("should store case creation timestamp", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      const beforeTime = await time.latest();
      await evidenceManager.connect(judge1).createCase("Test Case", 1);

      const caseInfo = await evidenceManager.connect(judge1).getCaseBasicInfo(1);
      expect(caseInfo[3]).to.be.gte(beforeTime);
    });
  });

  describe("Case Management - Closing and Reopening", function () {
    it("should allow judge to close their own case", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await evidenceManager.connect(judge1).closeCase(1);

      const caseInfo = await evidenceManager.connect(judge1).getCaseBasicInfo(1);
      expect(caseInfo[4]).to.be.true; // isClosed
    });

    it("should reject closing case by different judge", async function () {
      const { evidenceManager, owner, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(owner).createCase("Test Case", 1);

      await expect(
        evidenceManager.connect(judge1).closeCase(1)
      ).to.be.revertedWith("Not case judge");
    });

    it("should reject closing already closed case", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await evidenceManager.connect(judge1).closeCase(1);

      await expect(
        evidenceManager.connect(judge1).closeCase(1)
      ).to.be.revertedWith("Already closed");
    });

    it("should allow judge to reopen their closed case", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await evidenceManager.connect(judge1).closeCase(1);
      await evidenceManager.connect(judge1).reopenCase(1);

      const caseInfo = await evidenceManager.connect(judge1).getCaseBasicInfo(1);
      expect(caseInfo[4]).to.be.false; // isClosed
    });

    it("should reject reopening case that is not closed", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);

      await expect(
        evidenceManager.connect(judge1).reopenCase(1)
      ).to.be.revertedWith("Case not closed");
    });
  });

  describe("Evidence Submission", function () {
    it("should allow authorized user to submit evidence", async function () {
      const { evidenceManager, judge1, submitter1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await evidenceManager.connect(judge1).grantAccess(submitter1.address, 1);

      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      await expect(
        evidenceManager.connect(submitter1).submitEvidence(
          1, // caseId
          0, // Document
          1, // Restricted
          evidenceHash,
          1024,
          "ipfs://test"
        )
      ).to.emit(evidenceManager, "EvidenceSubmitted");

      const stats = await evidenceManager.getTotalStats();
      expect(stats[1]).to.equal(1);
    });

    it("should reject evidence submission to closed case", async function () {
      const { evidenceManager, judge1, submitter1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await evidenceManager.connect(judge1).grantAccess(submitter1.address, 1);
      await evidenceManager.connect(judge1).closeCase(1);

      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      await expect(
        evidenceManager.connect(submitter1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test")
      ).to.be.revertedWith("Case closed");
    });

    it("should reject evidence from unauthorized user", async function () {
      const { evidenceManager, judge1, user1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);

      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      await expect(
        evidenceManager.connect(user1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test")
      ).to.be.revertedWith("No access");
    });

    it("should reject evidence with invalid hash", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);

      await expect(
        evidenceManager.connect(judge1).submitEvidence(1, 0, 1, ethers.ZeroHash, 1024, "ipfs://test")
      ).to.be.revertedWith("Invalid hash");
    });

    it("should reject evidence with zero size", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      await expect(
        evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 0, "ipfs://test")
      ).to.be.revertedWith("Invalid size");
    });

    it("should allow judges to submit evidence without explicit access", async function () {
      const { evidenceManager, judge1, judge2 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);
      await evidenceManager.authorizeJudge(judge2.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      await expect(
        evidenceManager.connect(judge2).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test")
      ).to.not.be.reverted;
    });
  });

  describe("Evidence Review", function () {
    it("should allow reviewer to approve evidence", async function () {
      const { evidenceManager, judge1, reviewer1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);
      await evidenceManager.authorizeReviewer(reviewer1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      await evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test");

      await expect(
        evidenceManager.connect(reviewer1).reviewEvidence(1, 2) // Approved
      ).to.emit(evidenceManager, "EvidenceReviewed")
        .withArgs(1, reviewer1.address, 2);
    });

    it("should allow reviewer to reject evidence", async function () {
      const { evidenceManager, judge1, reviewer1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);
      await evidenceManager.authorizeReviewer(reviewer1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      await evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test");

      await expect(
        evidenceManager.connect(reviewer1).reviewEvidence(1, 3) // Rejected
      ).to.emit(evidenceManager, "EvidenceReviewed")
        .withArgs(1, reviewer1.address, 3);
    });

    it("should reject review from non-reviewer", async function () {
      const { evidenceManager, judge1, user1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      await evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test");

      await expect(
        evidenceManager.connect(user1).reviewEvidence(1, 2)
      ).to.be.revertedWith("Not authorized reviewer");
    });

    it("should reject reviewing sealed evidence", async function () {
      const { evidenceManager, judge1, reviewer1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);
      await evidenceManager.authorizeReviewer(reviewer1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      await evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test");
      await evidenceManager.connect(judge1).sealEvidence(1);

      await expect(
        evidenceManager.connect(reviewer1).reviewEvidence(1, 2)
      ).to.be.revertedWith("Evidence is sealed");
    });
  });

  describe("Evidence Sealing", function () {
    it("should allow judge to seal evidence", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      await evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test");

      await evidenceManager.connect(judge1).sealEvidence(1);

      const evidenceInfo = await evidenceManager.connect(judge1).getEvidenceBasicInfo(1);
      expect(evidenceInfo[5]).to.be.true; // isSealed
    });

    it("should reject sealing already sealed evidence", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      await evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test");

      await evidenceManager.connect(judge1).sealEvidence(1);

      await expect(
        evidenceManager.connect(judge1).sealEvidence(1)
      ).to.be.revertedWith("Already sealed");
    });
  });

  describe("Access Control", function () {
    it("should allow judge to grant access", async function () {
      const { evidenceManager, judge1, user1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);

      await expect(
        evidenceManager.connect(judge1).grantAccess(user1.address, 1)
      ).to.emit(evidenceManager, "AccessGranted")
        .withArgs(user1.address, 1);

      expect(await evidenceManager.hasAccessToCase(user1.address, 1)).to.be.true;
    });

    it("should allow judge to revoke access", async function () {
      const { evidenceManager, judge1, user1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await evidenceManager.connect(judge1).grantAccess(user1.address, 1);
      await evidenceManager.connect(judge1).revokeAccess(user1.address, 1);

      expect(await evidenceManager.hasAccessToCase(user1.address, 1)).to.be.false;
    });

    it("should reject unauthorized user from viewing case info", async function () {
      const { evidenceManager, judge1, user1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);

      await expect(
        evidenceManager.connect(user1).getCaseBasicInfo(1)
      ).to.be.revertedWith("No access");
    });

    it("should allow user with access to view case info", async function () {
      const { evidenceManager, judge1, user1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await evidenceManager.connect(judge1).grantAccess(user1.address, 1);

      const caseInfo = await evidenceManager.connect(user1).getCaseBasicInfo(1);
      expect(caseInfo[1]).to.equal("Test Case");
    });
  });

  describe("Gas Optimization", function () {
    it("should create case with reasonable gas cost", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      const tx = await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(200000); // Less than 200k gas
    });

    it("should submit evidence with reasonable gas cost", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      const tx = await evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test");
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(300000); // Less than 300k gas
    });

    it("should review evidence with minimal gas", async function () {
      const { evidenceManager, judge1, reviewer1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);
      await evidenceManager.authorizeReviewer(reviewer1.address);

      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      await evidenceManager.connect(judge1).submitEvidence(1, 0, 1, evidenceHash, 1024, "ipfs://test");

      const tx = await evidenceManager.connect(reviewer1).reviewEvidence(1, 2);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(100000); // Less than 100k gas
    });
  });

  describe("Edge Cases", function () {
    it("should handle invalid case ID", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await expect(
        evidenceManager.connect(judge1).closeCase(999)
      ).to.be.revertedWith("Invalid case");
    });

    it("should handle invalid evidence ID", async function () {
      const { evidenceManager, reviewer1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeReviewer(reviewer1.address);

      await expect(
        evidenceManager.connect(reviewer1).reviewEvidence(999, 2)
      ).to.be.revertedWith("Invalid evidence");
    });

    it("should handle maximum access level", async function () {
      const { evidenceManager, judge1 } = await loadFixture(deployFixture);
      await evidenceManager.authorizeJudge(judge1.address);

      await expect(
        evidenceManager.connect(judge1).createCase("Top Secret Case", 3) // TopSecret
      ).to.not.be.reverted;
    });
  });
});
