import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ConnectKitButton } from "connectkit"
import { useAccount, useWalletClient } from "wagmi"
import { APP_ADDRESS } from "./config"
import toast from "react-hot-toast"
import {
  LoginParams,
  Role,
  useAccountsAvailable,
  useAuthenticatedUser,
  useLogin,
} from "@lens-protocol/react"
import { signMessageWith } from "@lens-protocol/react/viem"
import { FaTimes } from "react-icons/fa"
import { getStampFyiURL } from "./utils"

interface LoginPopUpProps {
  onClose: () => void
  onSuccess?: () => void
}

const LoginPopUp: React.FC<LoginPopUpProps> = ({ onClose, onSuccess }) => {
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

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "90%",
            width: "400px",
            maxHeight: "80vh",
            overflow: "auto",
            position: "relative",
            color: "#333",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            <FaTimes />
          </button>

          <h2
            style={{
              marginBottom: "20px",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {isConnected
              ? authenticatedUser
                ? "You're logged in"
                : "Login with Lens"
              : "Connect your wallet"}
          </h2>

          {!isConnected ? (
            <div style={{ marginBottom: "20px" }}>
              <ConnectKitButton.Custom>
                {({ show }) => (
                  <button
                    onClick={show}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#8B5CF6",
                      color: "white",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Connect Wallet
                  </button>
                )}
              </ConnectKitButton.Custom>
            </div>
          ) : !authenticatedUser ? (
            <div>
              {loadingProfiles ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  Loading profiles...
                </div>
              ) : (
                <>
                  {profiles?.items && profiles.items.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {profiles.items.map((profile) => (
                        <div
                          key={profile.account.address}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <img
                              src={
                                profile.account.metadata?.picture ||
                                getStampFyiURL(profile.account.owner)
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                              }}
                              alt="Profile"
                            />
                            <div>
                              {profile.account.metadata?.name ||
                                "@" + profile.account.username?.localName ||
                                profile.account.address.slice(0, 6) +
                                  "..." +
                                  profile.account.address.slice(-4)}
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              setSelectedAccountAddress(profile.account.address)

                              const params: LoginParams =
                                profile.__typename === "AccountManaged"
                                  ? {
                                      accountManager: {
                                        account: profile.account.address,
                                        manager: address,
                                        app: APP_ADDRESS,
                                      },
                                      signMessage: signMessageWith(
                                        walletClient!
                                      ),
                                    }
                                  : {
                                      accountOwner: {
                                        account: profile.account.address,
                                        owner: address,
                                        app: APP_ADDRESS,
                                      },
                                      signMessage: signMessageWith(
                                        walletClient!
                                      ),
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
                            }}
                            disabled={
                              loggingIn &&
                              selectedAccountAddress === profile.account.address
                            }
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#8B5CF6",
                              color: "white",
                              borderRadius: "20px",
                              border: "none",
                              cursor: "pointer",
                              opacity:
                                loggingIn &&
                                selectedAccountAddress ===
                                  profile.account.address
                                  ? 0.7
                                  : 1,
                            }}
                          >
                            {loggingIn &&
                            selectedAccountAddress === profile.account.address
                              ? "Logging in..."
                              : "Login"}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <p>No Lens profiles found for this wallet.</p>
                      <button
                        onClick={async () => {
                          try {
                            const result = await login({
                              signMessage: signMessageWith(walletClient!),
                              onboardingUser: {
                                wallet: address!,
                                app: APP_ADDRESS,
                              },
                            })

                            if (result.isOk()) {
                              onClose()
                              onSuccess?.()
                            } else {
                              toast.error("Failed to login")
                            }
                          } catch (error) {
                            toast.error("Failed to login with wallet")
                          }
                        }}
                        disabled={loggingIn}
                        style={{
                          marginTop: "12px",
                          padding: "8px 16px",
                          backgroundColor: "#8B5CF6",
                          color: "white",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          opacity: loggingIn ? 0.7 : 1,
                        }}
                      >
                        {loggingIn ? "Logging in..." : "Login with Wallet"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>You're already logged in!</p>
              <button
                onClick={onSuccess}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#8B5CF6",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Continue
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default LoginPopUp
