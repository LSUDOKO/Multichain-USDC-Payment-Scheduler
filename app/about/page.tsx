"use client"

import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Globe, Users, Code, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"

const team = [
  {
    name: "Arpit Singh",
    role: "Founder & CEO",
    description: "Former blockchain engineer at Ethereum Foundation with 8+ years in DeFi.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Sarah Kim",
    role: "CTO",
    description: "Smart contract security expert and former Chainlink core developer.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Product",
    description: "Product strategist with experience at Uniswap and Compound.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "Every line of code is audited and tested to ensure your funds are always safe.",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Lightning-fast execution with optimized smart contracts and minimal gas usage.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making DeFi payments accessible to everyone, regardless of technical expertise.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building together with our community of developers and users worldwide.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">🚀 About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Building the Future of
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              DeFi Payments
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make cryptocurrency payments as simple and reliable as traditional banking, while
            maintaining the decentralized principles that make DeFi revolutionary.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                  <p className="text-lg text-black leading-relaxed">
                    Traditional payment systems are slow, expensive, and centralized. DeFi promised to fix this, but
                    managing payments across multiple chains remains complex and costly.
                  </p>
                  <p className="text-lg text-black leading-relaxed">
                    We're building the infrastructure to make cross-chain USDC payments as simple as sending an email,
                    with intelligent automation that saves time and money.
                  </p>
                  <Link href="/payments">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Start Using Our Platform
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="relative">
                  
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we build and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-colors"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white text-xl">{value.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Experienced builders from leading DeFi protocols, united by a vision for better payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-colors"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-pink-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of the future of DeFi payments. Connect with other users, share feedback, and help us build the
              tools that will power the next generation of finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Join Discord Community
              </Button>
              <a href="https://x.com/ARPITSI03544750" target="_blank"><Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-red-300 bg-transparent">
                
                Follow on Twitter
              </Button></a>
              
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
