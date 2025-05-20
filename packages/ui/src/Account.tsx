import React, { useEffect, useState } from "react"
import { Size, Theme, ThemeColor } from "./types"
import {
  Account as AccountType,
  useAccount,
  useAuthenticatedUser,
} from "@lens-protocol/react"

// Define fontSizes mapping based on the Size enum
const fontSizes = {
  [Size.compact]: "10px",
  [Size.small]: "12px",
  [Size.medium]: "14px",
  [Size.large]: "16px",
}
import { useAccountStats } from "./hooks/useAccountStats"
import { motion, AnimatePresence } from "framer-motion"
import { FaExclamationCircle } from "react-icons/fa"
import {
  backgroundColorMap,
  foregroundColorMap,
  textColorMap,
  getContrastColor,
  getStampFyiURL,
} from "./utils"
import { COVER_IMAGE_PLACE_HOLDER, HEY_LOGO_URL, HEY_LINK } from "./config"
import { ImageModal } from "./ImageModal"
import Tooltip from "./Tooltip"
import Markup from "./Lexical/Markup"
import FollowButton from "./FollowButton"
import LoginPopUp from "./LoginPopUp"
import toast from "react-hot-toast"
import { useLensWidget } from "./LensWidgetContext"

/**
 * Account Component - Displays a Lens Protocol user profile
 *
 * @component
 * @param {Object} props - Component props
 * @param {AccountType} [props.account] - Directly provided account data
 * @param {string} [props.accountAddress] - The account address to load
 * @param {string} [props.localName] - The local name of the account
 * @param {Function} [props.onAccountLoad] - Callback when account loads successfully
 * @param {Function} [props.onError] - Callback when an error occurs
 * @param {Theme} [props.theme] - The theme to use for styling
 * @param {React.CSSProperties} [props.containerStyle] - Custom container style
 * @param {React.CSSProperties} [props.followButtonStyle] - Custom follow button style
 * @param {React.CSSProperties} [props.followButtonContainerStyle] - Custom follow button container style
 * @param {string} [props.followButtonTextColor] - Custom follow button text color
 * @param {boolean} [props.hideFollowButton] - Whether to hide the follow button
 * @param {boolean} [props.showUnfollowButton=false] - Whether to show the unfollow button for followed users
 * @param {boolean} [props.showHeyButton=false] - Whether to show the Hey button linking to the profile on Hey.xyz
 * @param {Function} [props.onFollowed] - Callback when user is followed
 * @param {Function} [props.onClick] - Callback when the component is clicked, receives account and stats data
 * @param {Size} [props.size=Size.medium] - Size of the component:
 *   - compact:inline minimal display for headers
 *   - small:minimal info
 *   - medium: standard info
 *   - large: complete profile
 * @param {string} [props.fontSize] - Custom font size
 * @returns {JSX.Element | null} The rendered Account component
 */
export const Account = ({
  account,
  accountAddress,
  localName,
  onAccountLoad,
  onError,
  theme,
  containerStyle,
  followButtonStyle,
  hideFollowButton = false,
  showUnfollowButton = false,
  showHeyButton = false,
  onFollowed,
  onClick,
  size = Size.medium,
  fontSize,
}: {
  account?: AccountType
  accountAddress?: string
  localName?: string
  onAccountLoad?: (account: AccountType) => void
  onError?: (error: Error) => void
  theme?: Theme
  containerStyle?: React.CSSProperties
  followButtonStyle?: React.CSSProperties
  followButtonContainerStyle?: React.CSSProperties
  followButtonTextColor?: string
  hideFollowButton?: boolean
  showUnfollowButton?: boolean
  showHeyButton?: boolean
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

  // State to track hover state for showing/hiding UI elements
  const [isHovered, setIsHovered] = useState(false)

  // Only fetch if we don't have a direct account provided
  const {
    data: fetchedAccount,
    error,
    loading: accountLoading,
  } = useAccount({
    address: !account ? accountAddress : undefined,
    username:
      !account && localName && !accountAddress
        ? {
            localName: localName,
          }
        : undefined,
  })

  // Use provided account or fall back to fetched account
  const currentAccount = account || fetchedAccount

  const {
    data: accountStats,
    error: statsError,
    loading: statsLoading,
  } = useAccountStats({
    account: currentAccount?.address,
  })

  const { data: authenticatedUser } = useAuthenticatedUser()

  useEffect(() => {
    if (error) {
      onError?.(error)
    }
  }, [error])

  useEffect(() => {
    if (currentAccount) {
      onAccountLoad?.(currentAccount)
    }
  }, [currentAccount?.address])

  const loading = (!account && accountLoading) || statsLoading
  const hasError = !currentAccount && (error || statsError) && !loading

  // Simplified renderFollowButton function
  const renderFollowButton = () => {
    // Hide follow button if user is viewing their own profile or if hideFollowButton is true
    const isOwnProfile =
      authenticatedUser?.address?.toLowerCase() ===
      currentAccount?.address?.toLowerCase()
    if (hideFollowButton || isOwnProfile || !currentAccount) return null

    return (
      <FollowButton
        account={currentAccount}
        size={size}
        theme={themeToUse}
        style={followButtonStyle}
        onFollowChange={onFollowed ? () => onFollowed() : undefined}
        showUnfollowButton={showUnfollowButton}
      />
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
      // Align profile image to left when follow button is visible, otherwise center
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
      // Remove alignItems for medium/large to allow headerRow to control alignment
      alignItems: (size === Size.medium || size === Size.large
        ? "stretch" // Use stretch to allow child to take full width
        : "flex-start") as React.CSSProperties["alignItems"],
      textAlign: (!hideFollowButton &&
      (size === Size.medium || size === Size.large)
        ? "left"
        : size === Size.medium || size === Size.large
        ? "center"
        : "left") as React.CSSProperties["textAlign"],
      width: size === Size.medium || size === Size.large ? "100%" : "auto", // Ensure full width for medium/large
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
      // Left-align stats for medium when follow button is visible, and for large size
      // Center stats when hideFollowButton is true
      justifyContent:
        !hideFollowButton && (size === Size.medium || size === Size.large)
          ? "flex-start"
          : size === Size.small
          ? "flex-start"
          : "center",
      flexWrap: "wrap" as const,
      padding:
        size === Size.large
          ? !hideFollowButton
            ? "0 20px 0 20px"
            : "0 20px"
          : size === Size.medium
          ? !hideFollowButton
            ? "0 20px 0 20px" // Add left padding to align with name/username
            : "0 10px" // Add left padding when follow button is hidden
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
      justifyContent: hideFollowButton ? "center" : "space-between", // Center when follow button is hidden
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
  if (hasError || !currentAccount) {
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
          if (onClick && currentAccount) {
            onClick(currentAccount, accountStats)
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Banner image for medium and large sizes */}
        {(size === Size.medium || size === Size.large) && (
          <motion.img
            src={
              currentAccount?.metadata?.coverPicture || COVER_IMAGE_PLACE_HOLDER
            }
            alt="Cover"
            style={styles.coverImage as any}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Hey button for medium and large when follow button is hidden - positioned absolutely */}
        {(size === Size.medium || size === Size.large) &&
          hideFollowButton &&
          showHeyButton && (
            <div
              style={{
                position: "absolute",
                top: size === Size.medium ? "110px" : "130px", // Just below the banner
                right: "20px",
                zIndex: 2,
              }}
            >
              <Tooltip
                content="Open in Hey"
                isDarkTheme={isDarkBackground}
                position="bottom"
              >
                <motion.a
                  href={`${HEY_LINK}/u/${
                    currentAccount?.username?.localName ||
                    currentAccount?.address
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "50%",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.img
                    src={HEY_LOGO_URL}
                    alt="View on Hey"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                    }}
                    whileHover={{ rotate: 10 }}
                  />
                </motion.a>
              </Tooltip>
            </div>
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
                currentAccount?.metadata?.picture ||
                getStampFyiURL(currentAccount?.owner) ||
                ""
              }
              imageAlt={
                currentAccount?.metadata?.name ||
                currentAccount?.username?.localName ||
                "Profile"
              }
              trigger={
                <motion.img
                  src={
                    currentAccount?.metadata?.picture ||
                    getStampFyiURL(currentAccount?.owner) ||
                    ""
                  }
                  alt={
                    currentAccount?.metadata?.name ||
                    currentAccount?.username?.localName ||
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
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div style={styles.compactInfo}>
                    {currentAccount?.metadata?.name && (
                      <motion.div
                        style={styles.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {currentAccount.metadata.name}
                      </motion.div>
                    )}
                    <motion.div
                      style={styles.username}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      @
                      {currentAccount?.username?.localName ||
                        currentAccount?.address?.slice(0, 6) +
                          "..." +
                          currentAccount?.address?.slice(-4)}
                    </motion.div>
                  </div>
                  {/* Button container with fixed width to prevent layout shifts */}
                  <div
                    style={{
                      marginLeft: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      minWidth: showHeyButton ? "60px" : "0", // Reserve space when showHeyButton is true
                      justifyContent: "flex-end",
                    }}
                  >
                    {showHeyButton && (
                      <Tooltip
                        content="Open in Hey"
                        isDarkTheme={isDarkBackground}
                        position="bottom"
                      >
                        <motion.a
                          href={`${HEY_LINK}/u/${
                            currentAccount?.username?.localName ||
                            currentAccount?.address
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{
                            scale: 1.1,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <motion.img
                            src={HEY_LOGO_URL}
                            alt="View on Hey"
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                            }}
                            whileHover={{ rotate: 10 }}
                          />
                        </motion.a>
                      </Tooltip>
                    )}
                    {renderFollowButton()}
                  </div>
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
                  }}
                >
                  <div>
                    {currentAccount?.metadata?.name && (
                      <motion.div
                        style={styles.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {currentAccount.metadata.name}
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      style={styles.username}
                    >
                      @
                      {currentAccount?.username?.localName ||
                        currentAccount?.address?.slice(0, 6) +
                          "..." +
                          currentAccount?.address?.slice(-4)}
                    </motion.div>
                  </div>
                  {/* Button container with fixed width for small size */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      minWidth: showHeyButton ? "70px" : "0",
                      justifyContent: "flex-end",
                      marginLeft: "16px", // Add margin to create space between username and buttons
                    }}
                  >
                    {showHeyButton && (
                      <Tooltip
                        content="Open in Hey"
                        isDarkTheme={isDarkBackground}
                        position="bottom"
                      >
                        <motion.a
                          href={`${HEY_LINK}/u/${
                            currentAccount?.username?.localName ||
                            currentAccount?.address
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            opacity: isHovered ? 1 : 0,
                          }}
                          whileHover={{
                            scale: 1.1,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <motion.img
                            src={HEY_LOGO_URL}
                            alt="View on Hey"
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                            }}
                            whileHover={{ rotate: 10 }}
                          />
                        </motion.a>
                      </Tooltip>
                    )}
                    {!hideFollowButton && renderFollowButton()}
                  </div>
                </div>
              </div>
            ) : (
              // Medium and large layout
              <div style={styles.profileInfo}>
                <div
                  style={{
                    ...styles.headerRow,
                    justifyContent: hideFollowButton
                      ? "center"
                      : "space-between", // Center when follow button is hidden
                    width: "100%", // Force full width
                  }}
                >
                  <div
                    style={{
                      maxWidth: hideFollowButton ? "100%" : "70%",
                      textAlign: hideFollowButton
                        ? "center"
                        : ("left" as React.CSSProperties["textAlign"]),
                    }}
                  >
                    {" "}
                    {/* Limit name width to leave space for buttons */}
                    {currentAccount?.metadata?.name && (
                      <motion.div
                        style={styles.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {currentAccount.metadata.name}
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      style={styles.username}
                    >
                      @
                      {currentAccount?.username?.localName ||
                        currentAccount?.address?.slice(0, 6) +
                          "..." +
                          currentAccount?.address?.slice(-4)}
                    </motion.div>
                  </div>
                  {/* Only show buttons in header row when follow button is enabled */}
                  {!hideFollowButton && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        minWidth: showHeyButton ? "80px" : "0",
                        justifyContent: "flex-end",
                      }}
                    >
                      {showHeyButton && (
                        <Tooltip
                          content="Open in Hey"
                          isDarkTheme={isDarkBackground}
                          position="bottom"
                        >
                          <motion.a
                            href={`${HEY_LINK}/u/${
                              currentAccount?.username?.localName ||
                              currentAccount?.address
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              opacity: isHovered ? 1 : 0,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{
                              scale: 1.1,
                              transition: { duration: 0.2 },
                            }}
                          >
                            <motion.img
                              src={HEY_LOGO_URL}
                              alt="View on Hey"
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                              }}
                              whileHover={{ rotate: 10 }}
                            />
                          </motion.a>
                        </Tooltip>
                      )}
                      {renderFollowButton()}
                    </div>
                  )}
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
          {size === Size.large && currentAccount?.metadata?.bio && (
            <motion.div
              style={styles.bioContainer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Markup>{currentAccount.metadata.bio}</Markup>
            </motion.div>
          )}
        </div>

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
