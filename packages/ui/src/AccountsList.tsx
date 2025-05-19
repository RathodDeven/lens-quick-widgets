import {
  Account,
  AccountsOrderBy,
  FollowersOrderBy,
  FollowingOrderBy,
  PageSize,
  useAccount,
  useAccounts,
  useAccountsAvailable,
  useAccountsBulk,
  useFollowers,
  useFollowing,
} from "@lens-protocol/react"
import React, { useEffect, useState, useRef, useCallback } from "react"
import { Account as AccountComponet } from "./Account"
import { Size, Theme } from "./types"

interface AccountsListProps {
  // Search parameters - only one should be used at a time
  searchBy?: string
  addresses?: string[]
  ownedBy?: string[]
  localNames?: string[]
  managedBy?: string
  followersOf?: string
  followingsOf?: string

  // Common parameters
  pageSize?: PageSize
  theme?: Theme
  accountSize?: Size
  orderBy?: AccountsOrderBy
  followersOrderBy?: FollowersOrderBy
  followingOrderBy?: FollowingOrderBy

  // Optional callback when an account is clicked
  onAccountClick?: (account: any) => void

  // Styles
  containerStyle?: React.CSSProperties
  accountStyle?: React.CSSProperties

  // Account component props to pass through
  followButtonStyle?: React.CSSProperties
  followButtonContainerStyle?: React.CSSProperties
  followButtonTextColor?: string
  hideFollowButton?: boolean
  showUnfollowButton?: boolean
  onFollowed?: () => void
  fontSize?: string
}

export const AccountsList: React.FC<AccountsListProps> = ({
  searchBy,
  addresses = [],
  ownedBy = [],
  localNames = [],
  managedBy,
  followersOf,
  followingsOf,
  pageSize = PageSize.Ten,
  theme,
  accountSize = Size.small,
  orderBy = AccountsOrderBy.BestMatch,
  followersOrderBy = FollowersOrderBy.AccountScore,
  followingOrderBy = FollowingOrderBy.AccountScore,
  onAccountClick,
  containerStyle,
  accountStyle,
  // Additional props for Account component
  followButtonStyle,
  followButtonContainerStyle,
  followButtonTextColor,
  hideFollowButton,
  showUnfollowButton,
  onFollowed,
  fontSize,
}) => {
  // State management
  const [accounts, setAccounts] = useState<Account[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  console.log("accounts", accounts)

  // Get follower/following account address from handle if provided
  const { data: followerAccount } = useAccount({
    username: followersOf ? { localName: followersOf } : undefined,
  })

  const { data: followingAccount } = useAccount({
    username: followingsOf ? { localName: followingsOf } : undefined,
  })

  // Determine which hook to use based on props
  const {
    data: searchAccounts,
    loading: searchLoading,
    error: searchError,
  } = useAccounts({
    filter: searchBy
      ? {
          searchBy: {
            localNameQuery: searchBy,
          },
        }
      : undefined,
    orderBy,
    pageSize,
    cursor: searchBy ? cursor : null,
  })

  const {
    data: bulkAccounts,
    loading: bulkLoading,
    error: bulkError,
  } = useAccountsBulk({
    addresses: addresses.length > 0 ? addresses : undefined,
    ownedBy: ownedBy.length > 0 ? ownedBy : undefined,
    usernames:
      localNames?.length > 0
        ? localNames.map((name) => ({ localName: name }))
        : undefined,
  })

  const {
    data: availableAccounts,
    loading: availableLoading,
    error: availableError,
  } = useAccountsAvailable({
    managedBy: managedBy || undefined,
    includeOwned: true,
    cursor: managedBy ? cursor : null,
    pageSize,
  })

  const {
    data: followers,
    loading: followersLoading,
    error: followersError,
  } = useFollowers({
    account: followerAccount?.address || undefined,
    cursor: followerAccount?.address ? cursor : null,
    orderBy: followersOrderBy,
    pageSize,
  })

  const {
    data: following,
    loading: followingLoading,
    error: followingError,
  } = useFollowing({
    account: followingAccount?.address || undefined,
    cursor: followingAccount?.address ? cursor : null,
    orderBy: followingOrderBy,
    pageSize,
  })

  // Update accounts when new data is fetched
  useEffect(() => {
    if (searchBy && searchAccounts) {
      const newAccounts = cursor
        ? [...accounts, ...searchAccounts.items]
        : [...searchAccounts.items]
      setAccounts(newAccounts)
      setNextCursor(searchAccounts.pageInfo.next)
      setHasMore(!!searchAccounts.pageInfo.next)
    } else if (
      (addresses.length > 0 || ownedBy.length > 0 || localNames.length > 0) &&
      bulkAccounts
    ) {
      setAccounts([...bulkAccounts])
      setHasMore(false) // No pagination for bulk accounts
    } else if (managedBy && availableAccounts) {
      const newAccounts = cursor
        ? [...accounts, ...availableAccounts.items.map((item) => item.account)]
        : [...availableAccounts.items.map((item) => item.account)]
      setAccounts(newAccounts)
      setNextCursor(availableAccounts.pageInfo.next)
      setHasMore(!!availableAccounts.pageInfo.next)
    } else if (followersOf && followers) {
      const newAccounts = cursor
        ? [...accounts, ...followers.items.map((item) => item.follower)]
        : [...followers.items.map((item) => item.follower)]
      setAccounts(newAccounts)
      setNextCursor(followers.pageInfo.next)
      setHasMore(!!followers.pageInfo.next)
    } else if (followingsOf && following) {
      const newAccounts = cursor
        ? [...accounts, ...following.items.map((item) => item.following)]
        : [...following.items.map((item) => item.following)]
      setAccounts(newAccounts)
      setNextCursor(following.pageInfo.next)
      setHasMore(!!following.pageInfo.next)
    }

    setIsLoading(false)
  }, [searchAccounts, bulkAccounts, availableAccounts, followers, following])

  // Intersection observer for infinite scrolling
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      console.log("observer handle")
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoading && nextCursor) {
        console.log("setting next cursor")
        setIsLoading(true)
        // Only update the cursor when user scrolls to the bottom
        setCursor(nextCursor)
      }
    },
    [hasMore, isLoading, nextCursor]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [handleObserver])

  // Determine loading state
  const loading =
    searchLoading ||
    bulkLoading ||
    availableLoading ||
    followersLoading ||
    followingLoading

  // Style for the responsive grid container
  const gridContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    width: "100%",
    ...containerStyle,
  }

  // Style for individual account containers
  const accountContainerStyle: React.CSSProperties = {
    margin: "0 auto",
    width: "100%",
    ...accountStyle,
  }

  return (
    <div>
      <div style={gridContainerStyle}>
        {accounts.map((account, index) => (
          <div key={account.address || index} style={accountContainerStyle}>
            <AccountComponet
              account={account}
              theme={theme}
              size={accountSize}
              onClick={
                onAccountClick ? () => onAccountClick(account) : undefined
              }
              // Pass through additional props to Account component
              followButtonStyle={followButtonStyle}
              followButtonContainerStyle={followButtonContainerStyle}
              followButtonTextColor={followButtonTextColor}
              hideFollowButton={hideFollowButton}
              showUnfollowButton={showUnfollowButton}
              onFollowed={onFollowed}
              fontSize={fontSize}
            />
          </div>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading accounts...
        </div>
      )}

      {/* No accounts found */}
      {!loading && accounts.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No accounts found
        </div>
      )}

      {/* Observer target for infinite scrolling */}
      {hasMore && (
        <div
          ref={observerTarget}
          style={{ height: "20px", margin: "20px 0" }}
        ></div>
      )}
    </div>
  )
}
