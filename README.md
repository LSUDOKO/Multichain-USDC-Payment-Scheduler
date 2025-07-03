# Multichain USDC Payment Scheduler

A decentralized application (dApp) that allows users to schedule recurring USDC payments across multiple blockchains with automatic fee optimization using real-time gas price data and cross-chain transfers via LI.FI SDK and Circle CCTP V2.

## 🚀 Features

- **Smart Payment Scheduling**: Schedule recurring USDC payments with flexible intervals
- **Fee Optimization**: Automatically select the lowest-cost blockchain for each payment
- **Cross-Chain Support**: Seamless transfers across Ethereum, Polygon, and Arbitrum testnets
- **MetaMask Integration**: Easy wallet connectivity and transaction signing
- **Real-Time Monitoring**: Live gas price tracking and fee comparison
- **Intuitive UI**: Clean, responsive interface with real-time feedback

## 🏗️ Architecture

### Smart Contracts
- **Language**: Solidity ^0.8.0
- **Security**: OpenZeppelin contracts for IERC20 handling and reentrancy protection
- **Features**: Payment scheduling, execution, and management

### Frontend
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS with shadcn/ui components
- **Integrations**: MetaMask SDK, LI.FI SDK, Web3.js

### Supported Networks
- Ethereum Sepolia (Chain ID: 11155111)
- Polygon Mumbai (Chain ID: 80001)
- Arbitrum Sepolia (Chain ID: 421614)

## 🛠️ Setup Instructions

### Prerequisites
1. Install MetaMask browser extension
2. Configure testnet networks in MetaMask
3. Obtain testnet tokens from faucets
4. Get test USDC from Circle's testnet faucet

### Deployment
1. Deploy smart contracts on each testnet using Remix IDE
2. Update contract addresses in `app/lib/constants.ts`
3. Configure LI.FI SDK integrator ID
4. Set up Etherscan API key for gas price tracking

### Local Development
\`\`\`bash
npm install
npm run dev
\`\`\`

## 🎯 Hackathon Alignment

### Real World Relevance (25%)
- Automates USDC payments for remittances, subscriptions, and treasury management
- Reduces costs and complexity for MetaMask Card users
- Addresses real pain points in Web3 payments

### Creativity & Originality (20%)
- Novel fee optimization using real-time gas price data
- Intelligent chain selection for cost savings
- Seamless cross-chain payment scheduling

### Functionality (20%)
- Fully functional payment scheduling system
- Cross-chain USDC transfers via Circle CCTP V2
- Real-time fee optimization and execution

### User Experience (15%)
- Intuitive React-based interface
- Clear feedback on transaction status and savings
- Responsive design with modern UI components

### Potential Impact/Scalability (20%)
- Extensible to additional blockchains
- Integration potential with DeFi protocols
- Foundation for automated Web3 payment systems

## 💰 Bonus Eligibility

- **MetaMask SDK Integration** ($2,000): Wallet connectivity and transaction signing
- **LI.FI SDK Integration** ($2,000): Cross-chain transfers and fee estimation
- **Circle CCTP V2**: Secure USDC bridging across chains

## 🔒 Security Features

- OpenZeppelin security patterns
- Reentrancy protection
- Input validation and error handling
- Secure cross-chain transfers via Circle CCTP V2

## 🚀 Future Enhancements

- Chainlink Automation for automatic execution
- Additional blockchain support (Optimism, Base, Avalanche)
- DeFi integrations (yield farming while scheduled)
- AI-driven fee prediction
- Circle Wallets integration

## 📝 License

MIT License - see LICENSE file for details
