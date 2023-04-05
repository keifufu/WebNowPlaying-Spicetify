import React from 'react'
import { closeSettingsPanel } from '../..'
import { BuiltInAdapters, defaultSocketInfo } from '../../../utils/settings'
import { useSettings } from '../../hooks/SettingsContext'
import { useSocketInfo } from '../../hooks/SocketInfoContext'
import Adapter from '../Adapter'
import Button from '../Button'
import CustomAdapter from '../CustomAdapter'
import Hyperlink from '../Hyperlink'
import styles from './SettingsPanel.module.scss'

const SettingsPanel = () => {
  const { settings, addCustomAdapter } = useSettings()
  const { socketInfo } = useSocketInfo()

  return (
    <div className={styles.background + ' backdrop'} onClick={closeSettingsPanel}>
      <div className={styles.main} onClick={(e) => e.stopPropagation()}>
        <h1 className={styles.header}>WebNowPlaying-Redux</h1>
        <div className={styles.inner}>
          {BuiltInAdapters.map((adapter) => (
            <Adapter
              key={adapter.name}
              adapter={adapter}
              enabled={settings.enabledBuiltInAdapters.includes(adapter.name)}
              info={socketInfo.get(adapter.port) ?? defaultSocketInfo}
            />
          ))}
          {settings.customAdapters.map((adapter) => (
            <CustomAdapter
              key={adapter.id}
              adapter={adapter}
              info={socketInfo.get(adapter.port) ?? defaultSocketInfo}
            />
          ))}
          <div className={styles.submitAdapter}>
            Want to create or submit your own adapter? Click <Hyperlink text='here' link='https://github.com/keifufu/WebNowPlaying-Redux/blob/main/CreatingAdapters.md'/>!
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={addCustomAdapter}>add custom adapter</Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel