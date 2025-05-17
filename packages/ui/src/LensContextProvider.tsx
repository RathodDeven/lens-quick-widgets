import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, type Chain } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { createContext, useContext } from "react"
import { chains } from "@lens-chain/sdk/viem"

export interface LensContextConfig {
  /** App name displayed in ConnectKit */
  appName?: string
  /** App description displayed in ConnectKit */
  appDescription?: string
  /** URL of your application */
  appUrl?: string
  /** Icon URL for your application */
  appIcon?: string
  /** Custom React Query client */
  queryClient?: QueryClient
  /** Chain configuration (defaults to Lens mainnet) */
  chains?: readonly [Chain, ...Chain[]]
  /** Custom transports configuration */
  transports?: Record<number, any>
}

interface LensContextValue {
  /** The Wagmi configuration object */
  config: ReturnType<typeof createConfig> | null
  /** The configuration options provided to the Web3Provider */
  options: LensContextConfig
}

const MyLensContext = createContext<LensContextValue>({
  config: null,
  options: {},
})

export const useMyLensContext = () => {
  const context = useContext(MyLensContext)
  if (!context)
    throw new Error("useMyLensContext must be used within LensProvider")
  return context
}

const createWagmiConfig = (lensConfig: LensContextConfig) => {
  const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  // Use lens mainnet chain as the default with proper type casting
  const appChains = lensConfig.chains || [chains.mainnet as Chain]

  const defaultTransports = {
    [chains.mainnet.id]: http(
      `https://lens-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
    ),
  }

  return createConfig(
    getDefaultConfig({
      chains: appChains,
      transports: lensConfig.transports || defaultTransports,
      walletConnectProjectId: walletConnectProjectId!,
      appName: lensConfig.appName || "Your App Name",
      appDescription: lensConfig.appDescription || "Your App Description",
      appUrl: lensConfig.appUrl || "https://family.co",
      appIcon: lensConfig.appIcon || "https://family.co/logo.png",
    })
  )
}

export interface LensContextProviderProps {
  /** Configuration options for the Lens context */
  config?: LensContextConfig
  /** React children */
  children: React.ReactNode
}

// For backwards compatibility
export type Web3ProviderProps = LensContextProviderProps

export const LensContextProvider = ({
  config = {},
  children,
}: Web3ProviderProps) => {
  const wagmiConfig = createWagmiConfig(config)
  const queryClient = config.queryClient || new QueryClient()

  return (
    <MyLensContext.Provider value={{ config: wagmiConfig, options: config }}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </MyLensContext.Provider>
  )
}

// For backwards compatibility
export const Web3Provider = LensContextProvider
