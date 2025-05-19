import {
  ContentWarning,
  EvmAddress,
  MainContentFocus,
  PageSize,
  Post as PostType,
  PostId,
  PostType as LensPostType,
  useAccount,
  usePosts,
  AnyPost,
} from "@lens-protocol/react"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Post } from "./Post"
import { Theme } from "./types"

interface PostsListProps {
  // Filtering parameters
  accountScore?:
    | {
        atLeast: number
      }
    | {
        lessThan: number
      }
    | null
    | undefined
  apps?: EvmAddress[] | null | undefined
  authors?: EvmAddress[] | null | undefined
  metadata?:
    | {
        contentWarning?:
          | {
              oneOf: ContentWarning[]
            }
          | null
          | undefined
        tags?:
          | {
              all?: string[] | null | undefined
              oneOf?: string[] | null | undefined
            }
          | null
          | undefined
        mainContentFocus?: MainContentFocus[] | null | undefined
      }
    | null
    | undefined
  posts?: PostId[] | null | undefined
  postTypes?: LensPostType[] | null | undefined
  searchQuery?: string | null | undefined

  // Special parameter to get posts from a specific account by localName
  postsOf?: string | null | undefined

  // Display options
  pageSize?: PageSize
  theme?: Theme
  widthOfPostCard?: string | number

  // Event handlers
  onPostClick?: (post: AnyPost) => void
  onLike?: (post: AnyPost) => void
  onRepost?: (post: AnyPost) => void

  // Styles
  containerStyle?: React.CSSProperties
  postStyle?: React.CSSProperties
  postContainerStyle?: React.CSSProperties

  // Post component props to pass through
  hideInteractions?: boolean
  showStats?: boolean
  showFollow?: boolean
  showUnfollowButton?: boolean
  contentPreviewLimit?: number
  visibleStats?: Array<
    | "upvotes"
    | "comments"
    | "reposts"
    | "quotes"
    | "bookmarks"
    | "collects"
    | "tips"
  >
  visibleButtons?: Array<"like" | "repost" | "comment">
}

export const PostsList: React.FC<PostsListProps> = ({
  accountScore,
  apps,
  authors = [],
  metadata,
  posts,
  postTypes,
  searchQuery,
  postsOf,
  pageSize = PageSize.Ten,
  theme,
  widthOfPostCard = "100%",
  onPostClick,
  onLike,
  onRepost,
  containerStyle,
  postStyle,
  postContainerStyle,
  // Post component props
  hideInteractions,
  showStats = true,
  showFollow = true,
  showUnfollowButton = false,
  contentPreviewLimit,
  visibleStats,
  visibleButtons,
}) => {
  // State management
  const [allPosts, setAllPosts] = useState<AnyPost[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  // If postsOf is provided, we need to get the account address
  const { data: accountData } = useAccount({
    username: postsOf ? { localName: postsOf } : undefined,
  })

  // Combine authors array with account address if postsOf is provided
  const effectiveAuthors = accountData?.address
    ? [...(authors ?? []), accountData.address as EvmAddress]
    : authors

  // Reset posts when filter parameters change
  useEffect(() => {
    // Reset posts, cursor and loading state
    setAllPosts([])
    setCursor(null)
    setNextCursor(null)
    setHasMore(true)
    setIsLoading(false)
  }, [
    // Add all filter parameters as dependencies
    searchQuery,
    postsOf,
    pageSize,
    JSON.stringify(accountScore),
    JSON.stringify(apps),
    JSON.stringify(authors),
    JSON.stringify(metadata),
    JSON.stringify(posts),
    JSON.stringify(postTypes),
  ])

  // Fetch posts using the usePosts hook
  const { data: postsData, loading: postsLoading } = usePosts({
    cursor,
    pageSize,
    filter: {
      accountScore,
      apps,
      authors:
        effectiveAuthors && effectiveAuthors?.length > 0
          ? effectiveAuthors
          : undefined,
      metadata,
      posts,
      postTypes,
      searchQuery,
    },
  })

  // Update posts when new data is fetched
  useEffect(() => {
    if (postsData) {
      const newPosts = cursor
        ? [...allPosts, ...postsData.items]
        : [...postsData.items]
      setAllPosts(newPosts as PostType[])
      setNextCursor(postsData.pageInfo.next)
      setHasMore(!!postsData.pageInfo.next)
      setIsLoading(false)
    }
  }, [postsData])

  // Intersection observer for infinite scrolling
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoading && nextCursor) {
        setIsLoading(true)
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

  // Style for the container
  const gridContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    ...containerStyle,
  }

  // Style for individual post containers
  const postContainerStyleCombined: React.CSSProperties = {
    width: widthOfPostCard,
    margin: "0 auto",
    ...postStyle,
  }

  return (
    <div>
      <div style={gridContainerStyle}>
        {allPosts.map((post, index) => (
          <div key={post.id || index} style={postContainerStyle}>
            <Post
              post={post}
              theme={theme}
              onClick={onPostClick ? () => onPostClick(post) : undefined}
              onLike={onLike}
              onRepost={onRepost}
              containerStyle={postContainerStyleCombined}
              // Pass through additional props to Post component
              hideInteractions={hideInteractions}
              showStats={showStats}
              showFollow={showFollow}
              showUnfollowButton={showUnfollowButton}
              contentPreviewLimit={contentPreviewLimit}
              visibleStats={visibleStats}
              visibleButtons={visibleButtons}
            />
          </div>
        ))}
      </div>

      {/* Loading state */}
      {postsLoading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading posts...
        </div>
      )}

      {/* No posts found */}
      {!postsLoading && allPosts.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No posts found
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
