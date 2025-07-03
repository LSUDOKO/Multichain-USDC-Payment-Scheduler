require("dotenv").config()

async function testLiFiSimple() {
  const LIFI_API_KEY = process.env.LIFI_API_KEY
  const LIFI_INTEGRATOR_ID = process.env.LIFI_INTEGRATOR_ID || "usdc-payment-scheduler"

  if (!LIFI_API_KEY) {
    console.error("❌ LIFI_API_KEY not found in environment variables")
    console.log("Please add LIFI_API_KEY to your .env file")
    process.exit(1)
  }

  console.log("🔑 Testing LI.FI API Key...")
  console.log(`Key: ${LIFI_API_KEY.substring(0, 40)}****`)
  console.log("")

  try {
    const response = await fetch("https://li.quest/v1/chains", {
      headers: {
        "x-lifi-api-key": LIFI_API_KEY,
        "x-lifi-integrator": LIFI_INTEGRATOR_ID,
      },
    })

    console.log(`Status: ${response.status}`)
    console.log("")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ API Key Valid! Found ${data.chains.length} supported chains`)
    console.log("🎉 LI.FI integration is working correctly!")
  } catch (error) {
    console.error("❌ Error testing LI.FI API:", error.message)
    process.exit(1)
  }
}

testLiFiSimple()
