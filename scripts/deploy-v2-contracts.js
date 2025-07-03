const hre = require("hardhat")

async function main() {
  const usdcAddresses = {
    11155111: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia
    80001: "0x0FA8781a83E468F3b7C25308B9421c0c1bE7a6B0", // Mumbai
    421614: "0x75faf114eafb1BDbe6fc3363c7f609b9d5a8f3dA", // Arbitrum Sepolia
  }

  const networks = [
    { name: "sepolia", chainId: 11155111 },
    { name: "mumbai", chainId: 80001 },
    { name: "arbitrumSepolia", chainId: 421614 },
  ]

  const deployedAddresses = {}

  console.log("🚀 Starting USDCPaymentSchedulerV2 Deployment")
  console.log("=".repeat(50))

  for (const network of networks) {
    try {
      console.log(`\n📍 Deploying to ${network.name}...`)

      // Get the contract factory
      const USDCPaymentSchedulerV2 = await hre.ethers.getContractFactory("USDCPaymentSchedulerV2")
      const usdcToken = usdcAddresses[network.chainId]

      console.log(`   USDC Token Address: ${usdcToken}`)

      // Deploy the contract
      const contract = await USDCPaymentSchedulerV2.deploy(usdcToken)
      await contract.deployed()

      console.log(`✅ USDCPaymentSchedulerV2 deployed to ${network.name}: ${contract.address}`)
      console.log(`   Transaction hash: ${contract.deployTransaction.hash}`)

      deployedAddresses[network.name] = {
        address: contract.address,
        chainId: network.chainId,
        usdcToken: usdcToken,
        txHash: contract.deployTransaction.hash,
      }

      // Wait for a few confirmations before verification
      console.log("   ⏳ Waiting for confirmations...")
      await contract.deployTransaction.wait(3)

      // Verify contract
      try {
        console.log("   🔍 Verifying contract...")
        await hre.run("verify:verify", {
          address: contract.address,
          constructorArguments: [usdcToken],
        })
        console.log("   ✅ Contract verified successfully")
        deployedAddresses[network.name].verified = true
      } catch (verifyError) {
        console.log(`   ⚠️ Verification failed: ${verifyError.message}`)
        deployedAddresses[network.name].verified = false
      }

      // Add delay between deployments
      if (network !== networks[networks.length - 1]) {
        console.log("   ⏳ Waiting 10 seconds before next deployment...")
        await new Promise((resolve) => setTimeout(resolve, 10000))
      }
    } catch (error) {
      console.error(`❌ Deployment failed on ${network.name}:`, error.message)
      deployedAddresses[network.name] = {
        error: error.message,
        chainId: network.chainId,
      }
    }
  }

  // Generate deployment summary
  console.log("\n📋 DEPLOYMENT SUMMARY")
  console.log("=".repeat(50))

  Object.entries(deployedAddresses).forEach(([network, data]) => {
    console.log(`\n🌐 ${network.toUpperCase()}`)
    if (data.address) {
      console.log(`   ✅ Contract: ${data.address}`)
      console.log(`   🔗 USDC: ${data.usdcToken}`)
      console.log(`   📊 TX Hash: ${data.txHash}`)
      console.log(`   🔍 Verified: ${data.verified ? "Yes" : "No"}`)

      // Generate explorer links
      const explorerUrls = {
        sepolia: `https://sepolia.etherscan.io/address/${data.address}`,
        mumbai: `https://mumbai.polygonscan.com/address/${data.address}`,
        arbitrumSepolia: `https://sepolia.arbiscan.io/address/${data.address}`,
      }
      console.log(`   🌐 Explorer: ${explorerUrls[network]}`)
    } else {
      console.log(`   ❌ Failed: ${data.error}`)
    }
  })

  // Save deployment data
  const fs = require("fs")
  const deploymentData = {
    timestamp: new Date().toISOString(),
    version: "v2",
    contracts: deployedAddresses,
    chainlinkAutomation: {
      enabled: true,
      registryAddresses: {
        sepolia: "0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad",
        mumbai: "0x02777053d6764996e594c3E88AF1D58D5363a2e6",
        arbitrumSepolia: "0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad",
      },
    },
  }

  // Create deployments directory if it doesn't exist
  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments")
  }

  fs.writeFileSync("deployments/v2-deployment-addresses.json", JSON.stringify(deploymentData, null, 2))
  console.log("\n💾 Deployment data saved to deployments/v2-deployment-addresses.json")

  // Generate frontend config
  const frontendConfig = {
    contractAddresses: {},
    usdcAddresses: usdcAddresses,
  }

  Object.entries(deployedAddresses).forEach(([network, data]) => {
    if (data.address) {
      frontendConfig.contractAddresses[data.chainId.toString()] = data.address
    }
  })

  fs.writeFileSync("deployments/frontend-config.json", JSON.stringify(frontendConfig, null, 2))
  console.log("📱 Frontend config saved to deployments/frontend-config.json")

  // Generate Chainlink Automation instructions
  console.log("\n🔗 CHAINLINK AUTOMATION SETUP")
  console.log("=".repeat(50))
  console.log("For each deployed contract, follow these steps:")
  console.log("1. Go to: https://automation.chain.link/")
  console.log("2. Connect MetaMask to the target network")
  console.log("3. Click 'Register new Upkeep'")
  console.log("4. Select 'Custom logic'")
  console.log("5. Enter contract address and configure:")
  console.log("   - Check interval: 60 seconds")
  console.log("   - Gas limit: 500,000")
  console.log("   - Starting balance: 5 LINK tokens")
  console.log("6. Get LINK from: https://faucets.chain.link/")

  Object.entries(deployedAddresses).forEach(([network, data]) => {
    if (data.address) {
      console.log(`\n📍 ${network.toUpperCase()}: ${data.address}`)
    }
  })

  console.log("\n🎉 Deployment completed!")
  return deployedAddresses
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error)
    process.exit(1)
  })
