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

/**
 * PostsList Component - Displays a filterable, infinite-scrolling list of Lens Protocol posts
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.accountScore] - Filter posts by account score
 * @param {EvmAddress[]} [props.apps] - Filter posts by apps that created them
 * @param {EvmAddress[]} [props.authors] - Filter posts by authors' addresses
 * @param {Object} [props.metadata] - Filter posts by metadata (content warnings, tags, etc.)
 * @param {PostId[]} [props.posts] - Specific post IDs to display
 * @param {LensPostType[]} [props.postTypes] - Types of posts to display
 * @param {string} [props.searchQuery] - Text search query for posts
 * @param {string} [props.postsOf] - Username to fetch posts from (by local name)
 * @param {PageSize} [props.pageSize=PageSize.Ten] - Number of posts to load per page
 * @param {Theme} [props.theme] - The theme to use for styling
 * @param {string|number} [props.widthOfPostCard="100%"] - Width of each post card
 * @param {Function} [props.onPostClick] - Callback when a post is clicked
 * @param {Function} [props.onLike] - Callback when a post is liked
 * @param {Function} [props.onRepost] - Callback when a post is reposted
 * @param {React.CSSProperties} [props.containerStyle] - Custom container style
 * @param {React.CSSProperties} [props.postStyle] - Custom post style
 * @param {React.CSSProperties} [props.postContainerStyle] - Custom post container style
 * @param {boolean} [props.hideInteractions] - Whether to hide interaction buttons
 * @param {boolean} [props.showStats=true] - Whether to show post stats
 * @param {boolean} [props.showFollow=true] - Whether to show follow button
 * @param {boolean} [props.showUnfollowButton=false] - Whether to show unfollow button
 * @param {number} [props.contentPreviewLimit] - Character limit for post content preview
 * @param {Array<string>} [props.visibleStats] - Which stats to display
 * @param {Array<string>} [props.visibleButtons] - Which interaction buttons to display
 * @returns {JSX.Element} The rendered posts list with infinite scrolling
 */
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
