/* global Spicetify */
import { WNPRedux } from './sockets'
import { openSettingsPanel, openWarningPanel } from './ui'
import { WebNowPlayingSVG } from './utils/misc'

let wnpRedux: WNPRedux
export const getWNPRedux = () => wnpRedux

async function main() {
  while (!Spicetify?.Platform || !Spicetify?.CosmosAsync || !Spicetify?.Player)
    await new Promise((resolve) => setTimeout(resolve, 100))

  // Show warning if old cli version is installed
  if (document.querySelector('script[src*="webnowplaying.js"]')) {
    openWarningPanel()
    return
  }


  wnpRedux = new WNPRedux()
  new Spicetify.Menu.Item(
    'WebNowPlaying',
    false,
    () => openSettingsPanel(),
    WebNowPlayingSVG
  ).register()
}

export default main