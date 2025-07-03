export const SUPPORTED_CHAINS = {
  11155111: {
    name: "Ethereum Sepolia",
    symbol: "ETH",
    rpcUrl: "https://sepolia.infura.io/v3/",
    blockExplorer: "https://sepolia.etherscan.io",
    usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    contractAddress: "0x...", // Update after deployment
  },
  80001: {
    name: "Polygon Mumbai",
    symbol: "MATIC",
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
    blockExplorer: "https://mumbai.polygonscan.com",
    usdcAddress: "0x0FA8781a83E468F3b7C25308B9421c0c1bE7a6B0",
    contractAddress: "0x...", // Update after deployment
  },
  421614: {
    name: "Arbitrum Sepolia",
    symbol: "ETH",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    blockExplorer: "https://sepolia.arbiscan.io",
    usdcAddress: "0x75faf114eafb1BDbe6fc3363c7f609b9d5a8f3dA",
    contractAddress: "0x...", // Update after deployment
  },
} as const

export const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "_usdcToken", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_interval", type: "uint256" },
      { internalType: "uint256", name: "_startTime", type: "uint256" },
      { internalType: "string", name: "_description", type: "string" },
    ],
    name: "schedulePayment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_paymentId", type: "uint256" }],
    name: "executePayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_paymentId", type: "uint256" }],
    name: "getPayment",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "payer", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "interval", type: "uint256" },
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "uint256", name: "lastExecuted", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "string", name: "description", type: "string" },
        ],
        internalType: "struct USDCPaymentScheduler.Payment",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]
