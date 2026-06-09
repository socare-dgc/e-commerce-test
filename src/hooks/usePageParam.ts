import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function usePageParam(defaultPage = 1) {
  const [searchParams, setSearchParams] = useSearchParams()
  const raw = searchParams.get('page')
  const parsed = raw ? Number.parseInt(raw, 10) : defaultPage
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : defaultPage

  const setPage = useCallback(
    (next: number) => {
      const params = new URLSearchParams(searchParams)
      if (next === defaultPage) {
        params.delete('page')
      } else {
        params.set('page', String(next))
      }
      setSearchParams(params, { replace: false })
    },
    [searchParams, setSearchParams, defaultPage],
  )

  return [page, setPage] as const
}
