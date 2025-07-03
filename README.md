Smart Multichain USDC Payment Scheduler

Welcome to the Smart Multichain USDC Payment Scheduler, a decentralized application (dApp) designed to automate USDC payments across multiple blockchain testnets (Ethereum Sepolia, Polygon Mumbai, and Arbitrum Sepolia). This project, built for the [Hackathon Name] 2025, integrates the LI.FI SDK for fee optimization, MetaMask SDK for wallet connectivity, and Chainlink Automation for future scalability. The modern, professional UI leverages React and Tailwind CSS, offering a seamless user experience.

Table of Contents





Overview



Features



Architecture



Installation



Usage



Demo



Technical Details



Contributing



License



Acknowledgments

Overview

The Smart Multichain USDC Payment Scheduler addresses the challenge of managing recurring payments across blockchains. Users can schedule USDC payments with customizable intervals and execute them manually (with Chainlink Automation planned for production). The dApp optimizes transaction fees using the LI.FI SDK and supports multichain deployment, making it ideal for use cases like subscriptions, payroll, or cross-border remittances.

This project was developed as part of a hackathon submission, earning bonuses for LI.FI ($2,000) and MetaMask ($2,000) integrations. The code is open-source, and the dApp is deployed at https://usdc-scheduler.vercel.app.

Features





Multichain Support: Deployed on Ethereum Sepolia, Polygon Mumbai, and Arbitrum Sepolia testnets.



USDC Payment Scheduling: Schedule payments with custom amounts, recipients, and intervals.



Fee Optimization: Uses LI.FI SDK to find the lowest-cost chain for transactions.



Wallet Integration: Connects seamlessly with MetaMask via the MetaMask SDK.



Professional UI: Modern design with Tailwind CSS, featuring cards, gradients, and responsiveness.



Chainlink Compatibility: Designed for future automation with Chainlink Automation.



Real-Time Feedback: Displays payment status and estimated fees in the UI.

Architecture

The project follows a modular architecture combining frontend, smart contract, and deployment layers:

Architecture Diagram

+-----------------------------------------------------+
|                   Frontend (dApp)                   |
| +-----------------------------------------------+  |
| | React + JSX                                   |  |
| | - UI: Tailwind CSS, Card-based Layout         |  |
| | - Libraries: Web3.js, MetaMask SDK, LI.FI SDK |  |
| +-----------------------------------------------+  |
|                                                    |
+-----------------------------------------------------+
          | (Interacts with Smart Contract via Web3)
          v
+-----------------------------------------------------+
|                Smart Contract Layer                |
| +-----------------------------------------------+  |
| | USDCPaymentScheduler.sol                      |  |
| | - Language: Solidity 0.8.28                   |  |
| | - Features: Payment Scheduling, Execution     |  |
| | - Dependencies: Chainlink Automation Interface|  |
| | - Deployed on: Sepolia, Mumbai, Arbitrum Sepolia |  |
| +-----------------------------------------------+  |
|                                                    |
+-----------------------------------------------------+
          | (Deployed using Hardhat)
          v
+-----------------------------------------------------+
|                  Deployment Layer                  |
| +-----------------------------------------------+  |
| | Hardhat                                       |  |
| | - Config: hardhat.config.js                   |  |
| | - RPCs: Alchemy (Sepolia, Mumbai, Arbitrum)   |  |
| | - Verification: Etherscan, Polygonscan, Arbiscan |  |
| | - Script: deploy-v2-contracts.js              |  |
| +-----------------------------------------------+  |
|                                                    |
+-----------------------------------------------------+

Explanation





Frontend: Built with React and rendered via index.html. The UI uses Tailwind CSS for styling, with Web3.js for blockchain interaction, MetaMask SDK for wallet connectivity, and LI.FI SDK for fee optimization. It communicates with the smart contract via RPC calls.



Smart Contract: The USDCPaymentScheduler.sol contract, written in Solidity, handles payment scheduling and execution. It integrates with the Chainlink AutomationCompatibleInterface for future automation and uses the IERC20 interface for USDC interactions.



Deployment: Managed with Hardhat, using a custom deploy-v2-contracts.js script. RPC URLs (e.g., Alchemy) and API keys (e.g., Polygonscan) are configured via .env, with contracts verified on respective explorers.

Installation

To run this project locally, follow these steps:

Prerequisites





Node.js (v16 or later)



npm (comes with Node.js)



MetaMask wallet with testnet funds (Sepolia ETH, Mumbai MATIC, Arbitrum Sepolia ETH)



Alchemy account for RPC URLs (free tier)

Steps





Clone the Repository:

git clone https://github.com/your-username/usdc-payment-scheduler.git
cd usdc-payment-scheduler



Install Dependencies:

npm install
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @chainlink/contracts dotenv



Configure Environment Variables:





Create a .env file in the root directory:

SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-alchemy-api-key
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-alchemy-api-key
ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/your-alchemy-api-key
PRIVATE_KEY=0xYourPrivateKey
POLYGONSCAN_API_KEY=YourPolygonscanApiKey
ARBISCAN_API_KEY=YourArbiscanApiKey
ETHERSCAN_API_KEY=YourEtherscanApiKey



Replace placeholders with your Alchemy API keys, MetaMask private key (testnet-only), and explorer API keys.



Set Up Hardhat:





Initialize Hardhat if not already done:

npx hardhat init



Accept defaults for a JavaScript project and update hardhat.config.js with the provided configuration.



Install Serve (for UI):

npm install -g serve

Usage

Deploying the Contract





Run the deployment script:

npx hardhat run scripts/deploy-v2-contracts.js



Note the deployed contract addresses for Sepolia, Mumbai, and Arbitrum Sepolia.



Update the contractAddresses object in index.html with these addresses.

Running the dApp





Start the local server:

serve



Open http://localhost:3000 in a browser.



Connect MetaMask to a testnet (e.g., Sepolia), fund it with testnet tokens, and interact with the UI:





Schedule a payment (e.g., 10 USDC, 60-second interval).



Execute the payment after the interval and verify on the explorer.

Testing





Test responsiveness by resizing the browser or using Chrome DevTools.



Verify fee optimization by scheduling payments on different chains.



Check MetaMask popups for transaction approvals.

Demo

A live demo is available at https://usdc-scheduler.vercel.app. The video pitch (3–5 minutes) includes:





Connecting MetaMask and scheduling a 10 USDC payment.



Executing the payment after 60 seconds.



Showcasing the modern UI (navigation, cards, gradients).



Highlighting LI.FI fee optimization and Chainlink compatibility.

Technical Details





Frontend: React, Tailwind CSS, Web3.js, MetaMask SDK, LI.FI SDK.



Smart Contract: Solidity 0.8.28, Chainlink Automation interface.



Deployment: Hardhat, Alchemy RPCs, Etherscan/Polygonscan/Arbiscan verification.



Dependencies: @chainlink/contracts, dotenv.



Contract Addresses: Update index.html with deployed addresses (e.g., Sepolia: 0xYourSepoliaAddress).

Contributing

Contributions are welcome! To contribute:





Fork the repository.



Create a new branch (git checkout -b feature-name).



Commit changes (git commit -m "Add feature-name").



Push to the branch (git push origin feature-name).



Open a pull request.

Please ensure code follows the project’s style guidelines and includes tests.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments





xAI: For providing Grok 3 and support.



LI.FI: For the SDK and $2,000 bonus.



MetaMask: For the SDK and $2,000 bonus.



Chainlink: For Automation inspiration.



Alchemy: For reliable RPC endpoints.