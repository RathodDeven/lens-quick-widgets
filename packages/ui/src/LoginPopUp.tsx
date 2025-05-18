import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ConnectKitButton } from "connectkit"
import { useAccount, useWalletClient } from "wagmi"
import toast from "react-hot-toast"
import {
  LoginParams,
  useAccountsAvailable,
  useAuthenticatedUser,
  useLogin,
} from "@lens-protocol/react"
import { signMessageWith } from "@lens-protocol/react/viem"
import { FaTimes } from "react-icons/fa"
import { getStampFyiURL } from "./utils"
import { useLensWidget } from "./LensWidgetContext"
import { Theme, ThemeColor } from "./types"
import {
  backgroundColorMap,
  foregroundColorMap,
  textColorMap,
  getContrastColor,
} from "./utils"

interface LoginPopUpProps {
  onClose: () => void
  onSuccess?: () => void
  theme?: Theme
}

const LoginPopUp: React.FC<LoginPopUpProps> = ({
  onClose,
  onSuccess,
  theme,
}) => {
  // Get theme from context to use as fallback
  const { appAddress, theme: contextTheme } = useLensWidget()

  // Use provided theme or fall back to context theme
  const themeToUse = theme || contextTheme

  // Apply theme colors
  const backgroundColor = backgroundColorMap[themeToUse]
  const accentColor = foregroundColorMap[themeToUse]
  const textColor = textColorMap[themeToUse]

  // Determine contrast colors for text/buttons
  const accentTextColor = getContrastColor(accentColor)
  const isDarkBackground =
    getContrastColor(backgroundColor) === ThemeColor.white

  const { data: walletClient } = useWalletClient()
  const { isConnected, address } = useAccount()
  const { data: authenticatedUser } = useAuthenticatedUser()
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<string>()
  const { data: profiles, loading: loadingProfiles } = useAccountsAvailable({
    managedBy: address,
    includeOwned: true,
  })
  const { execute: login, loading: loggingIn } = useLogin()

  useEffect(() => {
    // If user becomes authenticated, close popup and call onSuccess
    if (authenticatedUser) {
      onClose()
      onSuccess?.()
    }
  }, [authenticatedUser])

  const handleLogin = async (profile: any) => {
    setSelectedAccountAddress(profile.account.address)

    const params: LoginParams =
      profile.__typename === "AccountManaged"
        ? {
            accountManager: {
              account: profile.account.address,
              manager: address,
              app: appAddress,
            },
            signMessage: signMessageWith(walletClient!),
          }
        : {
            accountOwner: {
              account: profile.account.address,
              owner: address,
              app: appAddress,
            },
            signMessage: signMessageWith(walletClient!),
          }

    try {
      const result = await login(params)

      if (result.isOk()) {
        onClose()
        onSuccess?.()
      } else {
        toast.error("Error logging in")
      }
    } catch (error) {
      toast.error("Failed to login")
    }
  }

  // Animation variants for various elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          style={{
            backgroundColor,
            color: textColor,
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "90%",
            width: "400px",
            maxHeight: "80vh",
            overflow: "auto",
            position: "relative",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: textColor,
              fontSize: "20px",
              zIndex: 10,
            }}
          >
            <FaTimes />
          </motion.button>

          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              marginBottom: "20px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: textColor,
            }}
          >
            {isConnected
              ? authenticatedUser
                ? "You're logged in"
                : "Login with Lens"
              : "Connect your wallet"}
          </motion.h2>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: "20px" }}
            >
              <ConnectKitButton.Custom>
                {({ show }) => (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={show}
                    style={{
                      padding: "12px 16px",
                      backgroundColor: accentColor,
                      color: accentTextColor,
                      borderRadius: "12px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                      width: "100%",
                      fontSize: "16px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Connect Wallet
                  </motion.button>
                )}
              </ConnectKitButton.Custom>
            </motion.div>
          ) : !authenticatedUser ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {loadingProfiles ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      ease: "linear",
                      duration: 2,
                      repeat: Infinity,
                    }}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: `3px solid ${
                        isDarkBackground
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.1)"
                      }`,
                      borderTopColor: accentColor,
                    }}
                  />
                  <motion.p
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ color: textColor, fontSize: "16px" }}
                  >
                    Loading profiles...
                  </motion.p>
                </motion.div>
              ) : (
                <>
                  {profiles?.items && profiles.items.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {profiles.items.map((profile, index) => (
                        <motion.div
                          key={profile.account.address}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px",
                            borderRadius: "12px",
                            border: `1px solid ${
                              isDarkBackground
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.1)"
                            }`,
                            backgroundColor: isDarkBackground
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.02)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              src={
                                profile.account.metadata?.picture ||
                                getStampFyiURL(profile.account.owner)
                              }
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                border: `2px solid ${accentColor}`,
                              }}
                              alt="Profile"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                            />
                            <div style={{ color: textColor }}>
                              {profile.account.metadata?.name ||
                                "@" + profile.account.username?.localName ||
                                profile.account.address.slice(0, 6) +
                                  "..." +
                                  profile.account.address.slice(-4)}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLogin(profile)}
                            disabled={
                              loggingIn &&
                              selectedAccountAddress === profile.account.address
                            }
                            style={{
                              padding: "8px 14px",
                              backgroundColor: accentColor,
                              color: accentTextColor,
                              borderRadius: "20px",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: "bold",
                              opacity:
                                loggingIn &&
                                selectedAccountAddress ===
                                  profile.account.address
                                  ? 0.7
                                  : 1,
                              transition: "all 0.2s ease",
                            }}
                          >
                            {loggingIn &&
                            selectedAccountAddress ===
                              profile.account.address ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    ease: "linear",
                                    duration: 1,
                                    repeat: Infinity,
                                  }}
                                  style={{
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    border: `2px solid ${accentTextColor}40`,
                                    borderTopColor: accentTextColor,
                                  }}
                                />
                                <span>Logging in...</span>
                              </div>
                            ) : (
                              "Login"
                            )}
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      style={{
                        textAlign: "center",
                        padding: "30px 20px",
                        border: `1px solid ${
                          isDarkBackground
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)"
                        }`,
                        borderRadius: "12px",
                      }}
                    >
                      <p style={{ color: textColor, marginBottom: "16px" }}>
                        No Lens profiles found for this wallet.
                      </p>
                      <p
                        style={{
                          color: isDarkBackground
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.6)",
                          fontSize: "14px",
                        }}
                      >
                        Connect a different wallet or create a Lens profile
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: accentTextColor,
                  fontSize: "30px",
                }}
              >
                <span>✓</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  color: textColor,
                  fontSize: "18px",
                  marginBottom: "16px",
                }}
              >
                You're already logged in!
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSuccess}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  marginTop: "12px",
                  padding: "10px 20px",
                  backgroundColor: accentColor,
                  color: accentTextColor,
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Continue
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LoginPopUp
