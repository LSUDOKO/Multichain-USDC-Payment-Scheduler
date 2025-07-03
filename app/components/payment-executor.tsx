"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause, ExternalLink, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface PendingPayment {
  id: string
  recipient: string
  amount: string
  chain: string
  scheduledFor: Date
  status: "pending" | "executing" | "completed" | "failed"
  txHash?: string
  estimatedGas: string
  progress?: number
}

const MOCK_PAYMENTS: PendingPayment[] = [
  {
    id: "1",
    recipient: "0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C",
    amount: "100.00",
    chain: "Arbitrum",
    scheduledFor: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    status: "pending",
    estimatedGas: "$0.12",
  },
  {
    id: "2",
    recipient: "0x8ba1f109551bD432803012645Hac136c22C4C4C4",
    amount: "250.00",
    chain: "Polygon",
    scheduledFor: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    status: "executing",
    estimatedGas: "$0.05",
    progress: 65,
  },
  {
    id: "3",
    recipient: "0x1234567890123456789012345678901234567890",
    amount: "50.00",
    chain: "Optimism",
    scheduledFor: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    status: "completed",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    estimatedGas: "$0.02",
  },
  {
    id: "4",
    recipient: "0x9876543210987654321098765432109876543210",
    amount: "75.00",
    chain: "Ethereum",
    scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    status: "pending",
    estimatedGas: "$2.50",
  },
]

export function PaymentExecutor() {
  const [payments, setPayments] = useState<PendingPayment[]>(MOCK_PAYMENTS)
  const [isExecutingAll, setIsExecutingAll] = useState(false)

  // Simulate payment execution progress
  useEffect(() => {
    const interval = setInterval(() => {
      setPayments((prev) =>
        prev.map((payment) => {
          if (payment.status === "executing" && payment.progress !== undefined) {
            const newProgress = Math.min(payment.progress + Math.random() * 10, 100)
            if (newProgress >= 100) {
              return {
                ...payment,
                status: "completed",
                progress: 100,
                txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
              }
            }
            return { ...payment, progress: newProgress }
          }
          return payment
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const executePayment = (id: string) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === id ? { ...payment, status: "executing", progress: 0 } : payment)),
    )
  }

  const pausePayment = (id: string) => {
    setPayments((prev) => prev.map((payment) => (payment.id === id ? { ...payment, status: "pending" } : payment)))
  }

  const executeAllPending = async () => {
    setIsExecutingAll(true)
    const pendingPayments = payments.filter((p) => p.status === "pending")

    for (const payment of pendingPayments) {
      executePayment(payment.id)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Stagger executions
    }

    setIsExecutingAll(false)
  }

  const getStatusIcon = (status: PendingPayment["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "executing":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getStatusColor = (status: PendingPayment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "executing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
    }
  }

  const getChainColor = (chain: string) => {
    const colors: Record<string, string> = {
      Ethereum: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Polygon: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Arbitrum: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      Optimism: "bg-red-500/20 text-red-400 border-red-500/30",
      BSC: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Avalanche: "bg-green-500/20 text-green-400 border-green-500/30",
    }
    return colors[chain] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  const pendingCount = payments.filter((p) => p.status === "pending").length
  const executingCount = payments.filter((p) => p.status === "executing").length
  const completedCount = payments.filter((p) => p.status === "completed").length

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Play className="h-5 w-5" />
              Payment Executor
            </CardTitle>
            <CardDescription className="text-gray-400">Manage and execute scheduled payments</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={executeAllPending}
              disabled={pendingCount === 0 || isExecutingAll}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isExecutingAll ? "Executing..." : `Execute All (${pendingCount})`}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
            <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
            <div className="text-sm text-yellow-300">Pending</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
            <div className="text-2xl font-bold text-blue-400">{executingCount}</div>
            <div className="text-sm text-blue-300">Executing</div>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
            <div className="text-2xl font-bold text-green-400">{completedCount}</div>
            <div className="text-sm text-green-300">Completed</div>
          </div>
        </div>

        {/* Payment Queue */}
        <div>
          <h4 className="text-white font-medium mb-3">Payment Queue</h4>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                      <Badge className={getChainColor(payment.chain)}>{payment.chain}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {payment.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => executePayment(payment.id)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      {payment.status === "executing" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => pausePayment(payment.id)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      {payment.txHash && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          asChild
                        >
                          <a
                            href={`https://etherscan.io/tx/${payment.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Recipient</p>
                      <p className="text-white font-mono text-xs">
                        {payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-white font-medium">{payment.amount} USDC</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Scheduled For</p>
                      <p className="text-white">{payment.scheduledFor.toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Est. Gas</p>
                      <p className="text-white">{payment.estimatedGas}</p>
                    </div>
                  </div>

                  {payment.status === "executing" && payment.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{Math.round(payment.progress)}%</span>
                      </div>
                      <Progress value={payment.progress} className="bg-gray-700" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
