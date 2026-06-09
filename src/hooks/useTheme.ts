import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { STORAGE_KEY, applyTheme, readStoredTheme, resolveTheme, type Theme } from '@/lib/theme'

function subscribe(notify: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) notify()
  }
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const onMedia = () => notify()

  window.addEventListener('storage', onStorage)
  media.addEventListener('change', onMedia)
  return () => {
    window.removeEventListener('storage', onStorage)
    media.removeEventListener('change', onMedia)
  }
}

function getSnapshot(): Theme {
  return readStoredTheme()
}

function getServerSnapshot(): Theme {
  return 'system'
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Keep the DOM class in sync whenever theme (or system preference) changes
  useEffect(() => {
    applyTheme(resolveTheme(theme))
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    if (next === 'system') {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
    // Force same-tab listeners to re-read (storage event only fires cross-tab)
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
  }, [])

  const resolved = resolveTheme(theme)

  const toggle = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setTheme])

  return { theme, resolved, setTheme, toggle }
}
