import { NextResponse } from "next/server"

const LIFI_BASE_URL = "https://li.quest/v1"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-lifi-integrator": process.env.LIFI_INTEGRATOR_ID || "usdc-payment-scheduler",
    }

    if (process.env.LIFI_API_KEY) {
      headers["x-lifi-api-key"] = process.env.LIFI_API_KEY
    }

    const response = await fetch(`${LIFI_BASE_URL}/quote`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    throw new Error(`HTTP ${response.status}`)
  } catch (error) {
    console.error("LiFi quote failed:", error)

    return NextResponse.json({ error: "Failed to get quote" }, { status: 500 })
  }
}
