"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, RefreshCw, Zap, Network, Clock } from "lucide-react"
import { lifiService, type LiFiStatus } from "@/app/lib/lifi-integration"

export function LiFiIntegration() {
  const [status, setStatus] = useState<LiFiStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  const checkStatus = async () => {
    try {
      setChecking(true)
      const result = await lifiService.getStatus()
      setStatus(result)
    } catch (error) {
      console.error("Failed to check LiFi status:", error)
    } finally {
      setLoading(false)
      setChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()

    // Check status every 60 seconds
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (isConnected: boolean) => {
    return isConnected
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30"
  }

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 1000) return "text-green-400"
    if (responseTime < 3000) return "text-yellow-400"
    return "text-red-400"
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            LiFi Integration
          </CardTitle>
          <CardDescription className="text-gray-400">Cross-chain bridge connectivity status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full bg-gray-800" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-12 bg-gray-800" />
            <Skeleton className="h-12 bg-gray-800" />
            <Skeleton className="h-12 bg-gray-800" />
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
              <Activity className="h-5 w-5" />
              LiFi Integration
            </CardTitle>
            <CardDescription className="text-gray-400">Cross-chain bridge connectivity and performance</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            disabled={checking}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {status && (
          <>
            {/* Connection Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${status.isConnected ? "bg-green-400" : "bg-red-400"} animate-pulse`}
                />
                <span className="text-white font-medium">API Connection</span>
              </div>
              <Badge className={getStatusColor(status.isConnected)}>
                {status.isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                <Clock className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">Response Time</p>
                <p className={`text-lg font-bold ${getResponseTimeColor(status.responseTime)}`}>
                  {status.responseTime}ms
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                <Network className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">Supported Chains</p>
                <p className="text-lg font-bold text-blue-400">{status.supportedChains}</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                <Zap className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">Bridge Tools</p>
                <p className="text-lg font-bold text-purple-400">{status.supportedTools}</p>
              </div>
            </div>

            {/* Status Details */}
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <h4 className="text-white font-medium mb-3">Integration Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Health Check:</span>
                  <span className="text-white">{status.lastChecked.toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">API Version:</span>
                  <span className="text-white">v3.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Integration Status:</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {status.isConnected && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 flex-1 bg-transparent"
                >
                  View Supported Chains
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 flex-1 bg-transparent"
                >
                  Test Bridge Quote
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
