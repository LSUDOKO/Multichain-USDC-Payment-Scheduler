"use client"

import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { PaymentScheduler } from "../components/payment-scheduler"
import { PaymentExecutor } from "../components/payment-executor"
import { FeeOptimizer } from "../components/fee-optimizer"
import { MetaMaskConnector } from "../components/metamask-connector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, TrendingDown, Wallet } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">Payment Management</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Manage Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              USDC Payments
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Schedule, execute, and optimize your USDC payments across multiple blockchains with our comprehensive
            payment management suite.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedule" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-800">
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="execute"
              className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
            >
              <Play className="h-4 w-4 mr-2" />
              Execute
            </TabsTrigger>
            <TabsTrigger
              value="optimize"
              className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Optimize
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PaymentScheduler />
              </div>
              <div>
                <FeeOptimizer />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="execute" className="space-y-6">
            <PaymentExecutor />
          </TabsContent>

          <TabsContent value="optimize" className="space-y-6">
            <FeeOptimizer />
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <MetaMaskConnector />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
