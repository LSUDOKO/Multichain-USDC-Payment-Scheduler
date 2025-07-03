export interface FeeOptimization {
  recommendedChainId: number
  recommendedChainName: string
  estimatedSavings: number
  estimatedSavingsUsd: number
  allChainCosts: Array<{
    chainId: number
    chainName: string
    gasPrice: string
    gasPriceUsd: number
    recommended: boolean
  }>
  lastUpdated: Date
}

class FeeOptimizerService {
  async getOptimizedFees(): Promise<FeeOptimization> {
    try {
      const response = await fetch("/api/lifi/gas-prices")
      let gasPrices = []

      if (response.ok) {
        gasPrices = await response.json()
      } else {
        // Fallback data
        gasPrices = [
          { chainId: 137, chainName: "Polygon", gasPrice: "30", gasPriceUsd: 0.03, recommended: true },
          { chainId: 42161, chainName: "Arbitrum", gasPrice: "0.1", gasPriceUsd: 0.24, recommended: true },
          { chainId: 10, chainName: "Optimism", gasPrice: "0.001", gasPriceUsd: 0.0024, recommended: true },
          { chainId: 56, chainName: "BSC", gasPrice: "5", gasPriceUsd: 1.5, recommended: false },
          { chainId: 43114, chainName: "Avalanche", gasPrice: "25", gasPriceUsd: 0.875, recommended: false },
          { chainId: 1, chainName: "Ethereum", gasPrice: "25", gasPriceUsd: 6.0, recommended: false },
        ]
      }

      // Sort by USD cost (cheapest first)
      gasPrices.sort((a, b) => a.gasPriceUsd - b.gasPriceUsd)

      const cheapest = gasPrices[0]
      const mostExpensive = gasPrices[gasPrices.length - 1]
      const savings = ((mostExpensive.gasPriceUsd - cheapest.gasPriceUsd) / mostExpensive.gasPriceUsd) * 100
      const savingsUsd = mostExpensive.gasPriceUsd - cheapest.gasPriceUsd

      return {
        recommendedChainId: cheapest.chainId,
        recommendedChainName: cheapest.chainName,
        estimatedSavings: savings,
        estimatedSavingsUsd: savingsUsd,
        allChainCosts: gasPrices,
        lastUpdated: new Date(),
      }
    } catch (error) {
      console.error("Fee optimization failed:", error)

      // Return fallback optimization
      return {
        recommendedChainId: 137,
        recommendedChainName: "Polygon",
        estimatedSavings: 95,
        estimatedSavingsUsd: 5.97,
        allChainCosts: [
          { chainId: 137, chainName: "Polygon", gasPrice: "30", gasPriceUsd: 0.03, recommended: true },
          { chainId: 42161, chainName: "Arbitrum", gasPrice: "0.1", gasPriceUsd: 0.24, recommended: true },
          { chainId: 10, chainName: "Optimism", gasPrice: "0.001", gasPriceUsd: 0.0024, recommended: true },
          { chainId: 1, chainName: "Ethereum", gasPrice: "25", gasPriceUsd: 6.0, recommended: false },
        ],
        lastUpdated: new Date(),
      }
    }
  }
}

export const feeOptimizer = new FeeOptimizerService()
