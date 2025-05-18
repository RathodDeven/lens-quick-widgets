'use client'
import React from 'react'
import { getDefaultConfig } from 'connectkit'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { lens } from 'wagmi/chains'
import { LensWidgetProvider } from '@lens-quick-widgets/ui'

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [lens],
    transports: {
      // RPC URL for each chain
      [lens.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      )
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: 'Lens Quick Widget',

    // Optional App Info
    appDescription:
      'Lens Quick Widget is a simple and easy to use widget for Lens Protocol',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png' // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

const WagmiWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <LensWidgetProvider>{children}</LensWidgetProvider>
    </WagmiProvider>
  )
}

export default WagmiWrapper
