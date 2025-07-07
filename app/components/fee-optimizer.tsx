"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingDown, RefreshCw, Zap, DollarSign, Clock } from "lucide-react"
import { type FeeOptimization } from "@/app/lib/fee-optimizer"

export function FeeOptimizer() {
  const [optimization, setOptimization] = useState<FeeOptimization | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOptimization = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/gas-prices')
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      const result = await response.json()
      setOptimization(result)
    } catch (error) {
      console.error("Failed to fetch fee optimization:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOptimization()
    const interval = setInterval(fetchOptimization, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Fee Optimizer
          </CardTitle>
          <CardDescription className="text-gray-400">Finding the best rates across chains...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full bg-gray-800" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full bg-gray-800" />)}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Fee Optimizer
            </CardTitle>
            <CardDescription className="text-gray-400">Real-time gas price comparison across chains</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOptimization}
            disabled={refreshing}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {optimization && (
          <>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-400" />
                  <span className="font-medium text-green-300">Recommended Chain</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Best Value</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{optimization.recommendedChainName}</h3>
                  <p className="text-green-200 text-sm">
                    Save up to ${optimization.estimatedSavingsUsd.toFixed(6)} (
                    {optimization.estimatedSavings.toFixed(1)}%)
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{optimization.estimatedSavings.toFixed(0)}%</div>
                  <div className="text-sm text-green-300">savings</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                All Chain Costs
              </h4>
              {optimization.allChainCosts.map((chain, index) => (
                <div
                  key={chain.chainId}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? "bg-green-400" : index === 1 ? "bg-yellow-400" : "bg-red-400"
                        }`}
                      />
                      <span className="text-white font-medium">{chain.chainName}</span>
                    </div>
                    {chain.recommended && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Recommended</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${chain.gasPriceUsd.toFixed(6)}</div>
                    <div className="text-gray-400 text-sm">{chain.gasPrice.toFixed(2)} gwei</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Potential Savings</span>
                <span className="text-white">{optimization.estimatedSavings.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(optimization.estimatedSavings, 100)} className="bg-green-800" />
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              Last updated: {new Date(optimization.lastUpdated).toLocaleTimeString()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}