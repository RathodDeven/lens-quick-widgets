import React, { useEffect, useState } from "react"
import { Size, Theme, ThemeColor } from "./types"
import { Account as AccountType, useAccount } from "@lens-protocol/react"
import { useAccountStats } from "./hooks/useAccountStats"
import { motion, AnimatePresence } from "framer-motion"
import { FaUsers, FaUserFriends, FaExclamationCircle } from "react-icons/fa"
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
 * @param {Theme} [props.theme=Theme.default] - The theme to use for styling
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
  theme = Theme.default,
  containerStyle,
  followButtonStyle,
  followButtonContainerStyle,
  followButtonTextColor,
  hideFollowButton,
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
  const backgroundColor = backgroundColorMap[theme]
  const accentColor = foregroundColorMap[theme]
  const textColor = textColorMap[theme]

  // Determine contrast color based on actual background color
  const contrastTextColor = getContrastColor(backgroundColor)
  const isDarkBackground = contrastTextColor === ThemeColor.white

  // Size reference values (no longer enforced)
  const sizeReference = {
    compact: { width: 180 },
    small: { width: 200 },
    medium: { width: 350 },
    large: { width: 500 },
  }

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

  console.log("Account Stats:", accountStats)

  useEffect(() => {
    if (error) {
      onError?.(error)
    }
  }, [error])

  useEffect(() => {
    if (account) {
      onAccountLoad?.(account)
    }
  }, [account?.address])

  const loading = accountLoading || statsLoading
  const hasError = (error || statsError) && !loading

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
        size === Size.medium ? "350px" : size === Size.large ? "500px" : "auto",
      ...containerStyle,
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: size === Size.compact ? "0" : "0",
      width: size === Size.compact ? "100%" : "auto",
      padding: size === Size.medium || size === Size.large ? "0 20px" : "0",
      flexDirection:
        size === Size.medium || size === Size.large
          ? ("column" as const)
          : ("row" as const),
      textAlign:
        size === Size.medium || size === Size.large
          ? ("center" as const)
          : ("left" as const),
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
      marginTop: size === Size.medium || size === Size.large ? "-30px" : "0", // Half overlapping the banner
    },
    profileInfo: {
      marginLeft: size === Size.medium || size === Size.large ? "0" : "12px",
      marginTop: size === Size.medium || size === Size.large ? "8px" : "0",
      flex: 1,
      overflow: size === Size.compact ? "hidden" : "visible",
      display: "block",
      justifyContent: "center" as const,
      textAlign:
        size === Size.medium || size === Size.large
          ? ("center" as const)
          : ("left" as const),
    },
    compactInfo: {
      // New style for compact info layout
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center" as const,
      height: "30px", // Match the height of the profile image in compact mode
      overflow: "hidden" as const,
      width: "100%",
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
      marginTop: size === Size.medium || size === Size.large ? "12px" : "12px",
      marginBottom: "0px",
      alignItems: "center",
      justifyContent:
        size === Size.medium || size === Size.large ? "center" : "flex-start",
      flexWrap: "wrap" as const,
      padding: size === Size.medium || size === Size.large ? "0 20px" : "0",
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
            <div style={{ ...styles.header }}>
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

  // Remove console.log statements
  console.log("Account:", account)

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

            <div style={styles.profileInfo}>
              {size === Size.compact ? (
                // Updated compact layout to show both name and username
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
              ) : (
                // Standard layout for other sizes
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Stats section - Updated format */}
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
                  {/* Only show icons for small size */}
                  {size === Size.small && (
                    <FaUsers size={12} color={accentColor} />
                  )}
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
                  {/* Only show icons for small size */}
                  {size === Size.small && (
                    <FaUserFriends size={12} color={accentColor} />
                  )}
                  <span style={styles.statNumber}>
                    {accountStats?.graphFollowStats?.following || 0}
                  </span>
                  <span style={styles.statText}>following</span>
                </div>
              </Tooltip>
            </motion.div>
          )}

          {/* Bio section - Only show for large size */}
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
      </motion.div>
    </AnimatePresence>
  )
}
