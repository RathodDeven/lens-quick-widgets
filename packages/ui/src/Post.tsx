import React, { useState, useEffect } from "react"
import { Theme, ThemeColor, Size } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import {
  AnyPost,
  Post as PostType,
  PostReactionType,
  useAuthenticatedUser,
  usePost,
} from "@lens-protocol/react"
import {
  backgroundColorMap,
  foregroundColorMap,
  textColorMap,
  getContrastColor,
  getStampFyiURL,
} from "./utils"
import {
  FaThumbsUp,
  FaRetweet,
  FaComment,
  FaRegThumbsUp,
  FaExclamationCircle,
  FaBookmark,
  FaCoins,
  FaQuoteRight,
  FaHeart,
} from "react-icons/fa"
import { ImageModal } from "./ImageModal"
import Markup from "./Lexical/Markup"
import { useLensWidget } from "./LensWidgetContext"
import LoginPopUp from "./LoginPopUp"
import toast from "react-hot-toast"
import { LoadingImage } from "./LoadingImage"
import { VideoPlayer } from "./Player"
import getPublicationData from "./getPublicationData"
import FollowButton from "./FollowButton"

// Import hooks for like, repost
import { useAddReaction } from "./hooks/useAddReaction"
import { useUndoReaction } from "./hooks/useUndoReaction"
import { useRepost } from "./hooks/useRepost"
import Tooltip from "./Tooltip"

/**
 * Post Component - Displays a Lens Protocol post with interaction options
 *
 * @component
 * @param {Object} props - Component props
 * @param {AnyPost} props.post - The post to display
 * @param {string} [props.postId] - ID of the post to fetch if post object not provided
 * @param {Theme} [props.theme] - The theme to use for styling
 * @param {React.CSSProperties} [props.containerStyle] - Custom container style
 * @param {Function} [props.onLike] - Callback when post is liked
 * @param {Function} [props.onRepost] - Callback when post is reposted
 * @param {Function} [props.onComment] - Callback when comment button is clicked
 * @param {Function} [props.onClick] - Callback when the post is clicked
 * @param {boolean} [props.hideInteractions] - Whether to hide interaction buttons
 * @param {Function} [props.onLoad] - Callback when post is loaded
 * @param {boolean} [props.showStats] - Whether to show stats section
 * @param {boolean} [props.showFollow] - Whether to show follow button
 * @param {boolean} [props.showUnfollowButton=false] - Whether to show the unfollow button for followed users
 * @param {number} [props.contentPreviewLimit=400] - Character limit for content preview before showing "Show more" button
 * @param {Array<string>} [props.visibleStats] - Array of stat names to display
 * @param {Array<string>} [props.visibleButtons] - Array of interaction button names to display
 * @returns {JSX.Element | null} The rendered Post component
 */
export const Post = ({
  post,
  postId,
  theme,
  containerStyle,
  onLike,
  onRepost,
  onComment,
  onClick,
  hideInteractions = false,
  onLoad,
  showStats = true,
  showFollow = true,
  showUnfollowButton = false,
  contentPreviewLimit = 400,
  visibleStats = [
    "upvotes",
    "comments",
    "reposts",
    "quotes",
    "bookmarks",
    "collects",
    "tips",
  ],
  visibleButtons = ["like", "repost", "comment"],
}: {
  post?: AnyPost
  postId?: string
  theme?: Theme
  containerStyle?: React.CSSProperties
  onLike?: (post: AnyPost) => void
  onRepost?: (post: AnyPost) => void
  onComment?: (post: AnyPost) => void
  onClick?: (post: AnyPost) => void
  hideInteractions?: boolean
  onLoad?: (post: AnyPost) => void
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
}) => {
  // Get the theme from context to use as fallback
  const { theme: contextTheme } = useLensWidget()

  // Use provided theme or fall back to context theme
  const themeToUse = theme || contextTheme

  const backgroundColor = backgroundColorMap[themeToUse]
  const accentColor = foregroundColorMap[themeToUse]
  const textColor = textColorMap[themeToUse]

  // Determine contrast color based on actual background color
  const contrastTextColor = getContrastColor(backgroundColor)
  const isDarkBackground = contrastTextColor === ThemeColor.white
  const { data: fetchedPost, loading: postLoading } = usePost({
    post: postId,
  })

  // Keep track of the current post data - either provided directly or fetched
  const currentPost = post || fetchedPost

  // State to store the actual post content to display (original post for reposts)
  const [displayPost, setDisplayPost] = useState<PostType | undefined>(
    currentPost?.__typename === "Post" ? currentPost : currentPost?.repostOf
  )

  // Keep reference to original post for interactions
  const [originalPost, setOriginalPost] = useState<AnyPost | null | undefined>(
    currentPost
  )

  // Add state for parent post (when the post is a comment)
  const [parentPost, setParentPost] = useState<PostType | null | undefined>(
    null
  )

  const { execute: undoReaction, loading: undoLoading } = useUndoReaction()
  const { execute: addReaction, loading: addLoading } = useAddReaction()
  const { execute: createRepost, loading: repostLoading } = useRepost()

  // Check if post is deleted
  const isDisplayPostDeleted = displayPost?.isDeleted || false
  const isParentPostDeleted = parentPost?.isDeleted || false

  // Authentication and user interactions
  const { data: authenticatedUser } = useAuthenticatedUser()

  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [interactionType, setInteractionType] = useState<
    "like" | "repost" | "comment" | null
  >(null)

  // Local state for optimistic UI updates
  const [liked, setLiked] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [likeCount, setLikeCount] = useState(displayPost?.stats?.upvotes || 0)
  const [repostCount, setRepostCount] = useState(
    displayPost?.stats?.reposts || 0
  )

  // State to track if content should be fully displayed
  const [showFullContent, setShowFullContent] = useState(false)

  // Parse asset from post metadata using getPublicationData
  const publicationData = displayPost?.metadata
    ? getPublicationData(displayPost.metadata)
    : null

  // Combine asset image and attachment images for slider
  const allImages = React.useMemo(() => {
    const images: { uri: string; type: string }[] = []

    // Add main asset image if it exists and is an image
    if (publicationData?.asset?.type === "Image" && publicationData.asset.uri) {
      images.push({
        uri: publicationData.asset.uri,
        type: "Image",
      })
    }

    // Add attachment images
    if (publicationData?.attachments) {
      const imageAttachments = publicationData.attachments.filter(
        (attachment) => attachment.type === "Image"
      )
      images.push(...imageAttachments)
    }

    return images
  }, [publicationData])

  // State for image slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const hasMultipleImages = allImages.length > 1
  const hasSingleImage = allImages.length === 1

  // Image slider navigation
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (allImages.length <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (allImages.length <= 1) return
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    )
  }

  // Function to toggle content display
  const toggleContentDisplay = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering onClick handler of the post
    setShowFullContent(!showFullContent)
  }

  // Update displayPost and originalPost when either post or fetchedPost changes
  useEffect(() => {
    if (!currentPost) return

    setOriginalPost(currentPost)

    if (currentPost.__typename === "Repost" && currentPost.repostOf) {
      setDisplayPost(currentPost.repostOf)
    } else if (currentPost.__typename === "Post") {
      setDisplayPost(currentPost)
    }

    // Check if the post is a comment and set the parent post
    if (currentPost.__typename === "Post" && currentPost.commentOn) {
      setParentPost(currentPost.commentOn)
    } else {
      setParentPost(null)
    }

    // Call onLoad callback when we have a valid post
    if (onLoad && currentPost) {
      onLoad(currentPost)
    }
  }, [currentPost, onLoad])

  // Format timestamp to readable format
  const formatTimestamp = (timestamp?: number | string): string => {
    if (!timestamp) return "Just now"

    const date =
      typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp)

    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`

    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Format timestamp to detailed format for tooltip
  const formatDetailedTimestamp = (timestamp?: number | string): string => {
    if (!timestamp) return "Just now"

    const date =
      typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp)

    // Format as: "February 29, 2024 at 2:30 PM"
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }

    return date.toLocaleDateString(undefined, options)
  }

  // Initialize states from original post data
  useEffect(() => {
    setLiked(!!displayPost?.operations?.hasUpvoted)
    setReposted(
      !!displayPost?.operations?.hasReposted.optimistic ||
        !!displayPost?.operations?.hasReposted?.onChain
    )
    setLikeCount(displayPost?.stats?.upvotes || 0)
    setRepostCount(displayPost?.stats?.reposts || 0)
  }, [displayPost])

  // Add a helper function to render deleted post content
  const renderDeletedPostContent = () => {
    return (
      <div
        style={{
          padding: "16px",
          fontSize: "15px",
          color: isDarkBackground ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        This post was deleted by the author
      </div>
    )
  }

  // Handle like action - always use displayPost for interactions
  const handleLike = async () => {
    if (!displayPost) return
    if (!authenticatedUser) {
      setInteractionType("like")
      setShowLoginPopup(true)
      return
    }

    try {
      // Optimistic update
      if (liked) {
        setLikeCount((prev) => Math.max(0, prev - 1))
        setLiked(false)

        const result = await undoReaction({
          post: displayPost?.id,
          reaction: PostReactionType.Upvote,
        })

        if (result.isErr()) {
          // Revert on error
          setLikeCount((prev) => prev + 1)
          setLiked(true)
          toast.error(result.error.message || "Failed to unlike")
        }
      } else {
        setLikeCount((prev) => prev + 1)
        setLiked(true)

        const result = await addReaction({
          post: displayPost?.id,
          reaction: PostReactionType.Upvote,
        })

        if (result.isErr()) {
          // Revert on error
          setLikeCount((prev) => Math.max(0, prev - 1))
          setLiked(false)
          toast.error(result.error.message || "Failed to like")
        }
      }

      onLike?.(displayPost)
    } catch (error) {
      toast.error((error as Error).message || "An error occurred")
    }
  }

  // Handle repost action - always use displayPost for interactions
  const handleRepost = async () => {
    if (!displayPost) return
    if (!authenticatedUser) {
      setInteractionType("repost")
      setShowLoginPopup(true)
      return
    }

    try {
      if (reposted) {
        toast.error("Cannot undo a repost at this time")
        return
      }

      // Optimistic update
      setRepostCount((prev) => prev + 1)
      setReposted(true)

      const result = await createRepost({
        post: displayPost?.id,
      })

      if (result.isErr()) {
        // Revert on error
        setRepostCount((prev) => Math.max(0, prev - 1))
        setReposted(false)
        toast.error(result.error.message || "Failed to repost")
      } else {
        toast.success("Post reposted successfully")
      }

      onRepost?.(displayPost)
    } catch (error) {
      toast.error((error as Error).message || "An error occurred")
    }
  }

  // Handle comment action - always use displayPost for interactions
  const handleComment = () => {
    if (!displayPost) return
    if (!authenticatedUser) {
      setInteractionType("comment")
      setShowLoginPopup(true)
      return
    }

    onComment?.(displayPost)
  }

  // Handle login success
  const handleLoginSuccess = () => {
    if (!displayPost) return
    if (interactionType === "like") {
      handleLike()
    } else if (interactionType === "repost") {
      handleRepost()
    } else if (interactionType === "comment") {
      onComment?.(displayPost)
    }

    setInteractionType(null)
  }

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Loading or error states
  if (!displayPost && !postLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          backgroundColor,
          color: textColor,
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          ...containerStyle,
        }}
      >
        <FaExclamationCircle size={40} color={accentColor} />
        <h3 style={{ marginTop: "16px", color: textColor }}>
          Post Not Available
        </h3>
        <p
          style={{
            marginTop: "8px",
            color: isDarkBackground
              ? "rgba(255,255,255,0.7)"
              : "rgba(0,0,0,0.7)",
          }}
        >
          Unable to load post information
        </p>
      </motion.div>
    )
  }

  // Format author handle
  const formatHandle = (author: any): string => {
    if (!author) return "@user"

    if (author.username?.localName) {
      return "@" + author.username.localName
    }

    if (author.address) {
      return author.address.slice(0, 6) + "..." + author.address.slice(-4)
    }

    return "@user"
  }

  // Styles for the component
  const styles = {
    container: {
      backgroundColor,
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      color: textColor,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: "flex",
      flexDirection: "column" as const,
      width: "100%",
      ...containerStyle,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 16px 12px 16px",
      borderBottom: isDarkBackground
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)",
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
    },
    profilePic: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      objectFit: "cover" as const,
      cursor: "pointer",
    },
    profileInfo: {
      marginLeft: "12px",
      display: "flex",
      flexDirection: "column" as const,
    },
    nameRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    name: {
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "2px",
      display: "flex",
      alignItems: "center",
    },
    username: {
      fontWeight: "normal",
      fontSize: "14px",
      color: isDarkBackground ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
    },
    timestamp: {
      fontSize: "14px",
      color: isDarkBackground ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
    },
    content: {
      padding: "16px",
      fontSize: "16px",
      lineHeight: "1.5",
      wordBreak: "break-word" as const,
    },
    imageContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginBottom: "12px",
      padding: "0 16px", // Add horizontal padding to match content padding
    },
    image: {
      maxWidth: "100%",
      maxHeight: "500px",
      borderRadius: "8px",
    },
    videoContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginBottom: "12px",
      padding: "0 16px", // Add horizontal padding to match content padding
      aspectRatio: "16/9",
    },
    statsContainer: {
      display: "flex",
      flexWrap: "wrap" as const,
      padding: "10px 16px",
      gap: "8px", // Reduced gap between stats
      borderTop: isDarkBackground
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)",
      borderBottom: isDarkBackground
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)",
    },
    statItem: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "3px 8px", // Reduced padding
      fontSize: "13px",
      color: isDarkBackground ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
    },
    interactionBar: {
      display: "flex",
      padding: "12px 16px 16px 16px",
      justifyContent: "space-around",
    },
    interactionButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "background-color 0.2s",
      backgroundColor: "transparent",
      border: "none",
      color: textColor,
      fontSize: "14px",
      fontWeight: "bold" as const,
    },
    quotedPost: {
      margin: "8px 16px 16px 16px",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: isDarkBackground
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      border: isDarkBackground
        ? "1px solid rgba(255, 255, 255, 0.2)"
        : "1px solid rgba(0, 0, 0, 0.1)",
    },
    quotedHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "8px",
    },
    quotedAvatar: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      marginRight: "8px",
    },
    quotedName: {
      fontWeight: "bold" as const,
      fontSize: "14px",
    },
    quotedContent: {
      fontSize: "14px",
      opacity: 0.9,
    },
    showMoreButton: {
      backgroundColor: "transparent",
      color: accentColor,
      border: "none",
      padding: "4px 0",
      marginTop: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
    },
  }

  // Configure stats icons mapping
  const statIcons = {
    upvotes: <FaThumbsUp size={14} />,
    comments: <FaComment size={14} />,
    reposts: <FaRetweet size={14} />,
    quotes: <FaQuoteRight size={14} />,
    bookmarks: <FaBookmark size={14} />,
    collects: <FaHeart size={14} />,
    tips: <FaCoins size={14} />,
  }

  // Configure stats labels in singular/plural form
  const statLabels = {
    upvotes: {
      singular: "like",
      plural: "likes",
    },
    comments: {
      singular: "comment",
      plural: "comments",
    },
    reposts: {
      singular: "repost",
      plural: "reposts",
    },
    quotes: {
      singular: "quote",
      plural: "quotes",
    },
    bookmarks: {
      singular: "bookmark",
      plural: "bookmarks",
    },
    collects: {
      singular: "collect",
      plural: "collects",
    },
    tips: {
      singular: "tip",
      plural: "tips",
    },
  }

  if (!displayPost) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={styles.container}
        onClick={() => onClick?.(displayPost)}
      >
        {/* Show repost indicator when it's a repost */}
        {originalPost?.__typename === "Repost" && (
          <div
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              color: isDarkBackground
                ? "rgba(255,255,255,0.7)"
                : "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "-12px",
            }}
          >
            <FaRetweet size={14} />
            <span>Reposted by {formatHandle(originalPost.author)}</span>
          </div>
        )}

        {/* Show parent post if this is a comment */}
        {originalPost?.__typename === "Post" &&
          originalPost?.commentOn &&
          parentPost && (
            <div
              style={{
                padding: "16px 16px 0 16px",
                fontSize: "14px",
                color: isDarkBackground
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(0,0,0,0.6)",
              }}
            >
              <div
                style={{
                  ...styles.quotedPost,
                  margin: "0 0 8px 0",
                  backgroundColor: isDarkBackground
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                }}
              >
                <div style={styles.quotedHeader}>
                  <ImageModal
                    imageSrc={
                      parentPost.author?.metadata?.picture ||
                      getStampFyiURL(parentPost.author?.address || "")
                    }
                    imageAlt={
                      parentPost.author?.metadata?.name || "Parent post author"
                    }
                    trigger={
                      <img
                        src={
                          parentPost.author?.metadata?.picture ||
                          getStampFyiURL(parentPost.author?.address || "")
                        }
                        alt="Parent post author"
                        style={{
                          ...styles.quotedAvatar,
                          cursor: "pointer",
                        }}
                      />
                    }
                  />
                  <div style={styles.quotedName}>
                    {parentPost.author?.metadata?.name ||
                      formatHandle(parentPost.author)}
                  </div>
                </div>
                <div style={styles.quotedContent}>
                  {isParentPostDeleted ? (
                    <div style={{ fontStyle: "italic", opacity: 0.7 }}>
                      This post was deleted by the author
                    </div>
                  ) : (
                    <>
                      {/* @ts-ignore */}
                      {parentPost.metadata?.content && (
                        <Markup>
                          {/* @ts-ignore */}
                          {parentPost.metadata.content.length > 100
                            ? // @ts-ignore
                              parentPost.metadata.content.substring(0, 100) +
                              "..."
                            : // @ts-ignore
                              parentPost.metadata.content}
                        </Markup>
                      )}

                      {/* Add ImageModal for parent post image if it exists */}
                      {parentPost.metadata?.__typename === "ImageMetadata" &&
                        parentPost.metadata?.image?.item && (
                          <div style={{ marginTop: "10px" }}>
                            <ImageModal
                              imageSrc={parentPost.metadata.image.item}
                              imageAlt="Parent post media"
                              trigger={
                                <LoadingImage
                                  src={parentPost.metadata.image.item}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                  }}
                                  alt="Parent post media"
                                  theme={themeToUse}
                                />
                              }
                              imageStyle={{
                                maxWidth: "90vw",
                                maxHeight: "90vh",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  paddingLeft: "12px",
                  marginBottom: "8px",
                }}
              >
                <FaComment size={14} />
                <span>Replying to {formatHandle(parentPost.author)}</span>
              </div>
            </div>
          )}

        {/* Header with author info - use displayPost for content */}
        <div style={styles.header}>
          <div style={styles.profileSection}>
            <ImageModal
              imageSrc={
                displayPost.author?.metadata?.picture ||
                getStampFyiURL(displayPost.author?.address || "")
              }
              imageAlt={displayPost.author?.metadata?.name || "Profile"}
              trigger={
                <motion.img
                  src={
                    displayPost.author?.metadata?.picture ||
                    getStampFyiURL(displayPost.author?.address || "")
                  }
                  alt={displayPost.author?.metadata?.name || "Profile"}
                  style={styles.profilePic}
                  whileHover={{ scale: 1.05 }}
                />
              }
            />
            <div style={styles.profileInfo}>
              <div style={styles.nameRow}>
                <div style={styles.name}>
                  {displayPost.author?.metadata?.name ||
                    formatHandle(displayPost.author)}
                </div>
                {/* Add follow button in header */}
                {showFollow && displayPost.author && (
                  <FollowButton
                    account={displayPost.author}
                    size={Size.medium}
                    theme={themeToUse}
                    showUnfollowButton={showUnfollowButton}
                  />
                )}
              </div>
              <div style={styles.username}>
                {formatHandle(displayPost.author)}
              </div>
            </div>
          </div>
          <Tooltip
            isDarkTheme={isDarkBackground}
            content={formatDetailedTimestamp(displayPost.timestamp)}
          >
            <div style={styles.timestamp}>
              {formatTimestamp(displayPost.timestamp)}
            </div>
          </Tooltip>
        </div>

        {/* Post content - use displayPost for content */}
        {isDisplayPostDeleted ? (
          renderDeletedPostContent()
        ) : (
          <>
            <div style={styles.content}>
              {/* @ts-ignore */}
              {displayPost.metadata?.content && (
                <>
                  {/* @ts-ignore */}
                  <Markup>
                    {!showFullContent &&
                    // @ts-ignore
                    displayPost.metadata.content.length > contentPreviewLimit
                      ? /* @ts-ignore */
                        displayPost.metadata.content.substring(
                          0,
                          contentPreviewLimit
                        ) + "..."
                      : /* @ts-ignore */
                        displayPost.metadata.content}
                  </Markup>

                  {/* @ts-ignore */}
                  {displayPost.metadata.content.length >
                    contentPreviewLimit && (
                    <button
                      onClick={toggleContentDisplay}
                      style={{
                        ...styles.showMoreButton,
                        display: "block", // Make button appear on its own line
                        width: "fit-content", // Only take up as much space as needed
                        marginTop: "12px", // Add more space above the button
                      }}
                    >
                      {showFullContent ? "Show less" : "Show more"}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Media content - Combined image slider for asset + attachments */}
            {(hasSingleImage || hasMultipleImages) && (
              <div style={{ padding: "0 16px 16px 16px" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  {/* Image Container */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: isDarkBackground
                        ? "rgba(0,0,0,0.2)"
                        : "rgba(0,0,0,0.05)",
                      position: "relative",
                      borderRadius: "12px",
                      minHeight: "300px",
                      aspectRatio: "16/9",
                    }}
                  >
                    {allImages.map((image, index) => (
                      <motion.div
                        key={`image-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: index === currentImageIndex ? 1 : 0,
                          display:
                            index === currentImageIndex ? "flex" : "none",
                        }}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ImageModal
                          imageSrc={image.uri}
                          imageAlt={`Image ${index + 1}`}
                          trigger={
                            <LoadingImage
                              src={image.uri}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                              alt={`Image ${index + 1}`}
                              theme={themeToUse}
                            />
                          }
                          imageStyle={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            objectFit: "contain",
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Navigation Buttons - only show if multiple images */}
                  {hasMultipleImages && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "10px",
                          transform: "translateY(-50%)",
                          zIndex: 10,
                          cursor: "pointer",
                          backgroundColor: isDarkBackground
                            ? "rgba(0,0,0,0.5)"
                            : "rgba(255,255,255,0.7)",
                          borderRadius: "50%",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                        onClick={prevImage}
                      >
                        ←
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          zIndex: 10,
                          cursor: "pointer",
                          backgroundColor: isDarkBackground
                            ? "rgba(0,0,0,0.5)"
                            : "rgba(255,255,255,0.7)",
                          borderRadius: "50%",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                        onClick={nextImage}
                      >
                        →
                      </div>

                      {/* Image Indicators */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "15px",
                          left: "0",
                          right: "0",
                          display: "flex",
                          justifyContent: "center",
                          gap: "6px",
                          zIndex: 5,
                        }}
                      >
                        {allImages.map((_, index) => (
                          <div
                            key={`indicator-${index}`}
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor:
                                index === currentImageIndex
                                  ? accentColor
                                  : isDarkBackground
                                  ? "rgba(255,255,255,0.3)"
                                  : "rgba(0,0,0,0.2)",
                              transition: "background-color 0.3s",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentImageIndex(index)
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Video content - use Player component */}
            {publicationData?.asset?.type === "Video" && (
              <div style={styles.videoContainer}>
                <VideoPlayer
                  src={publicationData.asset.uri!}
                  poster={publicationData.asset.cover || undefined}
                  muted={false}
                  autoPlay={false}
                  loop={false}
                />
              </div>
            )}

            {/* Audio content - Enhanced version */}
            {publicationData?.asset?.type === "Audio" && (
              <div style={{ padding: "16px" }}>
                {/* ...existing audio component... */}
              </div>
            )}

            {/* We no longer need the separate attachments section since we combined everything into the main slider */}
            {/* Only show non-image attachments if any */}
            {publicationData?.attachments &&
              publicationData.attachments.some(
                (att) => att.type !== "Image"
              ) && (
                <div style={{ padding: "0 16px 16px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    {publicationData.attachments
                      .filter((attachment) => attachment.type !== "Image")
                      .map((attachment, index) => {
                        // Render non-image attachments (if we want to support them)
                        return null
                      })}
                  </div>
                </div>
              )}

            {/* Quoted post - use displayPost for content */}
            {displayPost.quoteOf && (
              <div style={styles.quotedPost}>
                <div style={styles.quotedHeader}>
                  <ImageModal
                    imageSrc={
                      displayPost.quoteOf.author?.metadata?.picture ||
                      getStampFyiURL(displayPost.quoteOf.author?.address || "")
                    }
                    imageAlt={
                      displayPost.quoteOf.author?.metadata?.name ||
                      "Quoted profile"
                    }
                    trigger={
                      <img
                        src={
                          displayPost.quoteOf.author?.metadata?.picture ||
                          getStampFyiURL(
                            displayPost.quoteOf.author?.address || ""
                          )
                        }
                        alt="Quoted profile"
                        style={{
                          ...styles.quotedAvatar,
                          cursor: "pointer",
                        }}
                      />
                    }
                  />
                  <div style={styles.quotedName}>
                    {displayPost.quoteOf.author?.metadata?.name ||
                      formatHandle(displayPost.quoteOf.author)}
                  </div>
                </div>
                <div style={styles.quotedContent}>
                  {displayPost.quoteOf.isDeleted ? (
                    <div style={{ fontStyle: "italic", opacity: 0.7 }}>
                      This post was deleted by the author
                    </div>
                  ) : (
                    <>
                      {/* @ts-ignore */}
                      {displayPost.quoteOf.metadata?.content && (
                        <Markup>
                          {/* @ts-ignore */}
                          {displayPost.quoteOf.metadata.content.length > 100
                            ? // @ts-ignore
                              displayPost.quoteOf.metadata.content.substring(
                                0,
                                100
                              ) + "..."
                            : // @ts-ignore
                              displayPost.quoteOf.metadata.content}
                        </Markup>
                      )}

                      {/* Add ImageModal for quoted post image if it exists */}
                      {displayPost.quoteOf.metadata?.__typename ===
                        "ImageMetadata" &&
                        displayPost.quoteOf.metadata?.image?.item && (
                          <div style={{ marginTop: "10px" }}>
                            <ImageModal
                              imageSrc={displayPost.quoteOf.metadata.image.item}
                              imageAlt="Quoted post media"
                              trigger={
                                <LoadingImage
                                  src={displayPost.quoteOf.metadata.image.item}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                  }}
                                  alt="Quoted post media"
                                  theme={themeToUse}
                                />
                              }
                              imageStyle={{
                                maxWidth: "90vw",
                                maxHeight: "90vh",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Stats section - NEW */}
        {showStats && displayPost.stats && !isDisplayPostDeleted && (
          <div style={styles.statsContainer}>
            {(visibleStats as Array<keyof typeof statIcons>).map((statName) => {
              if (!(statName in displayPost.stats!)) return null
              const value =
                displayPost.stats![statName as keyof typeof displayPost.stats]
              if (value === 0) return null

              // Ensure value is a number
              const numericValue = typeof value === "number" ? value : 0

              // Get appropriate label (singular or plural)
              const label =
                numericValue === 1
                  ? statLabels[statName].singular
                  : statLabels[statName].plural

              return (
                <div key={statName} style={styles.statItem}>
                  <span>
                    {formatNumber(numericValue)} {label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Interaction buttons - use displayPost stats for counts */}
        {!hideInteractions && !isDisplayPostDeleted && (
          <div style={styles.interactionBar}>
            {visibleButtons.includes("like") && (
              <button
                style={{
                  ...styles.interactionButton,
                  color: liked ? "#F0506E" : textColor,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLike()
                }}
                disabled={undoLoading || repostLoading || addLoading}
              >
                {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                <span>{likeCount}</span>
              </button>
            )}

            {visibleButtons.includes("repost") && (
              <button
                style={{
                  ...styles.interactionButton,
                  color: reposted ? "#4CAF50" : textColor,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRepost()
                }}
                disabled={repostLoading}
              >
                <FaRetweet />
                <span>{repostCount}</span>
              </button>
            )}

            {visibleButtons.includes("comment") && (
              <button
                style={styles.interactionButton}
                onClick={(e) => {
                  e.stopPropagation()
                  handleComment()
                }}
              >
                <FaComment />
                <span>{displayPost.stats?.upvotes || 0}</span>
              </button>
            )}
          </div>
        )}

        {/* Login popup */}
        {showLoginPopup && (
          <LoginPopUp
            onClose={() => setShowLoginPopup(false)}
            onSuccess={handleLoginSuccess}
            theme={themeToUse}
          />
        )}

        {/* Animation styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            `,
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
