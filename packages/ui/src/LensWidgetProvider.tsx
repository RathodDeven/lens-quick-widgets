import {
  LensProvider,
  mainnet,
  PublicClient,
  testnet,
} from "@lens-protocol/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import { Toaster } from "react-hot-toast"

const queryClient = new QueryClient()

export const LensWidgetProvider = ({
  isTestnet = false,
  children,
}: {
  isTestnet?: boolean
  children: React.ReactNode
}) => {
  const client = PublicClient.create({
    environment: isTestnet ? testnet : mainnet,
    storage: typeof window !== "undefined" ? localStorage : undefined,
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider>
        <LensProvider client={client}>
          <>
            <Toaster
              position={"top-center"}
              containerStyle={{
                marginTop: "40px",
              }}
            />
            {children}
          </>
        </LensProvider>
      </ConnectKitProvider>
    </QueryClientProvider>
  )
}
