const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrivacyEvidenceManager", function () {
  let evidenceManager;
  let owner, judge1, reviewer1, submitter1, user1;

  beforeEach(async function () {
    [owner, judge1, reviewer1, submitter1, user1] = await ethers.getSigners();

    const PrivacyEvidenceManager = await ethers.getContractFactory("PrivacyEvidenceManager");
    evidenceManager = await PrivacyEvidenceManager.deploy();
    await evidenceManager.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await evidenceManager.owner()).to.equal(owner.address);
    });

    it("Should authorize deployer as judge and reviewer", async function () {
      expect(await evidenceManager.authorizedJudges(owner.address)).to.be.true;
      expect(await evidenceManager.authorizedReviewers(owner.address)).to.be.true;
    });

    it("Should initialize counters to zero", async function () {
      const stats = await evidenceManager.getTotalStats();
      expect(stats[0]).to.equal(0); // caseCount
      expect(stats[1]).to.equal(0); // evidenceCount
      expect(stats[2]).to.equal(0); // requestCount
    });
  });

  describe("Authorization Management", function () {
    it("Should allow owner to authorize judges", async function () {
      await evidenceManager.authorizeJudge(judge1.address);
      expect(await evidenceManager.authorizedJudges(judge1.address)).to.be.true;
    });

    it("Should allow owner to authorize reviewers", async function () {
      await evidenceManager.authorizeReviewer(reviewer1.address);
      expect(await evidenceManager.authorizedReviewers(reviewer1.address)).to.be.true;
    });

    it("Should reject non-owner from authorizing judges", async function () {
      await expect(
        evidenceManager.connect(user1).authorizeJudge(judge1.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject non-owner from authorizing reviewers", async function () {
      await expect(
        evidenceManager.connect(user1).authorizeReviewer(reviewer1.address)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Case Management", function () {
    beforeEach(async function () {
      await evidenceManager.authorizeJudge(judge1.address);
    });

    it("Should allow judge to create case", async function () {
      const tx = await evidenceManager.connect(judge1).createCase("Test Case", 1);
      const receipt = await tx.wait();

      const stats = await evidenceManager.getTotalStats();
      expect(stats[0]).to.equal(1); // caseCount should be 1
    });

    it("Should emit CaseCreated event", async function () {
      await expect(evidenceManager.connect(judge1).createCase("Test Case", 1))
        .to.emit(evidenceManager, "CaseCreated")
        .withArgs(1, "Test Case", judge1.address);
    });

    it("Should reject non-judge from creating case", async function () {
      await expect(
        evidenceManager.connect(user1).createCase("Test Case", 1)
      ).to.be.revertedWith("Not authorized judge");
    });

    it("Should allow judge to close their case", async function () {
      await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await evidenceManager.connect(judge1).closeCase(1);

      const caseInfo = await evidenceManager.connect(judge1).getCaseBasicInfo(1);
      expect(caseInfo[4]).to.be.true; // isClosed
    });

    it("Should reject judge from closing another judge's case", async function () {
      await evidenceManager.connect(owner).createCase("Test Case", 1);
      await expect(
        evidenceManager.connect(judge1).closeCase(1)
      ).to.be.revertedWith("Not case judge");
    });
  });

  describe("Evidence Management", function () {
    let caseId;

    beforeEach(async function () {
      await evidenceManager.authorizeJudge(judge1.address);
      const tx = await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await tx.wait();
      caseId = 1;

      // Grant access to submitter
      await evidenceManager.connect(judge1).grantAccess(submitter1.address, caseId);
    });

    it("Should allow authorized user to submit evidence", async function () {
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      await expect(
        evidenceManager.connect(submitter1).submitEvidence(
          caseId,
          0, // Document
          1, // Restricted
          evidenceHash,
          1024,
          "ipfs://test"
        )
      ).to.emit(evidenceManager, "EvidenceSubmitted");

      const stats = await evidenceManager.getTotalStats();
      expect(stats[1]).to.equal(1); // evidenceCount should be 1
    });

    it("Should reject evidence submission to closed case", async function () {
      await evidenceManager.connect(judge1).closeCase(caseId);

      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      await expect(
        evidenceManager.connect(submitter1).submitEvidence(
          caseId,
          0,
          1,
          evidenceHash,
          1024,
          "ipfs://test"
        )
      ).to.be.revertedWith("Case closed");
    });

    it("Should reject unauthorized user from submitting evidence", async function () {
      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));

      await expect(
        evidenceManager.connect(user1).submitEvidence(
          caseId,
          0,
          1,
          evidenceHash,
          1024,
          "ipfs://test"
        )
      ).to.be.revertedWith("No access");
    });
  });

  describe("Evidence Review", function () {
    let evidenceId;

    beforeEach(async function () {
      await evidenceManager.authorizeJudge(judge1.address);
      await evidenceManager.authorizeReviewer(reviewer1.address);

      const tx = await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await tx.wait();

      await evidenceManager.connect(judge1).grantAccess(submitter1.address, 1);

      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      const tx2 = await evidenceManager.connect(submitter1).submitEvidence(
        1,
        0,
        1,
        evidenceHash,
        1024,
        "ipfs://test"
      );
      await tx2.wait();
      evidenceId = 1;
    });

    it("Should allow reviewer to approve evidence", async function () {
      await expect(
        evidenceManager.connect(reviewer1).reviewEvidence(evidenceId, 2) // Approved
      ).to.emit(evidenceManager, "EvidenceReviewed")
        .withArgs(evidenceId, reviewer1.address, 2);
    });

    it("Should allow reviewer to reject evidence", async function () {
      await expect(
        evidenceManager.connect(reviewer1).reviewEvidence(evidenceId, 3) // Rejected
      ).to.emit(evidenceManager, "EvidenceReviewed")
        .withArgs(evidenceId, reviewer1.address, 3);
    });

    it("Should reject non-reviewer from reviewing evidence", async function () {
      await expect(
        evidenceManager.connect(user1).reviewEvidence(evidenceId, 2)
      ).to.be.revertedWith("Not authorized reviewer");
    });

    it("Should allow judge to seal evidence", async function () {
      await evidenceManager.connect(judge1).sealEvidence(evidenceId);

      const evidenceInfo = await evidenceManager.connect(judge1).getEvidenceBasicInfo(evidenceId);
      expect(evidenceInfo[5]).to.be.true; // isSealed
    });
  });

  describe("Access Control", function () {
    let caseId;

    beforeEach(async function () {
      await evidenceManager.authorizeJudge(judge1.address);
      const tx = await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await tx.wait();
      caseId = 1;
    });

    it("Should allow judge to grant access", async function () {
      await evidenceManager.connect(judge1).grantAccess(user1.address, caseId);
      expect(await evidenceManager.hasAccess(user1.address, caseId)).to.be.true;
    });

    it("Should reject unauthorized user from viewing case info", async function () {
      await expect(
        evidenceManager.connect(user1).getCaseBasicInfo(caseId)
      ).to.be.revertedWith("No access");
    });

    it("Should allow user with access to view case info", async function () {
      await evidenceManager.connect(judge1).grantAccess(user1.address, caseId);

      const caseInfo = await evidenceManager.connect(user1).getCaseBasicInfo(caseId);
      expect(caseInfo[1]).to.equal("Test Case");
    });
  });

  describe("Information Retrieval", function () {
    let caseId, evidenceId;

    beforeEach(async function () {
      await evidenceManager.authorizeJudge(judge1.address);

      const tx = await evidenceManager.connect(judge1).createCase("Test Case", 1);
      await tx.wait();
      caseId = 1;

      await evidenceManager.connect(judge1).grantAccess(submitter1.address, caseId);

      const evidenceHash = ethers.keccak256(ethers.toUtf8Bytes("test evidence"));
      const tx2 = await evidenceManager.connect(submitter1).submitEvidence(
        caseId,
        0,
        1,
        evidenceHash,
        1024,
        "ipfs://test"
      );
      await tx2.wait();
      evidenceId = 1;
    });

    it("Should retrieve case basic info", async function () {
      const caseInfo = await evidenceManager.connect(judge1).getCaseBasicInfo(caseId);

      expect(caseInfo[0]).to.equal(caseId); // caseId
      expect(caseInfo[1]).to.equal("Test Case"); // title
      expect(caseInfo[2]).to.equal(judge1.address); // judge
      expect(caseInfo[4]).to.be.false; // isClosed
    });

    it("Should retrieve evidence basic info", async function () {
      const evidenceInfo = await evidenceManager.connect(judge1).getEvidenceBasicInfo(evidenceId);

      expect(evidenceInfo[0]).to.equal(evidenceId); // evidenceId
      expect(evidenceInfo[1]).to.equal(caseId); // caseId
      expect(evidenceInfo[2]).to.equal(0); // Document type
      expect(evidenceInfo[3]).to.equal(0); // Submitted status
    });

    it("Should retrieve evidence details", async function () {
      const details = await evidenceManager.connect(judge1).getEvidenceDetails(evidenceId);

      expect(details[0]).to.equal(submitter1.address); // submitter
      expect(details[2]).to.equal("ipfs://test"); // metadataURI
    });

    it("Should retrieve total statistics", async function () {
      const stats = await evidenceManager.getTotalStats();

      expect(stats[0]).to.equal(1); // caseCount
      expect(stats[1]).to.equal(1); // evidenceCount
    });
  });
});
