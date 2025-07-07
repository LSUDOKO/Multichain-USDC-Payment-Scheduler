import { createConfig, ChainId } from '@lifi/sdk';

// Initialize LI.FI SDK with API key and integrator ID
createConfig({
  integrator: process.env.LIFI_INTEGRATOR_ID || 'Arpit',
  apiKey: process.env.LIFI_API_KEY 
});

// Define FeeOptimization type based on component needs
export interface FeeOptimization {
  recommendedChainName: string;
  estimatedSavings: number;
  estimatedSavingsUsd: number;
  allChainCosts: {
    chainId: number;
    chainName: string;
    gasPrice: number; // in gwei
    gasPriceUsd: number;
    recommended: boolean;
  }[];
  lastUpdated: Date;
}

// Chain configurations with native token symbols for price conversion
const chains = [
  { name: 'Ethereum', id: ChainId.ETH, nativeToken: 'ethereum' },
  { name: 'Optimism', id: ChainId.OPT, nativeToken: 'ethereum' },
  { name: 'Polygon', id: ChainId.POL, nativeToken: 'matic-network' },
  { name: 'Arbitrum', id: ChainId.ARB, nativeToken: 'ethereum' },
  { name: 'Avalanche', id: ChainId.AVA, nativeToken: 'avalanche-2' },
  { name: 'BSC', id: ChainId.BSC, nativeToken: 'binancecoin' },
];

// Fetch token prices from CoinGecko for USD conversion
async function fetchTokenPrices(): Promise<{ [key: string]: number }> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,avalanche-2,binancecoin&vs_currencies=usd'
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('Token prices:', data);
    return {
      'ethereum': data['ethereum']?.usd || 2560.52,
      'matic-network': data['matic-network']?.usd || 0.184597,
      'avalanche-2': data['avalanche-2']?.usd || 18.16,
      'binancecoin': data['binancecoin']?.usd || 661.94,
    };
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {
      'ethereum': 2560.52,
      'matic-network': 0.184597,
      'avalanche-2': 18.16,
      'binancecoin': 661.94,
    };
  }
}

export const feeOptimizer = {
  async getOptimizedFees(): Promise<FeeOptimization> {
    const gasPrices: FeeOptimization['allChainCosts'] = [];
    let highestGasPriceUsd = 0;

    const tokenPrices = await fetchTokenPrices();

    for (const chain of chains) {
      try {
        const response = await fetch(
          `https://li.quest/v1/gas/suggestion/${chain.id}`,
          { headers: { 'x-lifi-request-id': `Arpit-${Date.now()}` } }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        const data = await response.json();
        console.log(`Gas suggestion for ${chain.name}:`, data);

        const gasCostWei = BigInt(data.recommended?.amount || 10e9); // Total cost in wei for 21,000 gas
        if (gasCostWei < 0 || gasCostWei > 1e18) {
          console.warn(`Invalid gasCostWei for ${chain.name}: ${gasCostWei}, using fallback`);
          throw new Error('Invalid gas cost');
        }
        const gasPriceGwei = Number(gasCostWei) / 21000 / 1e9; // Gas price in gwei
        const gasCostInNative = Number(gasCostWei) / 1e18; // Total cost in native token units
        const gasPriceUsd = gasCostInNative * tokenPrices[chain.nativeToken]; // Total USD cost
        console.log(`Calculated ${chain.name}: ${gasPriceGwei.toFixed(2)} gwei, $${gasPriceUsd.toFixed(6)} USD`);

        gasPrices.push({
          chainId: chain.id,
          chainName: chain.name,
          gasPrice: gasPriceGwei,
          gasPriceUsd,
          recommended: false,
        });

        if (gasPriceUsd > highestGasPriceUsd) highestGasPriceUsd = gasPriceUsd;
      } catch (error) {
        console.error(`Error fetching gas for ${chain.name}:`, error);
        const fallbackGasPriceGwei = chain.name === 'Ethereum' ? 20 : chain.name === 'BSC' ? 5 : 30;
        const gasCostInWei = BigInt(fallbackGasPriceGwei) * BigInt(1e9) * BigInt(21000);
        const gasCostInNative = Number(gasCostInWei) / 1e18;
        const gasPriceUsd = gasCostInNative * tokenPrices[chain.nativeToken];
        console.log(`Fallback ${chain.name}: ${fallbackGasPriceGwei} gwei, $${gasPriceUsd.toFixed(6)} USD`);

        gasPrices.push({
          chainId: chain.id,
          chainName: chain.name,
          gasPrice: fallbackGasPriceGwei,
          gasPriceUsd,
          recommended: false,
        });

        if (gasPriceUsd > highestGasPriceUsd) highestGasPriceUsd = gasPriceUsd;
      }
    }

    const cheapestChain = gasPrices.reduce((prev, curr) =>
      curr.gasPriceUsd < prev.gasPriceUsd ? curr : prev
    );

    gasPrices.forEach((chain) => {
      chain.recommended = chain.chainName === cheapestChain.chainName;
    });

    const ethereumPrice = gasPrices.find((c) => c.chainName === 'Ethereum')?.gasPriceUsd || highestGasPriceUsd;
    const savingsUsd = ethereumPrice - cheapestChain.gasPriceUsd;
    const savingsPercent = ethereumPrice > 0 ? (savingsUsd / ethereumPrice) * 100 : 0;

    return {
      recommendedChainName: cheapestChain.chainName,
      estimatedSavings: savingsPercent,
      estimatedSavingsUsd: savingsUsd,
      allChainCosts: gasPrices.sort((a, b) => a.gasPriceUsd - b.gasPriceUsd),
      lastUpdated: new Date(),
    };
  },
};