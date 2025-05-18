import {
  LensProvider,
  mainnet,
  PublicClient,
  testnet,
} from "@lens-protocol/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import { Toaster } from "react-hot-toast"
import LensWidgetContext from "./LensWidgetContext"
import { Theme } from "./types"
import {
  LENS_WIDGET_APP_ADDRESS,
  LENS_WIDGET_APP_ADDRESS_TESTNET,
} from "./config"

const queryClient = new QueryClient()

export const LensWidgetProvider = ({
  isTestnet = false,
  defaultTheme = Theme.default,
  appAddress,
  children,
}: {
  isTestnet?: boolean
  defaultTheme?: Theme
  appAddress?: string
  children: React.ReactNode
}) => {
  const client = PublicClient.create({
    environment: isTestnet ? testnet : mainnet,
    storage: typeof window !== "undefined" ? localStorage : undefined,
  })

  // Use provided appAddress or default based on isTestnet
  const actualAppAddress =
    appAddress ||
    (isTestnet ? LENS_WIDGET_APP_ADDRESS_TESTNET : LENS_WIDGET_APP_ADDRESS)

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider>
        <LensProvider client={client}>
          <LensWidgetContext.Provider
            value={{
              theme: defaultTheme,
              appAddress: actualAppAddress,
              isTestnet,
            }}
          >
            <>
              <Toaster
                position={"top-center"}
                containerStyle={{
                  marginTop: "40px",
                }}
              />
              {children}
            </>
          </LensWidgetContext.Provider>
        </LensProvider>
      </ConnectKitProvider>
    </QueryClientProvider>
  )
}
