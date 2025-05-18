import { useEffect, useMemo, useState } from "react"
import {
  UnexpectedError,
  AccountStats,
  AccountStatsRequest,
  usePublicClient,
} from "@lens-protocol/react"
import { fetchAccountStats } from "@lens-protocol/client/actions"
import { createStableHook } from "./createStableHook"

interface UseAccountStatsReturn {
  loading: boolean
  data: AccountStats | null
  error: UnexpectedError | null
}

const useAccountStatsHook = (
  request: AccountStatsRequest
): UseAccountStatsReturn => {
  const { currentSession } = usePublicClient()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AccountStats | null>(null)
  const [error, setError] = useState<UnexpectedError | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (
        !currentSession ||
        (!request?.account && !request?.username?.localName)
      ) {
        return // Don't proceed if currentSession is not available
      }

      setLoading(true)
      try {
        // @ts-ignore
        const result = await fetchAccountStats(currentSession, request)

        if (result?.isOk()) {
          setError(null)
          setData(result.value)
        } else if (result?.isErr()) {
          setError(result.error)
        }
      } catch (err) {
        setError(
          err instanceof UnexpectedError
            ? err
            : new UnexpectedError(String(err))
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [request]) // Add request to the dependency array

  return {
    loading,
    data,
    error,
  }
}

export const useAccountStats = createStableHook(useAccountStatsHook)
