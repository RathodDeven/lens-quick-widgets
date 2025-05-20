'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Account, Theme, Size } from 'lens-quick-widgets'

// Client component that uses useSearchParams hook
function AccountClient() {
  const searchParams = useSearchParams()

  // Extract parameters from URL with null check
  const localName = searchParams?.get('localName') || 'stani'
  const accountAddress = searchParams?.get('accountAddress') || undefined
  const theme = (searchParams?.get('theme') as Theme) || Theme.light
  const size = (searchParams?.get('size') as Size) || Size.medium
  const hideFollowButton = searchParams?.get('hideFollowButton') === 'true'
  const showUnfollowButton = searchParams?.get('showUnfollowButton') === 'true'
  const showHeyButton = searchParams?.get('showHeyButton') === 'true'
  const fontSize = searchParams?.get('fontSize') || undefined

  // Handle callbacks
  const handleAccountLoad = (account: any) => {
    console.log('Account loaded:', account)
  }

  const handleAccountClick = (account: any, stats: any) => {
    console.log(
      'Account clicked:',
      account.username?.localName,
      'Stats:',
      stats
    )
  }

  const handleFollowed = () => {
    console.log('Account followed/unfollowed')
  }

  return (
    <Account
      localName={localName}
      accountAddress={accountAddress}
      theme={theme}
      size={size}
      hideFollowButton={hideFollowButton}
      showUnfollowButton={showUnfollowButton}
      showHeyButton={showHeyButton}
      fontSize={fontSize}
      onAccountLoad={handleAccountLoad}
      onClick={handleAccountClick}
      onFollowed={handleFollowed}
    />
  )
}

// Page component with Suspense boundary
export default function AccountEmbed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountClient />
    </Suspense>
  )
}
