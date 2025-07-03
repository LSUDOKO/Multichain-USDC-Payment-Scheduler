"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Repeat, BarChart3, Shield, Zap, Globe } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Automated Scheduling",
    description:
      "Set up recurring payments with flexible scheduling options - daily, weekly, monthly, or custom intervals.",
    benefits: ["Never miss a payment", "Flexible scheduling", "Automatic execution"],
    color: "blue",
  },
  {
    icon: Repeat,
    title: "Cross-Chain Bridging",
    description: "Seamlessly transfer USDC across multiple blockchains using LI.FI's advanced bridging technology.",
    benefits: ["6+ supported chains", "Best route optimization", "Minimal slippage"],
    color: "purple",
  },
  {
    icon: BarChart3,
    title: "Fee Optimization",
    description: "AI-powered gas fee analysis helps you choose the most cost-effective chain for your transactions.",
    benefits: ["Save up to 90% on fees", "Real-time gas tracking", "Smart recommendations"],
    color: "green",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with smart contract audits, multi-sig support, and non-custodial architecture.",
    benefits: ["Audited smart contracts", "Non-custodial", "Multi-sig support"],
    color: "red",
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Execute payments in seconds with optimized smart contracts and efficient blockchain interactions.",
    benefits: ["Sub-second execution", "Batch processing", "Low latency"],
    color: "yellow",
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    description: "Access your payment scheduler from anywhere in the world with our decentralized infrastructure.",
    benefits: ["24/7 availability", "Global access", "Decentralized"],
    color: "cyan",
  },
]

const colorClasses = {
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  green: "bg-green-500/20 text-green-400 border-green-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
}

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">✨ Powerful Features</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need for
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              DeFi Payments
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our comprehensive suite of tools makes managing USDC payments across multiple blockchains simple, secure,
            and cost-effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 group"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-white text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
