const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║   Privacy Evidence Manager - Simulation Script                ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝\n");

  const network = hre.network.name;
  const [deployer, judge1, judge2, reviewer1, submitter1, submitter2] = await hre.ethers.getSigners();

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments", `${network}_deployment.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Error: No deployment file found for network '${network}'`);
    console.error(`   Expected file: ${deploymentFile}`);
    console.error(`   Please deploy the contract first using: npm run deploy\n`);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log("📋 Simulation Setup:");
  console.log("─────────────────────────────────────────────────────────────────");
  console.log(`Network:          ${network}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Deployer:         ${deployer.address}`);
  console.log(`Judge 1:          ${judge1.address}`);
  console.log(`Judge 2:          ${judge2.address}`);
  console.log(`Reviewer 1:       ${reviewer1.address}`);
  console.log(`Submitter 1:      ${submitter1.address}`);
  console.log(`Submitter 2:      ${submitter2.address}`);
  console.log("─────────────────────────────────────────────────────────────────\n");

  // Connect to contract
  const PrivacyEvidenceManager = await hre.ethers.getContractFactory("PrivacyEvidenceManager");
  const contract = PrivacyEvidenceManager.attach(contractAddress);

  console.log("🎬 Starting Simulation Scenarios...\n");

  try {
    // Scenario 1: Authorize additional judges and reviewers
    console.log("📝 Scenario 1: Authorizing Judges and Reviewers");
    console.log("─────────────────────────────────────────────────────────────────");

    let tx = await contract.connect(deployer).authorizeJudge(judge1.address);
    await tx.wait();
    console.log(`✅ Authorized Judge 1: ${judge1.address}`);

    tx = await contract.connect(deployer).authorizeJudge(judge2.address);
    await tx.wait();
    console.log(`✅ Authorized Judge 2: ${judge2.address}`);

    tx = await contract.connect(deployer).authorizeReviewer(reviewer1.address);
    await tx.wait();
    console.log(`✅ Authorized Reviewer 1: ${reviewer1.address}\n`);

    // Scenario 2: Create multiple cases
    console.log("📝 Scenario 2: Creating Legal Cases");
    console.log("─────────────────────────────────────────────────────────────────");

    tx = await contract.connect(judge1).createCase("Criminal Investigation - Case 001", 2); // Confidential
    let receipt = await tx.wait();
    const case1Id = await getCaseIdFromReceipt(receipt, contract);
    console.log(`✅ Created Case 1 (ID: ${case1Id}): Criminal Investigation - Case 001`);
    console.log(`   Access Level: Confidential`);
    console.log(`   Judge: ${judge1.address}`);

    tx = await contract.connect(judge2).createCase("Civil Dispute - Case 002", 1); // Restricted
    receipt = await tx.wait();
    const case2Id = await getCaseIdFromReceipt(receipt, contract);
    console.log(`✅ Created Case 2 (ID: ${case2Id}): Civil Dispute - Case 002`);
    console.log(`   Access Level: Restricted`);
    console.log(`   Judge: ${judge2.address}\n`);

    // Scenario 3: Grant access to submitters
    console.log("📝 Scenario 3: Granting Case Access");
    console.log("─────────────────────────────────────────────────────────────────");

    tx = await contract.connect(judge1).grantAccess(submitter1.address, case1Id);
    await tx.wait();
    console.log(`✅ Granted access to Submitter 1 for Case ${case1Id}`);

    tx = await contract.connect(judge2).grantAccess(submitter2.address, case2Id);
    await tx.wait();
    console.log(`✅ Granted access to Submitter 2 for Case ${case2Id}\n`);

    // Scenario 4: Submit evidence
    console.log("📝 Scenario 4: Submitting Evidence");
    console.log("─────────────────────────────────────────────────────────────────");

    // Evidence for Case 1
    const evidence1Hash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("Evidence document 1 - Surveillance footage"));
    tx = await contract.connect(submitter1).submitEvidence(
      case1Id,
      2, // EvidenceType.Video
      2, // AccessLevel.Confidential
      evidence1Hash,
      524288, // 512 KB
      "ipfs://QmExample1234567890VideoEvidence"
    );
    receipt = await tx.wait();
    const evidence1Id = await getEvidenceIdFromReceipt(receipt, contract);
    console.log(`✅ Evidence 1 (ID: ${evidence1Id}) submitted to Case ${case1Id}`);
    console.log(`   Type: Video`);
    console.log(`   Size: 512 KB`);
    console.log(`   Metadata: ipfs://QmExample1234567890VideoEvidence`);

    const evidence2Hash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("Evidence document 2 - Financial records"));
    tx = await contract.connect(submitter1).submitEvidence(
      case1Id,
      0, // EvidenceType.Document
      3, // AccessLevel.TopSecret
      evidence2Hash,
      102400, // 100 KB
      "ipfs://QmExample0987654321FinancialDocs"
    );
    receipt = await tx.wait();
    const evidence2Id = await getEvidenceIdFromReceipt(receipt, contract);
    console.log(`✅ Evidence 2 (ID: ${evidence2Id}) submitted to Case ${case1Id}`);
    console.log(`   Type: Document`);
    console.log(`   Size: 100 KB`);
    console.log(`   Metadata: ipfs://QmExample0987654321FinancialDocs`);

    // Evidence for Case 2
    const evidence3Hash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("Evidence document 3 - Contract agreement"));
    tx = await contract.connect(submitter2).submitEvidence(
      case2Id,
      0, // EvidenceType.Document
      1, // AccessLevel.Restricted
      evidence3Hash,
      51200, // 50 KB
      "ipfs://QmExampleContractAgreement123"
    );
    receipt = await tx.wait();
    const evidence3Id = await getEvidenceIdFromReceipt(receipt, contract);
    console.log(`✅ Evidence 3 (ID: ${evidence3Id}) submitted to Case ${case2Id}`);
    console.log(`   Type: Document`);
    console.log(`   Size: 50 KB`);
    console.log(`   Metadata: ipfs://QmExampleContractAgreement123\n`);

    // Scenario 5: Review evidence
    console.log("📝 Scenario 5: Reviewing Evidence");
    console.log("─────────────────────────────────────────────────────────────────");

    tx = await contract.connect(reviewer1).reviewEvidence(evidence1Id, 2); // Approved
    await tx.wait();
    console.log(`✅ Evidence ${evidence1Id} reviewed: Approved`);

    tx = await contract.connect(reviewer1).reviewEvidence(evidence2Id, 2); // Approved
    await tx.wait();
    console.log(`✅ Evidence ${evidence2Id} reviewed: Approved`);

    tx = await contract.connect(reviewer1).reviewEvidence(evidence3Id, 3); // Rejected
    await tx.wait();
    console.log(`✅ Evidence ${evidence3Id} reviewed: Rejected\n`);

    // Scenario 6: Seal sensitive evidence
    console.log("📝 Scenario 6: Sealing Sensitive Evidence");
    console.log("─────────────────────────────────────────────────────────────────");

    tx = await contract.connect(judge1).sealEvidence(evidence2Id);
    await tx.wait();
    console.log(`✅ Evidence ${evidence2Id} sealed by Judge 1`);
    console.log(`   Reason: Contains highly sensitive financial information\n`);

    // Scenario 7: Retrieve case and evidence information
    console.log("📝 Scenario 7: Retrieving Information");
    console.log("─────────────────────────────────────────────────────────────────");

    const caseInfo = await contract.connect(judge1).getCaseBasicInfo(case1Id);
    console.log(`📁 Case ${case1Id} Information:`);
    console.log(`   Title: ${caseInfo[1]}`);
    console.log(`   Judge: ${caseInfo[2]}`);
    console.log(`   Created: ${new Date(Number(caseInfo[3]) * 1000).toLocaleString()}`);
    console.log(`   Closed: ${caseInfo[4]}`);
    console.log(`   Min Access Level: ${caseInfo[5]}`);

    const evidenceInfo = await contract.connect(judge1).getEvidenceBasicInfo(evidence1Id);
    console.log(`\n📎 Evidence ${evidence1Id} Information:`);
    console.log(`   Case ID: ${evidenceInfo[1]}`);
    console.log(`   Type: ${evidenceInfo[2]}`);
    console.log(`   Status: ${evidenceInfo[3]}`);
    console.log(`   Access Level: ${evidenceInfo[4]}`);
    console.log(`   Sealed: ${evidenceInfo[5]}\n`);

    // Final statistics
    console.log("📊 Final Statistics");
    console.log("─────────────────────────────────────────────────────────────────");
    const stats = await contract.getTotalStats();
    console.log(`Total Cases Created:      ${stats[0]}`);
    console.log(`Total Evidence Submitted: ${stats[1]}`);
    console.log(`Total Access Requests:    ${stats[2]}`);
    console.log("─────────────────────────────────────────────────────────────────\n");

    console.log("✅ All Simulation Scenarios Completed Successfully!\n");

    // Save simulation results
    const simulationResults = {
      network: network,
      timestamp: new Date().toISOString(),
      cases: [
        { id: case1Id.toString(), title: "Criminal Investigation - Case 001", judge: judge1.address },
        { id: case2Id.toString(), title: "Civil Dispute - Case 002", judge: judge2.address },
      ],
      evidence: [
        { id: evidence1Id.toString(), caseId: case1Id.toString(), type: "Video", status: "Approved" },
        { id: evidence2Id.toString(), caseId: case1Id.toString(), type: "Document", status: "Sealed" },
        { id: evidence3Id.toString(), caseId: case2Id.toString(), type: "Document", status: "Rejected" },
      ],
      statistics: {
        totalCases: stats[0].toString(),
        totalEvidence: stats[1].toString(),
        totalRequests: stats[2].toString(),
      },
    };

    const simulationsDir = path.join(__dirname, "..", "simulations");
    if (!fs.existsSync(simulationsDir)) {
      fs.mkdirSync(simulationsDir, { recursive: true });
    }

    const simulationFile = path.join(simulationsDir, `${network}_simulation_${Date.now()}.json`);
    fs.writeFileSync(simulationFile, JSON.stringify(simulationResults, null, 2));

    console.log("💾 Simulation results saved to:");
    console.log(`   ${simulationFile}\n`);

  } catch (error) {
    console.error("❌ Simulation Failed:");
    console.error(error.message);
    if (error.data) {
      console.error("Error Data:", error.data);
    }
    process.exit(1);
  }

  console.log("🎉 Simulation Complete!\n");
}

async function getCaseIdFromReceipt(receipt, contract) {
  const event = receipt.logs.find(log => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed.name === "CaseCreated";
    } catch (e) {
      return false;
    }
  });

  if (event) {
    const parsedEvent = contract.interface.parseLog(event);
    return parsedEvent.args.caseId;
  }
  throw new Error("CaseCreated event not found");
}

async function getEvidenceIdFromReceipt(receipt, contract) {
  const event = receipt.logs.find(log => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed.name === "EvidenceSubmitted";
    } catch (e) {
      return false;
    }
  });

  if (event) {
    const parsedEvent = contract.interface.parseLog(event);
    return parsedEvent.args.evidenceId;
  }
  throw new Error("EvidenceSubmitted event not found");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:");
    console.error(error);
    process.exit(1);
  });
