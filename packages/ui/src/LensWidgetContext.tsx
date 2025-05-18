import { createContext, useContext } from "react"
import { Theme } from "./types"

interface LensWidgetContextType {
  theme: Theme
  appAddress: string
  isTestnet: boolean
}

const LensWidgetContext = createContext<LensWidgetContextType | undefined>(
  undefined
)

export const useLensWidget = () => {
  const context = useContext(LensWidgetContext)
  if (context === undefined) {
    throw new Error("useLensWidget must be used within a LensWidgetProvider")
  }
  return context
}

export default LensWidgetContext
