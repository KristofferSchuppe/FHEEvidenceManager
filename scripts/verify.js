const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║   Privacy Evidence Manager - Verification Script              ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝\n");

  const network = hre.network.name;

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

  console.log("📋 Verification Information:");
  console.log("─────────────────────────────────────────────────────────────────");
  console.log(`Network:          ${network}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Contract Name:    PrivacyEvidenceManager`);
  console.log("─────────────────────────────────────────────────────────────────\n");

  try {
    console.log("🔍 Verifying contract on Etherscan...\n");

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      contract: "contracts/PrivacyEvidenceManager.sol:PrivacyEvidenceManager",
    });

    console.log("\n✅ Contract Verification Successful!\n");

    const etherscanBaseUrl = getEtherscanUrl(network);
    if (etherscanBaseUrl) {
      console.log("🔗 Verified Contract Link:");
      console.log("─────────────────────────────────────────────────────────────────");
      console.log(`${etherscanBaseUrl}/address/${contractAddress}#code`);
      console.log("─────────────────────────────────────────────────────────────────\n");
    }

    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verifiedAt = new Date().toISOString();
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("💾 Deployment info updated with verification status\n");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contract is already verified!\n");

      const etherscanBaseUrl = getEtherscanUrl(network);
      if (etherscanBaseUrl) {
        console.log("🔗 Verified Contract Link:");
        console.log("─────────────────────────────────────────────────────────────────");
        console.log(`${etherscanBaseUrl}/address/${contractAddress}#code`);
        console.log("─────────────────────────────────────────────────────────────────\n");
      }
    } else {
      console.error("❌ Verification Failed:");
      console.error(error.message);
      process.exit(1);
    }
  }

  console.log("🎉 Verification Process Complete!\n");
}

function getEtherscanUrl(network) {
  const urls = {
    mainnet: "https://etherscan.io",
    sepolia: "https://sepolia.etherscan.io",
    goerli: "https://goerli.etherscan.io",
    polygon: "https://polygonscan.com",
    mumbai: "https://mumbai.polygonscan.com",
    bsc: "https://bscscan.com",
    bscTestnet: "https://testnet.bscscan.com",
  };
  return urls[network] || "";
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:");
    console.error(error);
    process.exit(1);
  });
