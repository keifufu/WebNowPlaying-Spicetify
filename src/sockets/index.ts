/* global Spicetify */
import { Adapter, BuiltInAdapters, CustomAdapter, RatingSystem, RepeatMode, SocketInfoMap, StateMode, defaultSocketInfo, getSettings } from '../utils/settings'
import { WNPReduxWebSocket } from './socket'

export class WNPRedux {
  mediaInfo = {
    playerName: 'Spotify Desktop',
    playerControls: JSON.stringify({
      supports_play_pause: true,
      supports_skip_previous: true,
      supports_skip_next: true,
      supports_set_position: true,
      supports_set_volume: true,
      supports_toggle_repeat_mode: true,
      supports_toggle_shuffle_active: true,
      supports_set_rating: true,
      rating_system: RatingSystem.LIKE
    }),
    state: StateMode.STOPPED,
    title: '',
    artist: '',
    album: '',
    coverUrl: '',
    durationSeconds: 0,
    positionSeconds: 0,
    volume: 100,
    rating: 0,
    repeatMode: RepeatMode.NONE,
    shuffleActive: false,
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
      this.mediaInfo.durationSeconds = Math.round(parseInt(meta.duration) / 1000)
      this.mediaInfo.state = data.is_paused ? StateMode.PAUSED : StateMode.PLAYING
      this.mediaInfo.repeatMode = data.options.repeating_track ? RepeatMode.ONE : data.options.repeating_context ? RepeatMode.ALL : RepeatMode.NONE
      this.mediaInfo.shuffleActive = data.options.shuffling_context
      this.mediaInfo.artist = meta.artist_name
      let artistCount = 1
      while (meta['artist_name:' + artistCount]) {
        this.mediaInfo.artist += ', ' + meta['artist_name:' + artistCount]
        artistCount += 1
      }
      if (!this.mediaInfo.artist) this.mediaInfo.artist = meta.album_title // Podcast

      Spicetify.Platform.LibraryAPI.contains(data.track.uri).then(([added]: any) => (this.mediaInfo.rating = added ? 5 : 0))

      const cover = meta.image_xlarge_url
      if (cover?.indexOf('localfile') === -1) this.mediaInfo.coverUrl = 'https://i.scdn.co/image/' + cover.substring(cover.lastIndexOf(':') + 1)
      else this.mediaInfo.coverUrl = ''

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
    this.mediaInfo.positionSeconds = Math.round(Spicetify.Player.getProgress() / 1000)
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
      case '2':
        ExecuteEventRev2(this, data)
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
  enum Events {
    PLAYPAUSE,
    PREVIOUS,
    NEXT,
    SETPOSITION,
    SETVOLUME,
    REPEAT,
    SHUFFLE,
    TOGGLETHUMBSUP,
    TOGGLETHUMBSDOWN,
    RATING
  }

  const [type, data] = message.toUpperCase().split(' ')
  switch (Events[type as keyof typeof Events]) {
    case Events.PLAYPAUSE: {
      Spicetify.Player.togglePlay()
      self.mediaInfo.state = self.mediaInfo.state === StateMode.PLAYING ? StateMode.PAUSED : StateMode.PLAYING
      break
    }
    case Events.PREVIOUS: Spicetify.Player.back(); break
    case Events.NEXT: Spicetify.Player.next(); break
    case Events.SETPOSITION: {
      // Example string: SetPosition 34:SetProgress 0,100890207715134:
      const [, positionPercentage] = message.toUpperCase().split(':')[1].split('SETPROGRESS ')
      // We replace(',', '.') because all legacy versions didn't use InvariantCulture
      Spicetify.Player.seek(parseFloat(positionPercentage.replace(',', '.')))
      break
    }
    case Events.SETVOLUME:
      Spicetify.Player.setVolume(parseInt(data) / 100)
      self.mediaInfo.volume = parseInt(data)
      break
    case Events.REPEAT: {
      Spicetify.Player.toggleRepeat()
      self.mediaInfo.repeatMode = self.mediaInfo.repeatMode === RepeatMode.NONE ? RepeatMode.ALL : self.mediaInfo.repeatMode === RepeatMode.ALL ? RepeatMode.ONE : RepeatMode.NONE
      break
    }
    case Events.SHUFFLE: {
      Spicetify.Player.toggleShuffle()
      self.mediaInfo.shuffleActive = !self.mediaInfo.shuffleActive
      break
    }
    case Events.TOGGLETHUMBSUP: {
      Spicetify.Player.toggleHeart()
      self.mediaInfo.rating = self.mediaInfo.rating === 5 ? 0 : 5
      break
    }
    case Events.TOGGLETHUMBSDOWN: break
    case Events.RATING: {
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
}

function ExecuteEventRev1(self: WNPRedux, message: string) {
  enum Events {
    TOGGLE_PLAYING,
    PREVIOUS,
    NEXT,
    SET_POSITION,
    SET_VOLUME,
    TOGGLE_REPEAT,
    TOGGLE_SHUFFLE,
    TOGGLE_THUMBS_UP,
    TOGGLE_THUMBS_DOWN,
    SET_RATING
  }

  const [type, data] = message.toUpperCase().split(' ')
  switch (Events[type as keyof typeof Events]) {
    case Events.TOGGLE_PLAYING: {
      Spicetify.Player.togglePlay()
      self.mediaInfo.state = self.mediaInfo.state === StateMode.PLAYING ? StateMode.PAUSED : StateMode.PLAYING
      break
    }
    case Events.PREVIOUS: Spicetify.Player.back(); break
    case Events.NEXT: Spicetify.Player.next(); break
    case Events.SET_POSITION: {
      const [, positionPercentage] = data.split(':')
      // We still replace(',', '.') because v1.0.0 - v1.0.5 didn't use InvariantCulture
      Spicetify.Player.seek(parseFloat(positionPercentage.replace(',', '.')))
      break
    }
    case Events.SET_VOLUME:
      Spicetify.Player.setVolume(parseInt(data) / 100)
      self.mediaInfo.volume = parseInt(data)
      break
    case Events.TOGGLE_REPEAT: {
      Spicetify.Player.toggleRepeat()
      self.mediaInfo.repeatMode = self.mediaInfo.repeatMode === RepeatMode.NONE ? RepeatMode.ALL : self.mediaInfo.repeatMode === RepeatMode.ALL ? RepeatMode.ONE : RepeatMode.NONE
      break
    }
    case Events.TOGGLE_SHUFFLE: {
      Spicetify.Player.toggleShuffle()
      self.mediaInfo.shuffleActive = !self.mediaInfo.shuffleActive
      break
    }
    case Events.TOGGLE_THUMBS_UP: {
      Spicetify.Player.toggleHeart()
      self.mediaInfo.rating = self.mediaInfo.rating === 5 ? 0 : 5
      break
    }
    case Events.TOGGLE_THUMBS_DOWN: break
    case Events.SET_RATING: {
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
}

function ExecuteEventRev2(self: WNPRedux, message: string) {
  enum Events {
    TRY_SET_STATE,
    TRY_SKIP_PREVIOUS,
    TRY_SKIP_NEXT,
    TRY_SET_POSITION,
    TRY_SET_VOLUME,
    TRY_TOGGLE_REPEAT_MODE,
    TRY_TOGGLE_SHUFFLE_ACTIVE,
    TRY_SET_RATING
  }

  const [type, data] = message.toUpperCase().split(' ')
  switch (Events[type as keyof typeof Events]) {
    case Events.TRY_SET_STATE: {
      data === 'PLAYING' ? Spicetify.Player.play() : Spicetify.Player.pause()
      self.mediaInfo.state = self.mediaInfo.state === StateMode.PLAYING ? StateMode.PAUSED : StateMode.PLAYING
      break
    }
    case Events.TRY_SKIP_PREVIOUS: Spicetify.Player.back(); break
    case Events.TRY_SKIP_NEXT: Spicetify.Player.next(); break
    case Events.TRY_SET_POSITION: {
      const [, positionPercentage] = data.split(':')
      Spicetify.Player.seek(parseFloat(positionPercentage))
      break
    }
    case Events.TRY_SET_VOLUME:
      Spicetify.Player.setVolume(parseInt(data) / 100)
      self.mediaInfo.volume = parseInt(data)
      break
    case Events.TRY_TOGGLE_REPEAT_MODE:
      Spicetify.Player.toggleRepeat()
      self.mediaInfo.repeatMode = self.mediaInfo.repeatMode === RepeatMode.NONE ? RepeatMode.ALL : self.mediaInfo.repeatMode === RepeatMode.ALL ? RepeatMode.ONE : RepeatMode.NONE
      break
    case Events.TRY_TOGGLE_SHUFFLE_ACTIVE:
      Spicetify.Player.toggleShuffle()
      self.mediaInfo.shuffleActive = !self.mediaInfo.shuffleActive
      break
    case Events.TRY_SET_RATING: {
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
}