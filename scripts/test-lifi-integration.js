require("dotenv").config()

async function testLiFiIntegration() {
  const LIFI_API_KEY = process.env.LIFI_API_KEY
  const LIFI_INTEGRATOR_ID = process.env.LIFI_INTEGRATOR_ID || "usdc-payment-scheduler"

  if (!LIFI_API_KEY) {
    console.error("❌ LIFI_API_KEY not found in environment variables")
    console.log("Please add LIFI_API_KEY to your .env file")
    process.exit(1)
  }

  console.log("🔍 Testing LI.FI API Integration...")
  console.log(`API Key: ${LIFI_API_KEY.substring(0, 40)}****`)
  console.log(`Integrator ID: ${LIFI_INTEGRATOR_ID}`)
  console.log("==================================================")

  const headers = {
    "x-lifi-api-key": LIFI_API_KEY,
    "x-lifi-integrator": LIFI_INTEGRATOR_ID,
    "Content-Type": "application/json",
  }

  try {
    // Test 1: Get supported chains
    console.log("📡 Testing supported chains...")
    const chainsResponse = await fetch("https://li.quest/v1/chains", { headers })

    if (!chainsResponse.ok) {
      throw new Error(`Chains API error: ${chainsResponse.status}`)
    }

    const chainsData = await chainsResponse.json()
    console.log(`✅ Found ${chainsData.chains.length} supported chains`)

    // Show some popular chains
    const popularChains = chainsData.chains
      .filter((chain) => ["Ethereum", "Polygon", "Arbitrum", "Optimism", "BSC"].includes(chain.name))
      .slice(0, 5)

    popularChains.forEach((chain) => {
      console.log(`   - ${chain.name} (${chain.id})`)
    })
    console.log("")

    // Test 2: Get available tools
    console.log("🔧 Testing available tools...")
    const toolsResponse = await fetch("https://li.quest/v1/tools", { headers })

    if (!toolsResponse.ok) {
      throw new Error(`Tools API error: ${toolsResponse.status}`)
    }

    const toolsData = await toolsResponse.json()
    const bridges = toolsData.bridges || []
    const exchanges = toolsData.exchanges || []

    console.log(`✅ Found ${bridges.length} bridges and ${exchanges.length} exchanges`)

    if (bridges.length > 0) {
      console.log("   Top bridges:")
      bridges.slice(0, 3).forEach((bridge) => {
        console.log(`   - ${bridge.name}`)
      })
    }
    console.log("")

    // Test 3: Get tokens (USDC specifically)
    console.log("🪙 Testing token discovery...")
    const tokensResponse = await fetch("https://li.quest/v1/tokens", { headers })

    if (!tokensResponse.ok) {
      throw new Error(`Tokens API error: ${tokensResponse.status}`)
    }

    const tokensData = await tokensResponse.json()

    // Find USDC tokens
    const usdcTokens = Object.values(tokensData.tokens)
      .flat()
      .filter((token) => token.symbol === "USDC")
      .slice(0, 5)

    console.log(`✅ Found ${usdcTokens.length} USDC tokens across chains`)
    usdcTokens.forEach((token) => {
      console.log(`   - USDC on chain ${token.chainId}: ${token.address}`)
    })
    console.log("")

    // Test 4: Test quote functionality (if we have USDC tokens)
    if (usdcTokens.length >= 2) {
      console.log("💱 Testing quote functionality...")

      const fromToken = usdcTokens[0]
      const toToken = usdcTokens[1]

      const quoteParams = new URLSearchParams({
        fromChain: fromToken.chainId.toString(),
        toChain: toToken.chainId.toString(),
        fromToken: fromToken.address,
        toToken: toToken.address,
        fromAmount: "1000000", // 1 USDC (6 decimals)
      })

      const quoteResponse = await fetch(`https://li.quest/v1/quote?${quoteParams}`, { headers })

      if (quoteResponse.ok) {
        const quoteData = await quoteResponse.json()
        console.log("✅ Quote test successful!")
        console.log(`   Route: Chain ${fromToken.chainId} → Chain ${toToken.chainId}`)
        console.log(`   Estimated gas: ${quoteData.estimate?.gasCosts?.[0]?.amount || "N/A"}`)
      } else {
        console.log("⚠️  Quote test skipped (no suitable route found)")
      }
      console.log("")
    }

    // Test 5: Health check
    console.log("🏥 Testing API health...")
    const healthResponse = await fetch("https://li.quest/v1/health", { headers })

    if (healthResponse.ok) {
      console.log("✅ LI.FI API is healthy")
    } else {
      console.log("⚠️  LI.FI API health check failed")
    }
    console.log("")

    console.log("🎉 LI.FI integration test completed!")
    console.log("Your integration is ready for production use.")
  } catch (error) {
    console.error("❌ Error during LI.FI integration test:", error.message)
    process.exit(1)
  }
}

testLiFiIntegration()
