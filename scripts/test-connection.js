const hre = require("hardhat")

async function main() {
  console.log("🔍 Testing network connections...")
  console.log("Network:", hre.network.name)
  console.log("Chain ID:", hre.network.config.chainId)

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deployer address:", deployer.address)

  const balance = await deployer.getBalance()
  console.log("Balance:", hre.ethers.utils.formatEther(balance), "ETH")

  // Test USDC contract connection
  const usdcAddresses = {
    11155111: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia
    80001: "0x0FA8781a83E468F3b7C25308B9421c0c1bE7a6B0", // Mumbai
    421614: "0x75faf114eafb1BDbe6fc3363c7f609b9d5a8f3dA", // Arbitrum Sepolia
  }

  const usdcAddress = usdcAddresses[hre.network.config.chainId]
  if (usdcAddress) {
    console.log("USDC address:", usdcAddress)

    try {
      const usdcContract = await hre.ethers.getContractAt("IERC20", usdcAddress)
      const usdcBalance = await usdcContract.balanceOf(deployer.address)
      console.log("USDC balance:", hre.ethers.utils.formatUnits(usdcBalance, 6), "USDC")
    } catch (error) {
      console.log("⚠️ Could not fetch USDC balance:", error.message)
    }
  }

  console.log("✅ Connection test completed")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Connection test failed:", error)
    process.exit(1)
  })
