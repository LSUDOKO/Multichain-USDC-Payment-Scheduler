"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, ExternalLink, AlertCircle, CheckCircle, Copy } from "lucide-react"

interface WalletState {
  isConnected: boolean
  account: string | null
  chainId: number | null
  balance: string | null
}

const SUPPORTED_NETWORKS = [
  { chainId: 1, name: "Ethereum", rpcUrl: "https://mainnet.infura.io/v3/", symbol: "ETH" },
  { chainId: 137, name: "Polygon", rpcUrl: "https://polygon-rpc.com/", symbol: "MATIC" },
  { chainId: 42161, name: "Arbitrum", rpcUrl: "https://arb1.arbitrum.io/rpc", symbol: "ETH" },
  { chainId: 10, name: "Optimism", rpcUrl: "https://mainnet.optimism.io", symbol: "ETH" },
  { chainId: 56, name: "BSC", rpcUrl: "https://bsc-dataseed.binance.org/", symbol: "BNB" },
  { chainId: 43114, name: "Avalanche", rpcUrl: "https://api.avax.network/ext/bc/C/rpc", symbol: "AVAX" },
]

export function MetaMaskConnector() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    account: null,
    chainId: null,
    balance: null,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window === "undefined" || !window.ethereum) return

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })

        setWallet({
          isConnected: true,
          account: accounts[0],
          chainId: Number.parseInt(chainId, 16),
          balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
        })
      }
    } catch (error) {
      console.error("Error checking connection:", error)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWallet({ isConnected: false, account: null, chainId: null, balance: null })
    } else {
      checkConnection()
    }
  }

  const handleChainChanged = () => {
    checkConnection()
  }

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      setWallet({
        isConnected: true,
        account: accounts[0],
        chainId: Number.parseInt(chainId, 16),
        balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
      })
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) return

    const network = SUPPORTED_NETWORKS.find((n) => n.chainId === chainId)
    if (!network) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: {
                  name: network.symbol,
                  symbol: network.symbol,
                  decimals: 18,
                },
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding network:", addError)
        }
      }
    }
  }

  const copyAddress = () => {
    if (wallet.account) {
      navigator.clipboard.writeText(wallet.account)
    }
  }

  const getCurrentNetwork = () => {
    return SUPPORTED_NETWORKS.find((n) => n.chainId === wallet.chainId)
  }

  const isUnsupportedNetwork = wallet.chainId && !SUPPORTED_NETWORKS.find((n) => n.chainId === wallet.chainId)

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription className="text-gray-400">
          Connect your MetaMask wallet to start using the payment scheduler
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {!wallet.isConnected ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-6">Connect your MetaMask wallet to access all payment scheduling features</p>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-300 font-medium">Wallet Connected</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
            </div>

            {/* Account Info */}
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <h4 className="text-white font-medium mb-3">Account Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">
                      {wallet.account?.slice(0, 6)}...{wallet.account?.slice(-4)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyAddress}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-white">
                    {wallet.balance} {getCurrentNetwork()?.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Network:</span>
                  <Badge
                    className={
                      isUnsupportedNetwork
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }
                  >
                    {getCurrentNetwork()?.name || `Chain ${wallet.chainId}`}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Network Warning */}
            {isUnsupportedNetwork && (
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300">
                  You're connected to an unsupported network. Please switch to a supported network to use all features.
                </AlertDescription>
              </Alert>
            )}

            {/* Supported Networks */}
            <div>
              <h4 className="text-white font-medium mb-3">Supported Networks</h4>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORTED_NETWORKS.map((network) => (
                  <Button
                    key={network.chainId}
                    variant="outline"
                    size="sm"
                    onClick={() => switchNetwork(network.chainId)}
                    className={`border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent ${
                      wallet.chainId === network.chainId ? "border-blue-500 text-blue-400" : ""
                    }`}
                  >
                    {network.name}
                    {wallet.chainId === network.chainId && <CheckCircle className="h-3 w-3 ml-2" />}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 flex-1 bg-transparent"
                asChild
              >
                <a href={`https://etherscan.io/address/${wallet.account}`} target="_blank" rel="noopener noreferrer">
                  View on Explorer
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWallet({ isConnected: false, account: null, chainId: null, balance: null })}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
