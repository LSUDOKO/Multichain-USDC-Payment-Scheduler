import { NextResponse } from "next/server"

const LIFI_API_KEY = process.env.LIFI_API_KEY
const LIFI_BASE_URL = "https://li.quest/v1"

// Token prices for USD conversion (in production, fetch from price API)
const TOKEN_USD_PRICES: Record<string, number> = {
  ETH: 2400,
  MATIC: 1.0,
  BNB: 300,
  AVAX: 35,
}

const SUPPORTED_CHAINS = [
  { id: 1, name: "Ethereum", currency: "ETH" },
  { id: 137, name: "Polygon", currency: "MATIC" },
  { id: 42161, name: "Arbitrum", currency: "ETH" },
  { id: 10, name: "Optimism", currency: "ETH" },
  { id: 56, name: "BSC", currency: "BNB" },
  { id: 43114, name: "Avalanche", currency: "AVAX" },
]

async function getQuoteForGasEstimation(chainId: number) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-lifi-integrator": process.env.LIFI_INTEGRATOR_ID || "usdc-payment-scheduler",
    }

    if (LIFI_API_KEY) {
      headers["x-lifi-api-key"] = LIFI_API_KEY
    }

    const response = await fetch(`${LIFI_BASE_URL}/quote`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        fromChain: chainId,
        toChain: chainId,
        fromToken: "0xA0b86a33E6441b8435b662f0E2d0B8A0E4B5B8B0", // Mock USDC
        toToken: "0xA0b86a33E6441b8435b662f0E2d0B8A0E4B5B8B0",
        fromAmount: "1000000", // 1 USDC
        fromAddress: "0x0000000000000000000000000000000000000000",
      }),
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error(`Failed to get quote for chain ${chainId}:`, error)
  }

  return null
}

function getFallbackGasPrice(chainId: number): { gasPrice: number; gasPriceUsd: number } {
  const fallbackPrices: Record<number, number> = {
    1: 25, // Ethereum
    137: 30, // Polygon
    42161: 0.1, // Arbitrum
    10: 0.001, // Optimism
    56: 5, // BSC
    43114: 25, // Avalanche
  }

  const gasPrice = fallbackPrices[chainId] || 20
  const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId)
  const tokenPrice = TOKEN_USD_PRICES[chain?.currency || "ETH"] || 2400

  return {
    gasPrice,
    gasPriceUsd: gasPrice * 0.000001 * tokenPrice,
  }
}

export async function GET() {
  try {
    const gasPrices = await Promise.all(
      SUPPORTED_CHAINS.map(async (chain) => {
        try {
          const quote = await getQuoteForGasEstimation(chain.id)

          if (quote?.estimate?.gasCosts?.[0]) {
            const gasCost = quote.estimate.gasCosts[0]
            const gasAmount = Number.parseFloat(gasCost.amount) / Math.pow(10, gasCost.token.decimals)
            const tokenPrice = TOKEN_USD_PRICES[gasCost.token.symbol] || 1

            return {
              chainId: chain.id,
              chainName: chain.name,
              gasPrice: gasAmount.toFixed(6),
              gasPriceUsd: gasAmount * tokenPrice,
              recommended: gasAmount * tokenPrice < 1,
            }
          }
        } catch (error) {
          console.error(`Error getting gas price for ${chain.name}:`, error)
        }

        // Fallback data
        const fallback = getFallbackGasPrice(chain.id)
        return {
          chainId: chain.id,
          chainName: chain.name,
          gasPrice: fallback.gasPrice.toString(),
          gasPriceUsd: fallback.gasPriceUsd,
          recommended: fallback.gasPriceUsd < 1,
        }
      }),
    )

    // Sort by USD cost (cheapest first)
    gasPrices.sort((a, b) => a.gasPriceUsd - b.gasPriceUsd)

    return NextResponse.json(gasPrices)
  } catch (error) {
    console.error("Failed to get gas prices:", error)

    // Return fallback data for all chains
    const fallbackData = SUPPORTED_CHAINS.map((chain) => {
      const fallback = getFallbackGasPrice(chain.id)
      return {
        chainId: chain.id,
        chainName: chain.name,
        gasPrice: fallback.gasPrice.toString(),
        gasPriceUsd: fallback.gasPriceUsd,
        recommended: fallback.gasPriceUsd < 1,
      }
    })

    return NextResponse.json(fallbackData)
  }
}
