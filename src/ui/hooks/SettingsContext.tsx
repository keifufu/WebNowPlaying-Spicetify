import React from 'react'
import { randomToken } from '../../utils/misc'
import { BuiltInAdapters, Settings, getSettings, saveSettings } from '../../utils/settings'

const SettingsContext = React.createContext<{ settings: Settings, saveSettingsWrapper:(newSettings: Settings) => void }>({
  settings: getSettings(),
  saveSettingsWrapper: () => null
})

const SettingsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = React.useState(getSettings())

  const saveSettingsWrapper = React.useCallback(
    (newSettings: Settings) => {
      setSettings(newSettings)
      saveSettings(newSettings)
    },
    [setSettings]
  )

  const value = React.useMemo(() => ({ settings, saveSettingsWrapper }), [
    settings,
    saveSettingsWrapper
  ])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

const useSettings = () => {
  const { settings, saveSettingsWrapper } = React.useContext(SettingsContext)

  return {
    settings,
    toggleAdapter: (port: number) => {
      const builtInAdapter = BuiltInAdapters.find((a) => a.port === port)
      if (builtInAdapter) {
        saveSettingsWrapper({
          ...settings,
          enabledBuiltInAdapters: settings.enabledBuiltInAdapters.includes(builtInAdapter.name) ? settings.enabledBuiltInAdapters.filter((e) => e !== builtInAdapter.name) : [...settings.enabledBuiltInAdapters, builtInAdapter.name]
        })
      }

      const customAdapter = settings.customAdapters.find((a) => a.port === port)
      if (customAdapter) {
        saveSettingsWrapper({
          ...settings,
          customAdapters: settings.customAdapters.map((a) => (a.port === port ? { ...a, enabled: !a.enabled } : a))
        })
      }
    },
    addCustomAdapter: () => {
      if (settings.customAdapters.some((e) => e.port === 0)) return
      saveSettingsWrapper({
        ...settings,
        customAdapters: [...settings.customAdapters, { id: randomToken(), enabled: true, port: 0 }]
      })
    },
    updateCustomAdapter: (id: string, port: number) => {
      saveSettingsWrapper({
        ...settings,
        customAdapters: settings.customAdapters.map((a) => (a.id === id ? { ...a, port } : a))
      })
    },
    removeCustomAdapter: (id: string) => {
      saveSettingsWrapper({
        ...settings,
        customAdapters: settings.customAdapters.filter((a) => a.id !== id)
      })
    }
  }
}

export { SettingsProvider, SettingsContext, useSettings }