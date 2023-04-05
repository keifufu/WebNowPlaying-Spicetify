/* global Spicetify */
import { timeInSecondsToString } from '../utils/misc'
import { Adapter, BuiltInAdapters, CustomAdapter, RepeatMode, SocketInfoMap, StateMode, defaultSocketInfo, getSettings } from '../utils/settings'
import { WNPReduxWebSocket } from './socket'

export class WNPRedux {
  mediaInfo = {
    player: '',
    state: StateMode.STOPPED,
    title: '',
    artist: '',
    album: '',
    cover: '',
    duration: '0:00',
    position: '0:00',
    volume: 100,
    rating: 0,
    repeat: RepeatMode.NONE,
    shuffle: false,
    timestamp: 0
  }
  sockets = new Map<number, WNPReduxWebSocket>()
  settings = getSettings()

  constructor() {
    this.reloadSockets()
    Spicetify.CosmosAsync.sub('sp://player/v2/main', (data) => {
      if (!data?.track?.metadata) return
      const meta = data.track.metadata
      this.mediaInfo.title = meta.title
      this.mediaInfo.album = meta.album_title
      this.mediaInfo.duration = timeInSecondsToString(Math.round(parseInt(meta.duration) / 1000))
      this.mediaInfo.state = data.is_paused ? StateMode.PAUSED : StateMode.PLAYING
      this.mediaInfo.repeat = data.options.repeating_track ? RepeatMode.ONE : data.options.repeating_context ? RepeatMode.ALL : RepeatMode.NONE
      this.mediaInfo.shuffle = data.options.shuffling_context
      this.mediaInfo.artist = meta.artist_name
      let artistCount = 1
      while (meta['artist_name:' + artistCount]) {
        this.mediaInfo.artist += ', ' + meta['artist_name:' + artistCount]
        artistCount += 1
      }
      if (!this.mediaInfo.artist) this.mediaInfo.artist = meta.album_title // Podcast

      Spicetify.Platform.LibraryAPI.contains(data.track.uri).then(([added]: any) => (this.mediaInfo.rating = added ? 5 : 0))

      const cover = meta.image_xlarge_url
      if (cover?.indexOf('localfile') === -1) this.mediaInfo.cover = 'https://i.scdn.co/image/' + cover.substring(cover.lastIndexOf(':') + 1)
      else this.mediaInfo.cover = ''

      this.updateAll()
    })
    setInterval(this.updateAll.bind(this), 250)
  }

  public reloadSockets() {
    this.settings = getSettings()
    // Close all sockets
    for (const [key, socket] of this.sockets.entries()) {
      socket.close()
      this.sockets.delete(key)
    }
    // Open all sockets
    for (const adapter of BuiltInAdapters) {
      if (this.settings.enabledBuiltInAdapters.includes(adapter.name))
        this.sockets.set(adapter.port, new WNPReduxWebSocket(adapter, this.executeEvent.bind(this)))
    }
    for (const adapter of this.settings.customAdapters) {
      if (adapter.enabled && adapter.port !== 0)
        this.sockets.set(adapter.port, new WNPReduxWebSocket(adapter, this.executeEvent.bind(this)))
    }
  }

  public updateAll() {
    this.mediaInfo.position = timeInSecondsToString(Math.round(Spicetify.Player.getProgress() / 1000))
    this.mediaInfo.volume = Math.round(Spicetify.Player.getVolume() * 100)

    for (const socket of this.sockets.values())
      socket.sendUpdate(this.mediaInfo)
  }

  public executeEvent(communicationRevision: string, data: string) {
    switch (communicationRevision) {
      case 'legacy':
        ExecuteEventLegacy(this, data)
        break
      case '1':
        ExecuteEventRev1(this, data)
        break
      default:
    }

    this.updateAll()
  }

  public connectSocket(port: number) {
    this.settings = getSettings()
    let adapter: Adapter | CustomAdapter | undefined = BuiltInAdapters.find((a) => a.port === port)
    if (!adapter) adapter = this.settings.customAdapters.find((a) => a.port === port)
    if (!adapter) return

    if (this.sockets.has(port)) return
    this.sockets.set(adapter.port, new WNPReduxWebSocket(adapter, this.executeEvent))
  }

  public disconnectSocket(port: number) {
    const socket = this.sockets.get(port)
    if (!socket) return
    socket.close()
    this.sockets.delete(port)
  }

  public getSocketInfo = () => {
    const info: SocketInfoMap = new Map()

    for (const [key, socket] of this.sockets.entries()) {
      info.set(key, {
        version: socket.version,
        isConnected: socket.isConnected,
        isConnecting: socket.isConnecting,
        reconnectAttempts: socket.reconnectAttempts
      })
    }

    // Fill in info for not connected sockets
    for (const adapter of BuiltInAdapters) {
      if (info.has(adapter.port)) continue
      info.set(adapter.port, {
        ...defaultSocketInfo,
        _isPlaceholder: false
      })
    }

    for (const adapter of this.settings.customAdapters) {
      if (info.has(adapter.port)) continue
      info.set(adapter.port, {
        ...defaultSocketInfo,
        _isPlaceholder: false
      })
    }

    return info
  }
}

function ExecuteEventLegacy(self: WNPRedux, message: string) {
  // Quite lengthy functions because we optimistically update spicetifyInfo after receiving events.
  try {
    const [type, data] = message.toUpperCase().split(' ')
    switch (type) {
      case 'PLAYPAUSE': {
        Spicetify.Player.togglePlay()
        self.mediaInfo.state = self.mediaInfo.state === StateMode.PLAYING ? StateMode.PAUSED : StateMode.PLAYING
        break
      }
      case 'NEXT':
        Spicetify.Player.next()
        break
      case 'PREVIOUS':
        Spicetify.Player.back()
        break
      case 'SETPOSITION': {
        // Example string: SetPosition 34:SetProgress 0,100890207715134:
        const [, positionPercentage] = message.toUpperCase().split(':')[1].split('SETPROGRESS ')
        Spicetify.Player.seek(parseFloat(positionPercentage.replace(',', '.')))
        break
      }
      case 'SETVOLUME':
        Spicetify.Player.setVolume(parseInt(data) / 100)
        self.mediaInfo.volume = parseInt(data)
        break
      case 'REPEAT': {
        Spicetify.Player.toggleRepeat()
        self.mediaInfo.repeat = self.mediaInfo.repeat === RepeatMode.NONE ? RepeatMode.ALL : self.mediaInfo.repeat === RepeatMode.ALL ? RepeatMode.ONE : RepeatMode.NONE
        break
      }
      case 'SHUFFLE': {
        Spicetify.Player.toggleShuffle()
        self.mediaInfo.shuffle = !self.mediaInfo.shuffle
        break
      }
      case 'TOGGLETHUMBSUP': {
        Spicetify.Player.toggleHeart()
        self.mediaInfo.rating = self.mediaInfo.rating === 5 ? 0 : 5
        break
      }
      // Spotify doesn't have a negative rating
      // case 'TOGGLETHUMBSDOWN': break
      case 'RATING': {
        const rating = parseInt(data)
        const isLiked = self.mediaInfo.rating > 3
        if (rating >= 3 && !isLiked) Spicetify.Player.toggleHeart()
        else if (rating < 3 && isLiked) Spicetify.Player.toggleHeart()
        self.mediaInfo.rating = rating
        break
      }
      default:
        console.warn(`WNPReduxSpicetify: Unknown event: ${message}`)
        break
    }
  } catch (e) {
    console.error(`WNPReduxSpicetify: Error while executing event: ${e}`)
  }
}

function ExecuteEventRev1(self: WNPRedux, message: string) {
  // Quite lengthy functions because we optimistically update spicetifyInfo after receiving events.
  const [type, data] = message.split(' ')

  try {
    switch (type) {
      case 'TOGGLE_PLAYING': {
        Spicetify.Player.togglePlay()
        self.mediaInfo.state = self.mediaInfo.state === StateMode.PLAYING ? StateMode.PAUSED : StateMode.PLAYING
        break
      }
      case 'NEXT':
        Spicetify.Player.next()
        break
      case 'PREVIOUS':
        Spicetify.Player.back()
        break
      case 'SET_POSITION': {
        const [, positionPercentage] = data.split(':')
        Spicetify.Player.seek(parseFloat(positionPercentage.replace(',', '.')))
        break
      }
      case 'SET_VOLUME':
        Spicetify.Player.setVolume(parseInt(data) / 100)
        self.mediaInfo.volume = parseInt(data)
        break
      case 'TOGGLE_REPEAT': {
        Spicetify.Player.toggleRepeat()
        self.mediaInfo.repeat = self.mediaInfo.repeat === RepeatMode.NONE ? RepeatMode.ALL : self.mediaInfo.repeat === RepeatMode.ALL ? RepeatMode.ONE : RepeatMode.NONE
        break
      }
      case 'TOGGLE_SHUFFLE': {
        Spicetify.Player.toggleShuffle()
        self.mediaInfo.shuffle = !self.mediaInfo.shuffle
        break
      }
      case 'TOGGLE_THUMBS_UP': {
        Spicetify.Player.toggleHeart()
        self.mediaInfo.rating = self.mediaInfo.rating === 5 ? 0 : 5
        break
      }
      // Spotify doesn't have a negative rating
      // case 'TOGGLE_THUMBS_DOWN': break
      case 'SET_RATING': {
        const rating = parseInt(data)
        const isLiked = self.mediaInfo.rating > 3
        if (rating >= 3 && !isLiked) Spicetify.Player.toggleHeart()
        else if (rating < 3 && isLiked) Spicetify.Player.toggleHeart()
        self.mediaInfo.rating = rating
        break
      }
      default:
        console.warn(`WNPReduxSpicetify: Unknown event: ${message}`)
        break
    }
  } catch (e) {
    console.error(`WNPReduxSpicetify: Error while executing event: ${e}`)
  }
}