export interface LiFiStatus {
  isConnected: boolean
  responseTime: number
  supportedChains: number
  supportedTools: number
  lastChecked: Date
}

export interface GasPrice {
  chainId: number
  chainName: string
  gasPrice: string
  gasPriceUsd: number
  recommended: boolean
}

class LiFiService {
  async getStatus(): Promise<LiFiStatus> {
    const startTime = Date.now()

    try {
      const response = await fetch("/api/lifi/status")
      const responseTime = Date.now() - startTime

      if (response.ok) {
        const data = await response.json()
        return {
          isConnected: true,
          responseTime,
          supportedChains: data.supportedChains || 15,
          supportedTools: data.supportedTools || 25,
          lastChecked: new Date(),
        }
      }
    } catch (error) {
      console.error("LiFi status check failed:", error)
    }

    // Fallback data
    return {
      isConnected: false,
      responseTime: Date.now() - startTime,
      supportedChains: 15,
      supportedTools: 25,
      lastChecked: new Date(),
    }
  }

  async getGasPrices(): Promise<GasPrice[]> {
    try {
      const response = await fetch("/api/lifi/gas-prices")
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error("Failed to fetch gas prices:", error)
    }

    // Fallback data
    return [
      { chainId: 137, chainName: "Polygon", gasPrice: "30", gasPriceUsd: 0.03, recommended: true },
      { chainId: 42161, chainName: "Arbitrum", gasPrice: "0.1", gasPriceUsd: 0.24, recommended: true },
      { chainId: 10, chainName: "Optimism", gasPrice: "0.001", gasPriceUsd: 0.0024, recommended: true },
      { chainId: 56, chainName: "BSC", gasPrice: "5", gasPriceUsd: 1.5, recommended: false },
      { chainId: 43114, chainName: "Avalanche", gasPrice: "25", gasPriceUsd: 0.875, recommended: false },
      { chainId: 1, chainName: "Ethereum", gasPrice: "25", gasPriceUsd: 6.0, recommended: false },
    ]
  }
}

export const lifiService = new LiFiService()
