'use client'

import { useSearchParams } from 'next/navigation'
import { Account, Theme, Size } from '@lens-quick-widgets/ui'

export default function AccountEmbed() {
  const searchParams = useSearchParams()

  // Extract parameters from URL with null check
  const localName = searchParams?.get('localName') || 'stani'
  const accountAddress = searchParams?.get('accountAddress') || undefined
  const theme = (searchParams?.get('theme') as Theme) || Theme.light
  const size = (searchParams?.get('size') as Size) || Size.medium
  const hideFollowButton = searchParams?.get('hideFollowButton') === 'true'
  const showUnfollowButton = searchParams?.get('showUnfollowButton') === 'true'
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
      fontSize={fontSize}
      onAccountLoad={handleAccountLoad}
      onClick={handleAccountClick}
      onFollowed={handleFollowed}
    />
  )
}
