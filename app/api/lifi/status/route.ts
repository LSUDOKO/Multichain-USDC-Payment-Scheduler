import { NextResponse } from "next/server"

const LIFI_BASE_URL = "https://li.quest/v1"

export async function GET() {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-lifi-integrator": process.env.LIFI_INTEGRATOR_ID || "usdc-payment-scheduler",
    }

    if (process.env.LIFI_API_KEY) {
      headers["x-lifi-api-key"] = process.env.LIFI_API_KEY
    }

    const response = await fetch(`${LIFI_BASE_URL}/chains`, {
      headers,
    })

    if (response.ok) {
      const chains = await response.json()
      return NextResponse.json({
        isConnected: true,
        supportedChains: chains.chains?.length || 15,
        supportedTools: 25,
        lastChecked: new Date().toISOString(),
      })
    }

    throw new Error(`HTTP ${response.status}`)
  } catch (error) {
    console.error("LiFi status check failed:", error)

    return NextResponse.json({
      isConnected: false,
      supportedChains: 15,
      supportedTools: 25,
      lastChecked: new Date().toISOString(),
      error: "Connection failed",
    })
  }
}
