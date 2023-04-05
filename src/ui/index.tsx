import 'common.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import SettingsPanel from './components/SettingsPanel'
import WarningPanel from './components/WarningPanel'
import { SettingsProvider } from './hooks/SettingsContext'
import { SocketInfoProvider } from './hooks/SocketInfoContext'

export const openSettingsPanel = () => {
  const element = document.createElement('div')
  element.id = 'wnp-redux-settings'
  document.body.appendChild(element)
  ReactDOM.render(
    <SettingsProvider>
      <SocketInfoProvider>
        <SettingsPanel />
      </SocketInfoProvider>
    </SettingsProvider>,
    element
  )
}

export const closeSettingsPanel = () => document.getElementById('wnp-redux-settings')?.remove()

export const openWarningPanel = () => {
  const element = document.createElement('div')
  element.id = 'wnp-redux-warning'
  document.body.appendChild(element)
  ReactDOM.render(
    <WarningPanel />,
    element
  )
}