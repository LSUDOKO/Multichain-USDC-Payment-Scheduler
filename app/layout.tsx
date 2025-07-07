import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cross Chain USDC Payment Scheduler',
  description: 'Automate your USDC payments across multiple blockchains with intelligent fee optimization, cross-chain bridging, and enterprise-grade security.',
  generator: 'ARPIT',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
