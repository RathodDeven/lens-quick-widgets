import {
  LensProvider,
  mainnet,
  PublicClient,
  testnet,
} from "@lens-protocol/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"

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
        <LensProvider client={client}>{children}</LensProvider>
      </ConnectKitProvider>
    </QueryClientProvider>
  )
}
