'use client'

import { useSearchParams } from 'next/navigation'
import { SignInWithLens, Theme } from '@lens-quick-widgets/ui'

export default function SignInWithLensEmbed() {
  const searchParams = useSearchParams()

  // Extract parameters from URL with null check
  const theme = (searchParams?.get('theme') as Theme) || Theme.default

  // Handle callbacks
  const handleConnectWallet = (address: string) => {
    console.log('Wallet connected:', address)
  }

  const handleLogin = (account: any) => {
    console.log('Logged in as:', account.username?.localName || account.address)
  }

  const handleLogout = () => {
    console.log('Logged out successfully')
  }

  return (
    <SignInWithLens
      theme={theme}
      onConnectWallet={handleConnectWallet}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  )
}
