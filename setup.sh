#!/bin/bash

echo "🚀 Setting up USDC Payment Scheduler Deployment Environment"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or later."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version is too old. Please install Node.js v16 or later."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual values before deploying!"
else
    echo "✅ .env file already exists"
fi

# Create deployments directory
mkdir -p deployments

# Compile contracts
echo "🔨 Compiling contracts..."
npx hardhat compile

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your private key and API keys"
echo "2. Fund your wallet with testnet tokens:"
echo "   - Sepolia ETH: https://sepoliafaucet.com/"
echo "   - Mumbai MATIC: https://mumbaifaucet.com/"
echo "   - Arbitrum Sepolia ETH: https://bridge.arbitrum.io/"
echo "3. Run deployment: npm run deploy"
echo ""
