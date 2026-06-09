import { useCallback, useEffect, useSyncExternalStore } from 'react'
import {
  STORAGE_KEY,
  applyTheme,
  readStoredTheme,
  resolveTheme,
  subscribeToTheme,
  writeStoredTheme,
  type Theme,
} from '@/lib/theme'

function subscribe(notify: () => void): () => void {
  // Same-tab updates (toggle clicked here).
  const unsubLocal = subscribeToTheme(notify)

  // Cross-tab updates (another tab edited localStorage).
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) notify()
  }
  window.addEventListener('storage', onStorage)

  // Live system-preference updates (only matters when theme === 'system').
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const onMedia = () => notify()
  media.addEventListener('change', onMedia)

  return () => {
    unsubLocal()
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
  const resolved = resolveTheme(theme)

  // Keep the DOM class in sync whenever resolved theme changes
  // (covers explicit changes AND live system-preference flips).
  useEffect(() => {
    applyTheme(resolved)
  }, [resolved])

  const setTheme = useCallback((next: Theme) => {
    writeStoredTheme(next)
  }, [])

  const toggle = useCallback(() => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setTheme])

  return { theme, resolved, setTheme, toggle }
}
