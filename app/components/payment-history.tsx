"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Search, Download, ExternalLink, Filter } from "lucide-react"

interface PaymentRecord {
  id: string
  recipient: string
  amount: string
  chain: string
  txHash: string
  timestamp: Date
  status: "completed" | "failed" | "pending"
  gasUsed: string
  gasCost: string
}

const MOCK_HISTORY: PaymentRecord[] = [
  {
    id: "1",
    recipient: "0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C",
    amount: "100.00",
    chain: "Arbitrum",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "completed",
    gasUsed: "21000",
    gasCost: "$0.12",
  },
  {
    id: "2",
    recipient: "0x8ba1f109551bD432803012645Hac136c22C4C4C4",
    amount: "250.00",
    chain: "Polygon",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: "completed",
    gasUsed: "21000",
    gasCost: "$0.05",
  },
  {
    id: "3",
    recipient: "0x1234567890123456789012345678901234567890",
    amount: "50.00",
    chain: "Optimism",
    txHash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: "completed",
    gasUsed: "21000",
    gasCost: "$0.02",
  },
  {
    id: "4",
    recipient: "0x9876543210987654321098765432109876543210",
    amount: "75.00",
    chain: "Ethereum",
    txHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: "failed",
    gasUsed: "21000",
    gasCost: "$2.50",
  },
  {
    id: "5",
    recipient: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    amount: "200.00",
    chain: "BSC",
    txHash: "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    status: "completed",
    gasUsed: "21000",
    gasCost: "$0.25",
  },
]

export function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [chainFilter, setChainFilter] = useState("all")

  const filteredHistory = MOCK_HISTORY.filter((payment) => {
    const matchesSearch =
      payment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesChain = chainFilter === "all" || payment.chain === chainFilter

    return matchesSearch && matchesStatus && matchesChain
  })

  const getStatusColor = (status: PaymentRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
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

  const exportToCSV = () => {
    const headers = ["Date", "Recipient", "Amount", "Chain", "Status", "TX Hash", "Gas Cost"]
    const csvData = filteredHistory.map((payment) => [
      payment.timestamp.toISOString(),
      payment.recipient,
      payment.amount,
      payment.chain,
      payment.status,
      payment.txHash,
      payment.gasCost,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "payment-history.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalAmount = filteredHistory.reduce((sum, payment) => sum + Number.parseFloat(payment.amount), 0)
  const totalGasCost = filteredHistory.reduce(
    (sum, payment) => sum + Number.parseFloat(payment.gasCost.replace("$", "")),
    0,
  )
  const completedCount = filteredHistory.filter((p) => p.status === "completed").length

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="h-5 w-5" />
              Payment History
            </CardTitle>
            <CardDescription className="text-gray-400">Track all your USDC payment transactions</CardDescription>
          </div>
          <Button
            onClick={exportToCSV}
            size="sm"
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-white">{filteredHistory.length}</div>
            <div className="text-sm text-gray-400">Total Payments</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-green-400">${totalAmount.toFixed(2)}</div>
            <div className="text-sm text-gray-400">Total Volume</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-blue-400">${totalGasCost.toFixed(2)}</div>
            <div className="text-sm text-gray-400">Total Gas Fees</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by recipient, amount, or tx hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">
                  All Status
                </SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-gray-700">
                  Completed
                </SelectItem>
                <SelectItem value="failed" className="text-white hover:bg-gray-700">
                  Failed
                </SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-gray-700">
                  Pending
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={chainFilter} onValueChange={setChainFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Chain" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">
                  All Chains
                </SelectItem>
                <SelectItem value="Ethereum" className="text-white hover:bg-gray-700">
                  Ethereum
                </SelectItem>
                <SelectItem value="Polygon" className="text-white hover:bg-gray-700">
                  Polygon
                </SelectItem>
                <SelectItem value="Arbitrum" className="text-white hover:bg-gray-700">
                  Arbitrum
                </SelectItem>
                <SelectItem value="Optimism" className="text-white hover:bg-gray-700">
                  Optimism
                </SelectItem>
                <SelectItem value="BSC" className="text-white hover:bg-gray-700">
                  BSC
                </SelectItem>
                <SelectItem value="Avalanche" className="text-white hover:bg-gray-700">
                  Avalanche
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="rounded-lg border border-gray-700 bg-gray-800/50">
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Recipient</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Chain</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Gas Cost</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((payment) => (
                  <TableRow key={payment.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{payment.timestamp.toLocaleDateString()}</div>
                        <div className="text-sm text-gray-400">{payment.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="font-mono text-sm">
                        {payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="font-medium">{payment.amount} USDC</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getChainColor(payment.chain)}>{payment.chain}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                    </TableCell>
                    <TableCell className="text-white">{payment.gasCost}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        asChild
                      >
                        <a href={`https://etherscan.io/tx/${payment.txHash}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No payments found</div>
            <div className="text-sm text-gray-500">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
