"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)

          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setChainId(Number.parseInt(chainId, 16))

          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })
          setBalance((Number.parseInt(balance, 16) / 1e18).toFixed(4))
        }
      } catch (err) {
        console.error("Error checking connection:", err)
      }
    }
  }

  const connectWallet = async () => {
    setError(null)
    if (!(window as any).ethereum) {
      setError("MetaMask is not installed")
      return
    }
    try {
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      setIsConnected(true)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    }
  }

  const switchChain = async (targetChainId: number) => {
    if (typeof window.ethereum === "undefined") return

    const chainConfigs = {
      11155111: {
        chainId: "0xaa36a7",
        chainName: "Sepolia test network",
        rpcUrls: ["https://sepolia.infura.io/v3/"],
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      },
      80001: {
        chainId: "0x13881",
        chainName: "Mumbai",
        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
      },
      421614: {
        chainId: "0x66eee",
        chainName: "Arbitrum Sepolia",
        rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://sepolia.arbiscan.io/"],
      },
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainConfigs[targetChainId as keyof typeof chainConfigs].chainId }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [chainConfigs[targetChainId as keyof typeof chainConfigs]],
          })
        } catch (addError) {
          console.error("Error adding chain:", addError)
        }
      }
    }
  }

  useEffect(() => {
    checkConnection()
    const { ethereum } = window as any
    if (!ethereum) return
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
      } else {
        setAccount(null)
        setIsConnected(false)
      }
    }
    ethereum.on("accountsChanged", handleAccountsChanged)
    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged)
    }
  }, [])

  return {
    isConnected,
    account,
    chainId,
    balance,
    error,
    connectWallet,
    switchChain,
  }
}
