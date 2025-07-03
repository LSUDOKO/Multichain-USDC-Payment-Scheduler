# 🚀 Complete Deployment Guide for USDCPaymentSchedulerV2

## Prerequisites

### 1. System Requirements
- **Node.js**: v16 or later (`node --version`)
- **npm**: Latest version (`npm --version`)
- **Git**: For cloning repositories

### 2. Accounts & API Keys
- **MetaMask wallet** with testnet funds
- **Alchemy/Infura** account for RPC URLs
- **Block explorer API keys**:
  - Etherscan API key
  - Polygonscan API key  
  - Arbiscan API key

### 3. Testnet Tokens
Fund your MetaMask wallet with:
- **Sepolia ETH**: [sepoliafaucet.com](https://sepoliafaucet.com/)
- **Mumbai MATIC**: [mumbaifaucet.com](https://mumbaifaucet.com/)
- **Arbitrum Sepolia ETH**: [bridge.arbitrum.io](https://bridge.arbitrum.io/)

## Step-by-Step Setup

### 1. Initialize Project
\`\`\`bash
# Create project directory
mkdir usdc-payment-scheduler
cd usdc-payment-scheduler

# Initialize npm project
npm init -y

# Install Hardhat
npm install --save-dev hardhat
npx hardhat init
# Select "Create a JavaScript project" and accept defaults
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install required packages
npm install --save-dev @nomicfoundation/hardhat-toolbox @chainlink/contracts dotenv serve

# Install OpenZeppelin contracts
npm install @openzeppelin/contracts
\`\`\`

### 3. Configure Environment
\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env  # or use your preferred editor
\`\`\`

**Required .env variables:**
\`\`\`bash
PRIVATE_KEY=your_private_key_without_0x_prefix
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-api-key
ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/your-api-key
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
\`\`\`

### 4. Compile Contracts
\`\`\`bash
# Compile the smart contracts
npx hardhat compile
\`\`\`

### 5. Deploy Contracts
\`\`\`bash
# Deploy to all networks
npm run deploy

# Or deploy to specific networks
npm run deploy:sepolia
npm run deploy:mumbai
npm run deploy:arbitrum
\`\`\`

## Deployment Output

After successful deployment, you'll see:

\`\`\`
🚀 Starting USDCPaymentSchedulerV2 Deployment
==================================================

📍 Deploying to sepolia...
   USDC Token Address: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
✅ USDCPaymentSchedulerV2 deployed to sepolia: 0x123...
   Transaction hash: 0xabc...
   ⏳ Waiting for confirmations...
   🔍 Verifying contract...
   ✅ Contract verified successfully

📋 DEPLOYMENT SUMMARY
==================================================

🌐 SEPOLIA
   ✅ Contract: 0x123...
   🔗 USDC: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
   📊 TX Hash: 0xabc...
   🔍 Verified: Yes
   🌐 Explorer: https://sepolia.etherscan.io/address/0x123...
\`\`\`

## Post-Deployment Steps

### 1. Update Frontend Configuration
The deployment script automatically generates `deployments/frontend-config.json`:

\`\`\`json
{
  "contractAddresses": {
    "11155111": "0x123...", // Sepolia
    "80001": "0x456...",    // Mumbai
    "421614": "0x789..."    // Arbitrum Sepolia
  },
  "usdcAddresses": {
    "11155111": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    "80001": "0x0FA8781a83E468F3b7C25308B9421c0c1bE7a6B0",
    "421614": "0x75faf114eafb1BDbe6fc3363c7f609b9d5a8f3dA"
  }
}
\`\`\`

### 2. Set Up Chainlink Automation

For each deployed contract:

1. **Visit**: [automation.chain.link](https://automation.chain.link/)
2. **Connect MetaMask** to the target network
3. **Register new Upkeep**:
   - Type: Custom logic
   - Contract address: Your deployed contract
   - Admin address: Your wallet address
   - Check interval: 60 seconds
   - Gas limit: 500,000
   - Starting balance: 5 LINK tokens

4. **Get LINK tokens**: [faucets.chain.link](https://faucets.chain.link/)

### 3. Test Deployment

\`\`\`bash
# Serve the frontend locally
npm run serve

# Open http://localhost:3000 in browser
# Connect MetaMask and test payment scheduling
\`\`\`

## Troubleshooting

### Common Issues

**"Invalid API Key"**
- Verify API keys in .env file
- Check API key permissions on respective platforms

**"Insufficient funds"**
- Fund wallet with testnet tokens
- Check gas prices and increase if needed

**"Contract not verified"**
- Check constructor arguments match deployment
- Verify API keys are correct
- Try manual verification on block explorer

**"Network connection failed"**
- Check RPC URLs in .env
- Try alternative RPC providers
- Verify network configurations

### Debug Commands

\`\`\`bash
# Check Hardhat networks
npx hardhat help

# Test network connection
npx hardhat run scripts/test-connection.js --network sepolia

# Manual contract verification
npx hardhat verify --network sepolia 0xYourContractAddress "0xUSDCTokenAddress"
\`\`\`

## Security Notes

- **Never commit .env file** to version control
- **Use separate wallets** for testnet and mainnet
- **Verify contract addresses** before interacting
- **Test thoroughly** on testnets before mainnet deployment

## Next Steps

1. ✅ Deploy contracts on all testnets
2. ✅ Verify contracts on block explorers
3. ✅ Set up Chainlink Automation
4. ✅ Update frontend with contract addresses
5. ✅ Test payment scheduling and execution
6. 🔄 Monitor automation performance
7. 🚀 Prepare for mainnet deployment

## Support

If you encounter issues:
- Check the troubleshooting section above
- Review Hardhat documentation
- Join Chainlink Discord for automation support
- Check block explorer for transaction details
\`\`\`

Finally, let's create a test connection script:
