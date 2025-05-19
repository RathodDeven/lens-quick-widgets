'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SignInWithLens, Theme } from 'lens-quick-widgets'

// Client component that uses useSearchParams hook
function SignInWithLensClient() {
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

// Page component with Suspense boundary
export default function SignInWithLensEmbed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInWithLensClient />
    </Suspense>
  )
}
