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

/**
 * AccountsList Component - Displays a list of Lens Protocol accounts with various filtering options
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.searchBy] - Search accounts by username
 * @param {string[]} [props.addresses] - Array of account addresses to display
 * @param {string[]} [props.ownedBy] - Array of owner addresses to show accounts owned by
 * @param {string[]} [props.localNames] - Array of local names to fetch accounts for
 * @param {string} [props.managedBy] - Address of the manager to fetch managed accounts
 * @param {string} [props.followersOf] - Show followers of an account (by local name)
 * @param {string} [props.followingsOf] - Show accounts followed by an account (by local name)
 * @param {PageSize} [props.pageSize=PageSize.Ten] - Number of accounts to load per page
 * @param {Theme} [props.theme] - The theme to use for styling
 * @param {Size} [props.accountSize=Size.small] - Size of the account components
 * @param {AccountsOrderBy} [props.orderBy=AccountsOrderBy.BestMatch] - Order for accounts query
 * @param {FollowersOrderBy} [props.followersOrderBy=FollowersOrderBy.AccountScore] - Order for followers query
 * @param {FollowingOrderBy} [props.followingOrderBy=FollowingOrderBy.AccountScore] - Order for following query
 * @param {Function} [props.onAccountClick] - Callback when an account is clicked
 * @param {React.CSSProperties} [props.containerStyle] - Custom container style
 * @param {React.CSSProperties} [props.accountStyle] - Custom account component style
 * @param {React.CSSProperties} [props.followButtonStyle] - Custom follow button style
 * @param {React.CSSProperties} [props.followButtonContainerStyle] - Custom follow button container style
 * @param {string} [props.followButtonTextColor] - Custom follow button text color
 * @param {boolean} [props.hideFollowButton] - Whether to hide the follow button
 * @param {boolean} [props.showUnfollowButton] - Whether to show the unfollow button for followed users
 * @param {Function} [props.onFollowed] - Callback when user is followed
 * @param {string} [props.fontSize] - Custom font size for account components
 * @returns {JSX.Element} The rendered accounts list
 */
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

  // Reset accounts when filter parameters change
  useEffect(() => {
    // Reset accounts, cursor and loading state
    setAccounts([])
    setCursor(null)
    setNextCursor(null)
    setHasMore(true)
    setIsLoading(false)
  }, [
    // Add all filter parameters as dependencies
    searchBy,
    JSON.stringify(addresses),
    JSON.stringify(ownedBy),
    JSON.stringify(localNames),
    managedBy,
    followersOf,
    followingsOf,
    pageSize,
    orderBy,
    followersOrderBy,
    followingOrderBy,
  ])

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
