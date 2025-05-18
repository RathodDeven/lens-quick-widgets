import React, { useEffect, useState } from "react"
import { Size, Theme, ThemeColor } from "./types"
import {
  Account as AccountType,
  useAccount,
  useAuthenticatedUser,
} from "@lens-protocol/react"
import { useAccountStats } from "./hooks/useAccountStats"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaUsers,
  FaUserFriends,
  FaExclamationCircle,
  FaUserPlus,
  FaUserMinus,
} from "react-icons/fa"
import {
  backgroundColorMap,
  foregroundColorMap,
  textColorMap,
  getContrastColor,
  getStampFyiURL,
} from "./utils"
import { COVER_IMAGE_PLACE_HOLDER } from "./config"
import { ImageModal } from "./ImageModal"
import Tooltip from "./Tooltip"
import Markup from "./Lexical/Markup"
import { useFollow } from "./hooks/useFollow"
import { useUnFollow } from "./hooks/useUnFollow"
import LoginPopUp from "./LoginPopUp"
import toast from "react-hot-toast"
import { useLensWidget } from "./LensWidgetContext"

/**
 * Account Component - Displays a Lens Protocol user profile
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.accountAddress] - The account address to load
 * @param {string} [props.localName] - The local name of the account
 * @param {string} [props.walletAddress] - The wallet address
 * @param {Function} [props.onAccountLoad] - Callback when account loads successfully
 * @param {Function} [props.onError] - Callback when an error occurs
 * @param {Theme} [props.theme] - The theme to use for styling
 * @param {React.CSSProperties} [props.containerStyle] - Custom container style
 * @param {React.CSSProperties} [props.followButtonStyle] - Custom follow button style
 * @param {React.CSSProperties} [props.followButtonContainerStyle] - Custom follow button container style
 * @param {string} [props.followButtonTextColor] - Custom follow button text color
 * @param {boolean} [props.hideFollowButton] - Whether to hide the follow button
 * @param {Function} [props.onFollowed] - Callback when user is followed
 * @param {Function} [props.onClick] - Callback when the component is clicked, receives account and stats data
 * @param {Size} [props.size=Size.medium] - Size of the component:
 *   - compact: 180×40px - inline minimal display for headers
 *   - small: 200×150px - minimal info
 *   - medium: 350×300px - standard info
 *   - large: 500×400px - complete profile
 * @param {string} [props.fontSize] - Custom font size
 * @returns {JSX.Element | null} The rendered Account component
 */
export const Account = ({
  accountAddress,
  localName,
  walletAddress,
  onAccountLoad,
  onError,
  theme,
  containerStyle,
  followButtonStyle,
  hideFollowButton = false,
  onFollowed,
  onClick,
  size = Size.medium,
  fontSize,
}: {
  accountAddress?: string
  localName?: string
  walletAddress?: string
  onAccountLoad?: (account: AccountType) => void
  onError?: (error: Error) => void
  theme?: Theme
  containerStyle?: React.CSSProperties
  followButtonStyle?: React.CSSProperties
  followButtonContainerStyle?: React.CSSProperties
  followButtonTextColor?: string
  hideFollowButton?: boolean
  onFollowed?: () => void
  onClick?: (account: AccountType, stats: any) => void
  size?: Size
  fontSize?: string
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

  // Font sizes by component size
  const fontSizes = {
    compact: fontSize || "12px",
    small: fontSize || "12px",
    medium: fontSize || "14px",
    large: fontSize || "16px",
  }

  const {
    data: account,
    error,
    loading: accountLoading,
  } = useAccount({
    address: accountAddress,
    username:
      localName && !accountAddress
        ? {
            localName: localName,
          }
        : undefined,
  })

  const {
    data: accountStats,
    error: statsError,
    loading: statsLoading,
  } = useAccountStats({
    account: account?.address,
  })

  const { data: authenticatedUser } = useAuthenticatedUser()
  const { execute: followUser, loading: followLoading } = useFollow()
  const { execute: unfollowUser, loading: unfollowLoading } = useUnFollow()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  // Add local follow state to manage UI updates immediately
  const [isFollowedLocally, setIsFollowedLocally] = useState<
    boolean | undefined
  >(undefined)

  useEffect(() => {
    if (error) {
      onError?.(error)
    }
  }, [error])

  useEffect(() => {
    if (account) {
      onAccountLoad?.(account)
      // Initialize local follow state from account data when it loads
      setIsFollowedLocally(account.operations?.isFollowedByMe)
    }
  }, [account?.address, account?.operations?.isFollowedByMe])

  const loading = accountLoading || statsLoading
  const hasError = (error || statsError) && !loading

  // Determine if loading follow-related actions
  const isFollowLoading = followLoading || unfollowLoading

  // Helper function to render follow button based on size
  const renderFollowButton = () => {
    // Use the local state if defined, otherwise fall back to API data
    const isFollowed =
      isFollowedLocally !== undefined
        ? isFollowedLocally
        : account?.operations?.isFollowedByMe === true

    const buttonAction = isFollowed ? handleUnfollow : handleFollow

    // Hide follow button if user is viewing their own profile or if hideFollowButton is true
    const isOwnProfile =
      authenticatedUser?.address?.toLowerCase() ===
      account?.address?.toLowerCase()
    if (hideFollowButton || isOwnProfile) return null

    // Compact size - icon with accent color background
    if (size === Size.compact) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (!authenticatedUser) {
              setShowLoginPopup(true)
              return
            }
            buttonAction()
          }}
          disabled={isFollowLoading}
          style={{
            backgroundColor: accentColor,
            color: getContrastColor(accentColor),
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            marginLeft: "8px", // Add space between name and button
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            minWidth: "22px",
          }}
          title={isFollowed ? "Unfollow" : "Follow"}
        >
          {isFollowLoading ? (
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : isFollowed ? (
            <FaUserMinus size={12} />
          ) : (
            <FaUserPlus size={12} />
          )}
        </button>
      )
    }

    // Small size - smaller button
    if (size === Size.small) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (!authenticatedUser) {
              setShowLoginPopup(true)
              return
            }
            buttonAction()
          }}
          disabled={isFollowLoading}
          style={{
            backgroundColor: accentColor,
            color: getContrastColor(accentColor),
            border: "none",
            borderRadius: "16px",
            padding: "4px 8px", // Smaller padding
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px", // Smaller font
            marginLeft: "12px", // More space
            ...followButtonStyle,
          }}
        >
          {isFollowLoading ? (
            <div
              style={{
                width: "12px", // Smaller loader
                height: "12px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            <>
              {isFollowed ? (
                <FaUserMinus size={10} style={{ marginRight: "4px" }} />
              ) : (
                <FaUserPlus size={10} style={{ marginRight: "4px" }} />
              )}
              {isFollowed ? "Unfollow" : "Follow"}
            </>
          )}
        </button>
      )
    }

    // Medium size
    if (size === Size.medium) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (!authenticatedUser) {
              setShowLoginPopup(true)
              return
            }
            buttonAction()
          }}
          disabled={isFollowLoading}
          style={{
            backgroundColor: accentColor,
            color: getContrastColor(accentColor),
            border: "none",
            borderRadius: "20px",
            padding: "6px 12px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            marginLeft: "16px", // More space
            ...followButtonStyle,
          }}
        >
          {isFollowLoading ? (
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : (
            <>
              {isFollowed ? (
                <FaUserMinus size={12} style={{ marginRight: "4px" }} />
              ) : (
                <FaUserPlus size={12} style={{ marginRight: "4px" }} />
              )}
              {isFollowed ? "Unfollow" : "Follow"}
            </>
          )}
        </button>
      )
    }

    // Large size
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (!authenticatedUser) {
            setShowLoginPopup(true)
            return
          }
          buttonAction()
        }}
        disabled={isFollowLoading}
        style={{
          backgroundColor: accentColor,
          color: getContrastColor(accentColor),
          border: "none",
          borderRadius: "20px",
          padding: "8px 16px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "100px",
          marginLeft: "20px", // More space
          ...followButtonStyle,
        }}
      >
        {isFollowLoading ? (
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "white",
              animation: "spin 1s linear infinite",
            }}
          />
        ) : (
          <>
            {isFollowed ? (
              <FaUserMinus size={14} style={{ marginRight: "6px" }} />
            ) : (
              <FaUserPlus size={14} style={{ marginRight: "6px" }} />
            )}
            {isFollowed ? "Unfollow" : "Follow"}
          </>
        )}
      </button>
    )
  }

  // Styles
  const styles = {
    container: {
      width: "fit-content",
      backgroundColor,
      borderRadius: size === Size.compact ? "30px" : "16px",
      overflow: "hidden",
      // Apply padding conditionally based on size
      padding:
        size === Size.compact ? "8px 12px" : size === Size.small ? "16px" : "0", // No padding for medium/large to allow banner to touch edges
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      color: textColor,
      position: "relative",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: size === Size.compact ? "flex" : "block",
      alignItems: size === Size.compact ? "center" : "flex-start",
      maxWidth:
        size === Size.medium ? "600px" : size === Size.large ? "700px" : "auto",
      ...containerStyle,
    },
    header: {
      display: "flex",
      marginBottom: size === Size.compact ? "0" : "0",
      width: size === Size.compact ? "100%" : "auto",
      padding: size === Size.medium || size === Size.large ? "0 20px" : "0",
      flexDirection: (size === Size.compact
        ? "row"
        : (size === Size.medium || size === Size.large) && !hideFollowButton
        ? "column"
        : size === Size.medium || size === Size.large
        ? "column"
        : "row") as React.CSSProperties["flexDirection"],
      justifyContent: size === Size.compact ? "flex-start" : "center",
      textAlign: (!hideFollowButton &&
      (size === Size.medium || size === Size.large)
        ? "left"
        : size === Size.medium || size === Size.large
        ? "center"
        : "left") as React.CSSProperties["textAlign"],
      // Align profile image to left when follow button is visible
      alignItems:
        !hideFollowButton && (size === Size.medium || size === Size.large)
          ? "flex-start"
          : "center",
    },
    profilePic: {
      width:
        size === Size.compact
          ? "30px"
          : size === Size.small
          ? "40px"
          : size === Size.medium
          ? "60px"
          : "80px",
      height:
        size === Size.compact
          ? "30px"
          : size === Size.small
          ? "40px"
          : size === Size.medium
          ? "60px"
          : "80px",
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
      border:
        size === Size.medium || size === Size.large
          ? `3px solid ${backgroundColor}`
          : "none",
      backgroundColor: backgroundColor,
      marginTop: size === Size.medium || size === Size.large ? "-30px" : "0", // Half overlapping the banner
    },
    profileInfo: {
      marginLeft:
        size === Size.compact
          ? "12px"
          : size === Size.medium || size === Size.large
          ? "0"
          : "12px",
      // Reduced spacing for medium and large
      marginTop: size === Size.medium || size === Size.large ? "4px" : "0",
      flex: 1,
      overflow: size === Size.compact ? "hidden" : "visible",
      display: "flex",
      flexDirection: "column" as React.CSSProperties["flexDirection"],
      justifyContent: "center" as React.CSSProperties["justifyContent"],
      alignItems: (!hideFollowButton &&
      (size === Size.medium || size === Size.large)
        ? "flex-start"
        : size === Size.medium || size === Size.large
        ? "center"
        : "flex-start") as React.CSSProperties["alignItems"],
      textAlign: (!hideFollowButton &&
      (size === Size.medium || size === Size.large)
        ? "left"
        : size === Size.medium || size === Size.large
        ? "center"
        : "left") as React.CSSProperties["textAlign"],
    },
    compactInfo: {
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center" as const,
      height: "30px", // Match the height of the profile image in compact mode
      overflow: "hidden" as const,
      width: "auto", // Changed from 100% to auto to allow space for follow button
    },
    name: {
      fontWeight: "bold",
      fontSize:
        size === Size.compact
          ? "11px"
          : size === Size.small
          ? "14px"
          : size === Size.medium
          ? "18px"
          : "22px",
      marginBottom: size === Size.compact ? "0" : "1px", // Tiny gap between name and username
      color: textColor,
      whiteSpace:
        size === Size.compact ? ("nowrap" as const) : ("normal" as const),
      overflow:
        size === Size.compact ? ("hidden" as const) : ("visible" as const),
      textOverflow:
        size === Size.compact ? ("ellipsis" as const) : ("clip" as const),
      lineHeight: size === Size.compact ? "15px" : "normal",
    },
    username: {
      fontWeight: "normal",
      fontSize:
        size === Size.compact
          ? "10px"
          : size === Size.small
          ? "12px"
          : size === Size.medium
          ? "14px"
          : "16px",
      marginBottom: size === Size.compact ? "0" : "0", // Remove bottom margin
      color: isDarkBackground ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
      whiteSpace:
        size === Size.compact ? ("nowrap" as const) : ("normal" as const),
      overflow:
        size === Size.compact ? ("hidden" as const) : ("visible" as const),
      textOverflow:
        size === Size.compact ? ("ellipsis" as const) : ("clip" as const),
      lineHeight: size === Size.compact ? "14px" : "normal",
    },
    stats: {
      display: "flex",
      gap: size === Size.small ? "12px" : "16px",
      fontSize: fontSizes[size],
      // Reduce top margin for medium/large
      marginTop: size === Size.medium || size === Size.large ? "8px" : "12px",
      marginBottom: "0px",
      alignItems: "center",
      // Left-align stats for small size too
      justifyContent:
        size === Size.small || size === Size.large ? "flex-start" : "center",
      flexWrap: "wrap" as const,
      padding:
        size === Size.large
          ? "0 20px 0 20px"
          : size === Size.medium
          ? "0 10px"
          : "0",
    },
    statItem: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      position: "relative" as const,
      cursor: "pointer",
      padding: "2px 0", // Reduced from 4px to 2px
    },
    statText: {
      opacity: 0.7,
      fontSize:
        size === Size.medium || size === Size.large ? fontSizes[size] : "12px",
      marginLeft: "4px",
    },
    statNumber: {
      fontSize: fontSizes[size],
    },
    bioContainer: {
      marginTop: "12px", // Consistent spacing
      marginBottom: "0", // No bottom margin needed
      maxHeight: size === Size.small ? "80px" : "none", // Only limit height for small size
      overflow: "auto",
      padding: "0 20px 20px 20px", // Add padding at bottom and sides
    },
    coverImage: {
      width: "100%",
      marginTop: "0", // Remove margin for banner at top
      height: size === Size.medium ? "100px" : "120px",
      objectFit: "cover",
      borderRadius:
        size === Size.medium || size === Size.large ? "16px 16px 0 0" : "8px", // Round only top corners
      display: size === Size.medium || size === Size.large ? "block" : "none", // Show for medium and large
    },
    contentContainer: {
      padding: size === Size.medium || size === Size.large ? "0 0 20px 0" : "0", // Padding for content
    },
    errorContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      textAlign: "center",
      padding: "20px",
    },
    loadingPlaceholder: {
      backgroundColor: isDarkBackground
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
      borderRadius: "8px",
    },
    // Add style for stats container to ensure proper bottom spacing
    statsContainer: {
      marginBottom: "0px", // No margin, rely on container padding
    },
    headerRow: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      // Reduced spacing
      marginTop: size === Size.medium || size === Size.large ? "4px" : "0",
    },
  }

  // Main component render for loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.container as any}
      >
        {size === Size.compact ? (
          // Improved loading placeholders for compact size
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                ...styles.loadingPlaceholder,
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <div style={{ marginLeft: "12px", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: "3px",
                }}
              >
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: 0.2,
                  }}
                  style={{
                    ...styles.loadingPlaceholder,
                    height: "13px",
                    width: "70px",
                  }}
                />
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: 0.3,
                  }}
                  style={{
                    ...styles.loadingPlaceholder,
                    height: "11px",
                    width: "60px",
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{
                  ...(styles.profilePic as any),
                  ...styles.loadingPlaceholder,
                }}
              />
              <div style={styles.profileInfo}>
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  style={{
                    ...styles.loadingPlaceholder,
                    height: "20px",
                    width: "120px",
                    marginBottom: "8px",
                  }}
                />
                <motion.div
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                  style={{
                    ...styles.loadingPlaceholder,
                    height: "16px",
                    width: "80px",
                  }}
                />
              </div>
            </div>

            {size !== Size.small && (
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                style={{
                  ...styles.loadingPlaceholder,
                  height: size === Size.medium ? "60px" : "100px",
                  width: "100%",
                  marginBottom: "16px",
                }}
              />
            )}

            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
              style={{
                ...styles.loadingPlaceholder,
                height: size === Size.small ? "40px" : "80px",
                width: "100%",
              }}
            />
          </>
        )}
      </motion.div>
    )
  }

  // Error component - also make it responsive
  if (hasError || !account) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          ...(styles.container as any),
          padding: size === Size.compact ? "8px 12px" : "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <FaExclamationCircle
            size={size === Size.compact ? 20 : size === Size.small ? 30 : 40}
            color={accentColor}
          />
        </motion.div>
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginTop: size === Size.compact ? "5px" : "16px",
            color: textColor,
            fontSize: size === Size.compact ? "12px" : undefined,
          }}
        >
          Account Not Available
        </motion.h3>
        {size !== Size.compact && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: fontSizes[size],
              marginTop: "8px",
              color: isDarkBackground
                ? "rgba(255,255,255,0.7)"
                : "rgba(0,0,0,0.7)",
            }}
          >
            {"Unable to load account information"}
          </motion.p>
        )}
      </motion.div>
    )
  }

  // Function to handle follow action
  async function handleFollow() {
    if (!account?.address) return

    try {
      const result = await followUser({
        account: account?.address,
      })

      if (result.isOk()) {
        // Update local state immediately on success
        setIsFollowedLocally(true)
        toast.success(
          `You are now following ${
            account?.username?.localName || "this account"
          }`
        )
        onFollowed?.()
      } else {
        toast.error(result.error.message || "Failed to follow")
      }
    } catch (error) {
      toast.error((error as Error).message || "An error occurred")
    }
  }

  // Function to handle unfollow action
  async function handleUnfollow() {
    if (!account?.address) return

    try {
      const result = await unfollowUser({
        account: account?.address,
      })

      if (result.isOk()) {
        // Update local state immediately on success
        setIsFollowedLocally(false)
        toast.success(
          `You unfollowed ${account?.username?.localName || "this account"}`
        )
        onFollowed?.()
      } else {
        toast.error(result.error.message || "Failed to unfollow")
      }
    } catch (error) {
      toast.error((error as Error).message || "An error occurred")
    }
  }

  // Main component render
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          ...(styles.container as any),
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={() => {
          if (onClick && account) {
            onClick(account, accountStats)
          }
        }}
      >
        {/* Banner image for medium and large sizes */}
        {(size === Size.medium || size === Size.large) && (
          <motion.img
            src={account?.metadata?.coverPicture || COVER_IMAGE_PLACE_HOLDER}
            alt="Cover"
            style={styles.coverImage as any}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content container with padding for medium and large */}
        <div
          style={
            size === Size.medium || size === Size.large
              ? styles.contentContainer
              : {}
          }
        >
          {/* Header section */}
          <div style={styles.header}>
            {/* Using ImageModal with trigger for profile picture */}
            <ImageModal
              imageSrc={
                account?.metadata?.picture ||
                getStampFyiURL(account?.owner) ||
                ""
              }
              imageAlt={
                account?.metadata?.name ||
                account?.username?.localName ||
                "Profile"
              }
              trigger={
                <motion.img
                  src={
                    account?.metadata?.picture ||
                    getStampFyiURL(account?.owner) ||
                    ""
                  }
                  alt={
                    account?.metadata?.name ||
                    account?.username?.localName ||
                    "Profile"
                  }
                  style={{ ...(styles.profilePic as any), cursor: "pointer" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              }
            />

            {size === Size.compact ? (
              // Compact layout with follow button inline
              <div style={styles.profileInfo}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={styles.compactInfo}>
                    {account?.metadata?.name && (
                      <motion.div
                        style={styles.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {account.metadata.name}
                      </motion.div>
                    )}
                    <motion.div
                      style={styles.username}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      @
                      {account?.username?.localName ||
                        account?.address?.slice(0, 6) +
                          "..." +
                          account?.address?.slice(-4)}
                    </motion.div>
                  </div>
                  {renderFollowButton()}
                </div>
              </div>
            ) : size === Size.small ? (
              // Small layout - with follow button beside username/name
              <div style={styles.profileInfo}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: "12px", // Add gap for better spacing
                  }}
                >
                  <div>
                    {account?.metadata?.name && (
                      <motion.div
                        style={styles.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {account.metadata.name}
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      style={styles.username}
                    >
                      @
                      {account?.username?.localName ||
                        account?.address?.slice(0, 6) +
                          "..." +
                          account?.address?.slice(-4)}
                    </motion.div>
                  </div>
                  {!hideFollowButton && renderFollowButton()}
                </div>
              </div>
            ) : (
              // Medium and large layout - push follow button to the far right
              <div style={styles.profileInfo}>
                <div style={styles.headerRow}>
                  <div>
                    {account?.metadata?.name && (
                      <motion.div
                        style={styles.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {account.metadata.name}
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      style={styles.username}
                    >
                      @
                      {account?.username?.localName ||
                        account?.address?.slice(0, 6) +
                          "..." +
                          account?.address?.slice(-4)}
                    </motion.div>
                  </div>
                  {renderFollowButton()}
                </div>
              </div>
            )}
          </div>

          {/* Stats section - don't show icons in small size */}
          {size !== Size.compact && accountStats && (
            <motion.div
              style={styles.stats}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Tooltip
                content={`${
                  accountStats?.graphFollowStats?.followers || 0
                } Followers`}
                isDarkTheme={isDarkBackground}
                position="top"
              >
                <div style={styles.statItem}>
                  {/* Only show icons for small size - removed as requested */}
                  <span style={styles.statNumber}>
                    {accountStats?.graphFollowStats?.followers || 0}
                  </span>
                  <span style={styles.statText}>followers</span>
                </div>
              </Tooltip>

              <Tooltip
                content={`Following ${
                  accountStats?.graphFollowStats?.following || 0
                } Accounts`}
                isDarkTheme={isDarkBackground}
                position="top"
              >
                <div style={styles.statItem}>
                  {/* Only show icons for small size - removed as requested */}
                  <span style={styles.statNumber}>
                    {accountStats?.graphFollowStats?.following || 0}
                  </span>
                  <span style={styles.statText}>following</span>
                </div>
              </Tooltip>
            </motion.div>
          )}

          {/* Bio section */}
          {size === Size.large && account?.metadata?.bio && (
            <motion.div
              style={styles.bioContainer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Markup>{account.metadata.bio}</Markup>
            </motion.div>
          )}
        </div>

        {/* Login popup - Only show for non-self profiles */}
        {showLoginPopup &&
          authenticatedUser?.address?.toLowerCase() !==
            account?.address?.toLowerCase() && (
            <LoginPopUp
              onClose={() => setShowLoginPopup(false)}
              onSuccess={() => {
                if (account?.operations?.isFollowedByMe) {
                  handleUnfollow()
                } else {
                  handleFollow()
                }
              }}
              theme={themeToUse}
            />
          )}

        {/* Replace the jsx global style tag with a standard style tag */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `,
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
