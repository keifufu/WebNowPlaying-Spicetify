// === Types ===
export type CustomAdapter = {
  port: number
  enabled: boolean
  id: string
}

export type Settings = {
  customAdapters: CustomAdapter[]
  enabledBuiltInAdapters: string[]
}

export type Adapter = {
  name: string,
  port: number,
  gh: string,
  authors: {
    name: string,
    link: string
  }[]
}

export type SocketInfo = {
  version: string,
  isConnected: boolean,
  isConnecting: boolean,
  reconnectAttempts: number
  _isPlaceholder?: boolean
}
export type SocketInfoMap = Map<number, SocketInfo>

export enum StateMode { STOPPED = 'STOPPED', PLAYING = 'PLAYING', PAUSED = 'PAUSED' }
export enum RepeatMode { NONE = 'NONE', ONE = 'ONE', ALL = 'ALL' }

export type MediaInfo = {
  player: string
  state: StateMode
  title: string
  artist: string
  album: string
  cover: string
  duration: string
  position: string
  volume: number
  rating: number
  repeat: RepeatMode
  shuffle: boolean
  timestamp: number
}

// === Constants ===
const defaultSettings: Settings = {
  customAdapters: [],
  enabledBuiltInAdapters: ['Rainmeter Adapter']
}

export const getSettings = () => {
  const settings = localStorage.getItem('webnowplaying-redux-settings')
  if (settings) return JSON.parse(settings) as Settings
  return defaultSettings
}

export const saveSettings = (settings: Settings) => {
  localStorage.setItem('webnowplaying-redux-settings', JSON.stringify(settings))
}

export const BuiltInAdapters: Adapter[] = [
  {
    name: 'Rainmeter Adapter',
    port: 8974,
    gh: 'keifufu/WebNowPlaying-Redux-Rainmeter',
    authors: [
      {
        name: 'keifufu',
        link: 'https://github.com/keifufu'
      },
      {
        name: 'tjhrulz',
        link: 'https://github.com/tjhrulz'
      }
    ]
  },
  {
    name: 'Macro Deck Adapter',
    port: 8698,
    gh: 'jbcarreon123/WebNowPlaying-Redux-Macro-Deck',
    authors: [
      {
        name: 'jbcarreon123',
        link: 'https://github.com/jbcarreon123'
      }
    ]
  },
  {
    name: 'OBS Adapter',
    port: 6534,
    gh: 'keifufu/WebNowPlaying-Redux-OBS',
    authors: [
      {
        name: 'keifufu',
        link: 'https://github.com/keifufu'
      }
    ]
  }
]

export const defaultSocketInfo = {
  version: '0.0.0',
  isConnected: false,
  isConnecting: false,
  reconnectAttempts: 0,
  _isPlaceholder: true
}