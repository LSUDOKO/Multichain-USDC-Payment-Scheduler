"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Zap } from "lucide-react"

const stats = [
  {
    icon: DollarSign,
    value: "$2.5M+",
    label: "Total Volume Processed",
    description: "Secure transactions across all chains",
    color: "green",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Active Users",
    description: "Growing community of DeFi enthusiasts",
    color: "blue",
  },
  {
    icon: Zap,
    value: "99.9%",
    label: "Uptime Guarantee",
    description: "Reliable service you can count on",
    color: "yellow",
  },
  {
    icon: TrendingUp,
    value: "90%",
    label: "Average Fee Savings",
    description: "Compared to manual transactions",
    color: "purple",
  },
]

const colorClasses = {
  green: "bg-green-500/20 text-green-400",
  blue: "bg-blue-500/20 text-blue-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  purple: "bg-purple-500/20 text-purple-400",
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">📊 Platform Statistics</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Thousands of
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              DeFi Users
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join our growing community and experience the future of automated cryptocurrency payments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${colorClasses[stat.color as keyof typeof colorClasses]} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-300 mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
