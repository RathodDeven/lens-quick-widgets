import React, { useState, useEffect } from "react"
import { FaUserPlus, FaUserMinus } from "react-icons/fa"
import { Size, Theme } from "./types"
import { useAuthenticatedUser, Account } from "@lens-protocol/react"
import { useFollow } from "./hooks/useFollow"
import { useUnFollow } from "./hooks/useUnFollow"
import { getContrastColor } from "./utils"
import toast from "react-hot-toast"
import LoginPopUp from "./LoginPopUp"
import { useLensWidget } from "./LensWidgetContext"
import { foregroundColorMap } from "./utils"
import { motion } from "framer-motion" // Add import for motion

/**
 * FollowButton Component - A reusable button for following/unfollowing Lens accounts
 *
 * @component
 * @param {Object} props - Component props
 * @param {Account} props.account - The account to follow/unfollow
 * @param {boolean} [props.isFollowing] - Current follow state (optional, will be detected from account if not provided)
 * @param {Function} [props.onFollowChange] - Callback when follow status changes, receives boolean indicating following state
 * @param {Theme} [props.theme] - The theme to use for styling
 * @param {React.CSSProperties} [props.style] - Custom button style
 * @param {Size} [props.size=Size.medium] - Size of the button (compact, small, medium, large)
 * @param {boolean} [props.showUnfollowButton=false] - Whether to show the unfollow button for followed users
 * @returns {JSX.Element | null} The rendered FollowButton component or null if viewing own profile
 */
const FollowButton = ({
  account,
  isFollowing: externalIsFollowing,
  onFollowChange,
  theme,
  style,
  size = Size.medium,
  showUnfollowButton = false,
}: {
  account: Account
  isFollowing?: boolean
  onFollowChange?: (isFollowing: boolean) => void
  theme?: Theme
  style?: React.CSSProperties
  size?: Size
  showUnfollowButton?: boolean
}) => {
  // Get the theme from context to use as fallback
  const { theme: contextTheme } = useLensWidget()
  const themeToUse = theme || contextTheme
  const accentColor = foregroundColorMap[themeToUse]

  const { data: authenticatedUser } = useAuthenticatedUser()
  const { execute: followUser, loading: followLoading } = useFollow()
  const { execute: unfollowUser, loading: unfollowLoading } = useUnFollow()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [isFollowedLocally, setIsFollowedLocally] = useState<
    boolean | undefined
  >(undefined)

  // Determine if the authenticated user is the account owner (self)
  const isOwnProfile =
    authenticatedUser?.address?.toLowerCase() ===
    account?.address?.toLowerCase()

  // Use either external isFollowing prop or account data
  const isFollowed =
    typeof externalIsFollowing !== "undefined"
      ? externalIsFollowing
      : isFollowedLocally !== undefined
      ? isFollowedLocally
      : account?.operations?.isFollowedByMe === true

  const isFollowLoading = followLoading || unfollowLoading

  // Initialize local follow state from account data
  useEffect(() => {
    if (typeof externalIsFollowing === "undefined") {
      setIsFollowedLocally(account?.operations?.isFollowedByMe)
    }
  }, [account?.operations?.isFollowedByMe, externalIsFollowing])

  // Don't render button if viewing own profile
  if (isOwnProfile) return null

  // Don't render unfollow button if we're already following and showUnfollowButton is false
  if (isFollowed && !showUnfollowButton) return null

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
        onFollowChange?.(true)
        toast.success(
          `You are now following ${
            account?.username?.localName || "this account"
          }`
        )
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
        onFollowChange?.(false)
        toast.success(
          `You unfollowed ${account?.username?.localName || "this account"}`
        )
      } else {
        toast.error(result.error.message || "Failed to unfollow")
      }
    } catch (error) {
      toast.error((error as Error).message || "An error occurred")
    }
  }

  const buttonAction = isFollowed ? handleUnfollow : handleFollow

  // Different button styles based on size
  let buttonSize = {}
  let iconSize = 14
  let fontSize = "14px"
  let padding = "8px 16px"
  let width = "120px"
  let iconMargin = "6px"

  switch (size) {
    case Size.compact:
      buttonSize = {
        padding: "4px",
        borderRadius: "50%",
        width: "22px",
        height: "22px",
        minWidth: "22px",
      }
      iconSize = 12
      iconMargin = "0"
      width = "auto"
      break
    case Size.small:
      buttonSize = {
        padding: "4px 12px", // Increased horizontal padding from 10px to 12px
        borderRadius: "16px",
        width: "84px", // Slightly increased width from 80px to 84px
        minWidth: "84px", // Matching the width
      }
      iconSize = 14 // Increased from 12px to 14px to make unfollow icon more visible
      fontSize = "11px"
      iconMargin = "4px"
      break
    case Size.medium:
      buttonSize = {
        padding: "6px 12px",
        borderRadius: "20px",
        width: "100px",
        minWidth: "100px",
      }
      iconSize = 12
      fontSize = "12px"
      iconMargin = "4px"
      break
    case Size.large:
      buttonSize = {
        padding: "8px 18px",
        borderRadius: "24px",
        width: "120px",
        minWidth: "120px",
      }
      iconSize = 16
      fontSize = "14px"
      iconMargin = "8px"
      break
    // Default values remain for any other cases
  }

  return (
    <>
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          if (!authenticatedUser) {
            setShowLoginPopup(true)
            return
          }
          buttonAction()
        }}
        disabled={isFollowLoading}
        whileTap={{ scale: 0.95 }} // Scale down to 95% when clicked
        transition={{ duration: 0.1 }} // Quick, snappy transition
        style={{
          backgroundColor: accentColor,
          color: getContrastColor(accentColor),
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...buttonSize,
          ...style,
        }}
        title={isFollowed ? "Unfollow" : "Follow"}
      >
        {isFollowLoading ? (
          <div
            style={{
              width: size === Size.compact ? "12px" : "16px",
              height: size === Size.compact ? "12px" : "16px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "white",
              animation: "spin 1s linear infinite",
            }}
          />
        ) : (
          <>
            {isFollowed ? (
              <FaUserMinus
                size={iconSize}
                style={
                  size !== Size.compact
                    ? { marginRight: iconMargin }
                    : undefined
                }
              />
            ) : (
              <FaUserPlus
                size={iconSize}
                style={
                  size !== Size.compact
                    ? { marginRight: iconMargin }
                    : undefined
                }
              />
            )}
            {size !== Size.compact && (isFollowed ? "Unfollow" : "Follow")}
          </>
        )}
      </motion.button>

      {/* Login popup */}
      {showLoginPopup && (
        <LoginPopUp
          onClose={() => setShowLoginPopup(false)}
          onSuccess={() => {
            if (isFollowed) {
              handleUnfollow()
            } else {
              handleFollow()
            }
          }}
          theme={themeToUse}
        />
      )}
    </>
  )
}

export default FollowButton
