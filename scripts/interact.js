const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║   Privacy Evidence Manager - Interaction Script               ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝\n");

  const network = hre.network.name;
  const [signer] = await hre.ethers.getSigners();

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

  console.log("📋 Contract Information:");
  console.log("─────────────────────────────────────────────────────────────────");
  console.log(`Network:          ${network}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Signer Address:   ${signer.address}`);
  console.log("─────────────────────────────────────────────────────────────────\n");

  // Connect to contract
  const PrivacyEvidenceManager = await hre.ethers.getContractFactory("PrivacyEvidenceManager");
  const contract = PrivacyEvidenceManager.attach(contractAddress);

  console.log("🔍 Fetching Contract State...\n");

  try {
    // Get owner
    const owner = await contract.owner();
    console.log("📊 Contract State:");
    console.log("─────────────────────────────────────────────────────────────────");
    console.log(`Owner:            ${owner}`);

    // Get stats
    const stats = await contract.getTotalStats();
    console.log(`Total Cases:      ${stats[0].toString()}`);
    console.log(`Total Evidence:   ${stats[1].toString()}`);
    console.log(`Total Requests:   ${stats[2].toString()}`);
    console.log("─────────────────────────────────────────────────────────────────\n");

    // Example interactions (uncomment to use)
    console.log("📝 Available Interactions:\n");
    console.log("1. Create Case:");
    console.log("   const tx = await contract.createCase('Case Title', 0);");
    console.log("   await tx.wait();\n");

    console.log("2. Submit Evidence:");
    console.log("   const tx = await contract.submitEvidence(");
    console.log("     caseId,");
    console.log("     0, // EvidenceType.Document");
    console.log("     1, // AccessLevel.Restricted");
    console.log("     ethers.keccak256(ethers.toUtf8Bytes('evidence data')),");
    console.log("     1024, // size in bytes");
    console.log("     'ipfs://...' // metadata URI");
    console.log("   );");
    console.log("   await tx.wait();\n");

    console.log("3. Authorize Judge:");
    console.log("   const tx = await contract.authorizeJudge(judgeAddress);");
    console.log("   await tx.wait();\n");

    console.log("4. Authorize Reviewer:");
    console.log("   const tx = await contract.authorizeReviewer(reviewerAddress);");
    console.log("   await tx.wait();\n");

    console.log("5. Review Evidence:");
    console.log("   const tx = await contract.reviewEvidence(evidenceId, 2); // 2 = Approved");
    console.log("   await tx.wait();\n");

    console.log("6. Grant Access:");
    console.log("   const tx = await contract.grantAccess(userAddress, caseId);");
    console.log("   await tx.wait();\n");

    // Uncomment to create a test case
    /*
    console.log("🚀 Creating a test case...\n");
    const createCaseTx = await contract.createCase("Test Case - Investigation", 1); // AccessLevel.Restricted
    const receipt = await createCaseTx.wait();

    // Find the CaseCreated event
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
      console.log("✅ Case Created Successfully!");
      console.log(`   Case ID: ${parsedEvent.args.caseId}`);
      console.log(`   Title: ${parsedEvent.args.caseTitle}`);
      console.log(`   Judge: ${parsedEvent.args.judge}`);
      console.log(`   Transaction: ${createCaseTx.hash}\n`);
    }
    */

    console.log("─────────────────────────────────────────────────────────────────");
    console.log("💡 Tip: Uncomment the code sections above to perform actual");
    console.log("   transactions with the contract.");
    console.log("─────────────────────────────────────────────────────────────────\n");

  } catch (error) {
    console.error("❌ Error interacting with contract:");
    console.error(error.message);
    process.exit(1);
  }

  console.log("🎉 Interaction Complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:");
    console.error(error);
    process.exit(1);
  });
