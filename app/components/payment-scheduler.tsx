"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, DollarSign, CheckCircle, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ScheduledPayment {
  id: string
  recipient: string
  amount: string
  chain: string
  frequency: string
  startDate: Date
  endDate?: Date
  status: "active" | "paused" | "completed"
}

const SUPPORTED_CHAINS = [
  { id: "1", name: "Ethereum", symbol: "ETH", color: "blue" },
  { id: "137", name: "Polygon", symbol: "MATIC", color: "purple" },
  { id: "42161", name: "Arbitrum", symbol: "ARB", color: "orange" },
  { id: "10", name: "Optimism", symbol: "OP", color: "red" },
  { id: "56", name: "BSC", symbol: "BNB", color: "yellow" },
  { id: "43114", name: "Avalanche", symbol: "AVAX", color: "green" },
]

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily", description: "Every 24 hours" },
  { value: "weekly", label: "Weekly", description: "Every 7 days" },
  { value: "monthly", label: "Monthly", description: "Every 30 days" },
  { value: "quarterly", label: "Quarterly", description: "Every 90 days" },
]

export function PaymentScheduler() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedChain, setSelectedChain] = useState("")
  const [frequency, setFrequency] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient || !amount || !selectedChain || !frequency || !startDate) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Show success animation
    setShowSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setRecipient("")
      setAmount("")
      setSelectedChain("")
      setFrequency("")
      setStartDate(undefined)
      setEndDate(undefined)
      setShowSuccess(false)
      setIsSubmitting(false)
    }, 3000)
  }

  const isFormValid = recipient && amount && selectedChain && frequency && startDate

  const selectedChainData = SUPPORTED_CHAINS.find((chain) => chain.id === selectedChain)
  const selectedFrequencyData = FREQUENCY_OPTIONS.find((freq) => freq.value === frequency)

  if (showSuccess) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-bounce mb-4">
            <CheckCircle className="h-16 w-16 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Payment Scheduled!</h3>
          <p className="text-gray-400 text-center">
            Your recurring payment has been successfully scheduled and will begin on{" "}
            {startDate && format(startDate, "PPP")}.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Schedule Payment
        </CardTitle>
        <CardDescription className="text-gray-400">Set up recurring USDC payments across chains</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-white">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Amount and Chain */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">
                Amount (USDC)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Chain</Label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id} className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span>{chain.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {chain.symbol}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label className="text-white">Payment Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {FREQUENCY_OPTIONS.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value} className="text-white hover:bg-gray-700">
                    <div>
                      <div className="font-medium">{freq.label}</div>
                      <div className="text-sm text-gray-400">{freq.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                      !startDate && "text-gray-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-white">End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                      !endDate && "text-gray-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "No end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Payment Summary */}
          {isFormValid && (
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{amount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain:</span>
                  <span className="text-white">{selectedChainData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Frequency:</span>
                  <span className="text-white">{selectedFrequencyData?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Start Date:</span>
                  <span className="text-white">{startDate && format(startDate, "PPP")}</span>
                </div>
                {endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">End Date:</span>
                    <span className="text-white">{format(endDate, "PPP")}</span>
                  </div>
                )}
                <Separator className="bg-gray-700" />
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Estimated Gas:</span>
                  <span className="text-green-400">~$0.50</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Scheduling Payment...
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Payment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
