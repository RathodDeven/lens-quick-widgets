'use client'

import { useSearchParams } from 'next/navigation'
import {
  AccountsList,
  PageSize,
  AccountsOrderBy,
  FollowersOrderBy,
  FollowingOrderBy,
  Theme,
  Size
} from '@lens-quick-widgets/ui'

export default function AccountsListEmbed() {
  const searchParams = useSearchParams()

  // Extract parameters from URL with null check
  const theme = (searchParams?.get('theme') as Theme) || Theme.light
  const accountSize = (searchParams?.get('accountSize') as Size) || Size.small
  const pageSize =
    searchParams?.get('pageSize') === 'fifty' ? PageSize.Fifty : PageSize.Ten
  const searchBy = searchParams?.get('searchBy') || undefined

  // Handle local names (comma-separated list)
  const localNamesParam = searchParams?.get('localNames')
  const localNames = localNamesParam ? localNamesParam.split(',') : undefined

  const followersOf = searchParams?.get('followersOf') || undefined
  const followingsOf = searchParams?.get('followingsOf') || undefined
  const managedBy = searchParams?.get('managedBy') || undefined

  // Parse orderBy parameters
  const orderBy =
    (searchParams?.get('orderBy') as AccountsOrderBy) ||
    AccountsOrderBy.BestMatch
  const followersOrderBy =
    (searchParams?.get('followersOrderBy') as FollowersOrderBy) ||
    FollowersOrderBy.AccountScore
  const followingOrderBy =
    (searchParams?.get('followingOrderBy') as FollowingOrderBy) ||
    FollowingOrderBy.AccountScore

  const hideFollowButton = searchParams?.get('hideFollowButton') === 'true'
  const showUnfollowButton = searchParams?.get('showUnfollowButton') === 'true'
  const fontSize = searchParams?.get('fontSize') || undefined

  // Handle callbacks
  const handleAccountClick = (account: any) => {
    console.log('Account clicked:', account)
  }

  const handleFollowed = () => {
    console.log('Account followed/unfollowed')
  }

  return (
    <AccountsList
      theme={theme}
      accountSize={accountSize}
      pageSize={pageSize}
      searchBy={searchBy}
      localNames={localNames}
      followersOf={followersOf}
      followingsOf={followingsOf}
      managedBy={managedBy}
      orderBy={orderBy}
      followersOrderBy={followersOrderBy}
      followingOrderBy={followingOrderBy}
      hideFollowButton={hideFollowButton}
      showUnfollowButton={showUnfollowButton}
      fontSize={fontSize}
      onAccountClick={handleAccountClick}
      onFollowed={handleFollowed}
    />
  )
}
