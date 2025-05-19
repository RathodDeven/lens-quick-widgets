import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ConnectKitButton } from "connectkit"
import { useAccount, useDisconnect } from "wagmi"
import {
  useAuthenticatedUser,
  useAccount as useLensAccount,
  useLogout,
} from "@lens-protocol/react"
import { FaSignOutAlt, FaTimesCircle } from "react-icons/fa"
import Tooltip from "./Tooltip"
import { useLensWidget } from "./LensWidgetContext"
import { Theme, ThemeColor } from "./types"
import {
  backgroundColorMap,
  foregroundColorMap,
  textColorMap,
  getContrastColor,
  getStampFyiURL,
} from "./utils"
import { LensIcon } from "./LensIcon"
import LoginPopUp from "./LoginPopUp"

interface SignInWithLensProps {
  theme?: Theme
  onConnectWallet?: (address: string) => void
  onLogin?: (account: any) => void
  onLogout?: () => void
}

/**
 * SignInWithLens Component - A button for connecting wallet and authenticating with Lens Protocol
 *
 * @component
 * @param {Object} props - Component props
 * @param {Theme} [props.theme] - The theme to use for styling
 * @param {Function} [props.onConnectWallet] - Callback when wallet is connected, receives wallet address
 * @param {Function} [props.onLogin] - Callback when Lens Protocol login is successful, receives account data
 * @param {Function} [props.onLogout] - Callback when user logs out from Lens Protocol
 * @returns {JSX.Element} The rendered sign-in button with authentication states
 */
export const SignInWithLens: React.FC<SignInWithLensProps> = ({
  theme,
  onConnectWallet,
  onLogin,
  onLogout,
}) => {
  // Get theme from context as fallback
  const { theme: contextTheme } = useLensWidget()
  const themeToUse = theme || contextTheme

  // Apply theme colors
  const backgroundColor = backgroundColorMap[themeToUse]
  const accentColor = foregroundColorMap[themeToUse]
  const textColor = textColorMap[themeToUse]
  const accentTextColor = getContrastColor(accentColor)
  const isDarkBackground =
    getContrastColor(backgroundColor) === ThemeColor.white

  // State and hooks
  const [isHovering, setIsHovering] = useState(false)
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: authenticatedUser } = useAuthenticatedUser()
  const { data: account, loading } = useLensAccount({
    address: authenticatedUser?.address,
  })
  const { execute: logout } = useLogout()

  // Add states for login popup
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [signInClicked, setSignInClicked] = useState(false)

  // Pulse animation for loading states
  const pulseAnimation = {
    opacity: [0.6, 0.8, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }

  const iconVariants = {
    initial: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 25 },
    },
    exit: { x: 50, opacity: 0 },
  }

  useEffect(() => {
    if (!address) return
    handleConnectWallet()
  }, [address])

  // Effect to handle auto-opening login popup when wallet is connected after button click
  useEffect(() => {
    if (isConnected && signInClicked && !authenticatedUser) {
      setShowLoginPopup(true)
      setSignInClicked(false) // Reset the flag once popup is shown
    }
  }, [isConnected, signInClicked, authenticatedUser])

  // Handlers
  const handleConnectWallet = () => {
    if (address && onConnectWallet) {
      onConnectWallet(address)
    }
  }

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation()
    disconnect()
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const result = await logout()
    if (result.isOk() && onLogout) {
      onLogout()
    }
  }

  // Handle when user clicks the "Sign in with Lens" button
  const handleSignInClick = () => {
    if (isConnected && !authenticatedUser) {
      // If wallet is already connected but not authenticated, show popup directly
      setShowLoginPopup(true)
    } else if (!isConnected) {
      // If wallet not connected, set flag to show popup after connection
      setSignInClicked(true)
    }
  }

  // Effect to call onLogin when account becomes available
  useEffect(() => {
    if (account && onLogin) {
      onLogin(account)
    }
  }, [account, onLogin])

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ position: "relative", display: "inline-block" }}
    >
      <motion.button
        initial="initial"
        whileHover="hover"
        whileTap={{ scale: 0.97 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "10px 16px",
          color: textColor,
          backgroundColor: backgroundColor,
          borderRadius: "20px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "15px",
          transition: "all 0.2s ease",
          overflow: "hidden",
          height: "42px",
          position: "relative",
        }}
      >
        {authenticatedUser ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                position: "relative",
              }}
            >
              {loading ? (
                <motion.div
                  animate={pulseAnimation}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: `${textColor}40`,
                    border: `1px solid ${textColor}40`,
                  }}
                />
              ) : (
                <motion.img
                  src={
                    account?.metadata?.picture || getStampFyiURL(address || "")
                  }
                  alt="Profile"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: `1px solid ${textColor}40`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}

              {loading ? (
                <motion.div
                  animate={pulseAnimation}
                  style={{
                    width: "100px",
                    height: "16px",
                    borderRadius: "4px",
                    backgroundColor: `${textColor}40`,
                  }}
                />
              ) : (
                <span
                  style={{
                    maxWidth: "140px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {account?.username?.localName ||
                    account?.metadata?.name ||
                    `${address?.slice(0, 5)}...${address?.slice(-4)}`}
                </span>
              )}
            </div>

            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial="initial"
                  animate="visible"
                  exit="exit"
                  variants={iconVariants}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accentTextColor,
                    background: accentColor,
                    borderRadius: "20px 0 0 20px",
                    padding: "0 16px",
                    boxShadow: "-2px 0 4px rgba(0,0,0,0.1)",
                  }}
                  onClick={handleLogout}
                >
                  <Tooltip content="Logout" position="bottom">
                    <FaSignOutAlt size={16} />
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : isConnected ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                position: "relative",
              }}
              onClick={handleSignInClick}
            >
              <span
                style={{
                  marginRight: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LensIcon width={24} height={24} theme={themeToUse} />
              </span>
              <span style={{ cursor: "pointer" }}>Sign in with Lens</span>
            </div>

            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial="initial"
                  animate="visible"
                  exit="exit"
                  variants={iconVariants}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accentTextColor,
                    background: accentColor,
                    borderRadius: "20px 0 0 20px",
                    padding: "0 16px",
                    boxShadow: "-2px 0 4px rgba(0,0,0,0.1)",
                  }}
                  onClick={handleDisconnect}
                >
                  <Tooltip content="Disconnect Wallet" position="bottom">
                    <FaTimesCircle size={16} />
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <ConnectKitButton.Custom>
            {({ show }) => (
              <div
                onClick={() => {
                  show?.()
                  setSignInClicked(true) // Set flag when wallet connect is initiated
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    marginRight: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LensIcon width={24} height={24} theme={themeToUse} />
                </span>
                <span>Sign in with Lens</span>
              </div>
            )}
          </ConnectKitButton.Custom>
        )}
      </motion.button>

      {/* Add LoginPopUp component */}
      {showLoginPopup && (
        <LoginPopUp
          onClose={() => setShowLoginPopup(false)}
          onSuccess={() => {
            setShowLoginPopup(false)
            // If you need to do something after successful login
          }}
          theme={themeToUse}
        />
      )}
    </div>
  )
}
