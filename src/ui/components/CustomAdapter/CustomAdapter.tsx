import React from 'react'
import { getWNPRedux } from '../../../app'
import { BuiltInAdapters, SocketInfo, CustomAdapter as TCustomAdapter } from '../../../utils/settings'
import { useSettings } from '../../hooks/SettingsContext'
import Button from '../Button'
import Input from '../Input'
import Toggle from '../Toggle'
import styles from './CustomAdapter.module.scss'

const CustomAdapter: React.FC<{ adapter: TCustomAdapter, info: SocketInfo }> = (props) => {
  const { settings, toggleAdapter, updateCustomAdapter, removeCustomAdapter } = useSettings()
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [toggleDisabled, setToggleDisabled] = React.useState(false)
  const timeoutRef = React.useRef<number>()

  const remove = () => {
    if (confirmDelete) {
      removeCustomAdapter(props.adapter.id)
      getWNPRedux().disconnectSocket(props.adapter.port)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2000)
    }
  }

  return (
    <div className={styles.adapter}>
      <Toggle
        color={props.info.isConnected ? 'lime' : props.info.isConnecting ? 'orange' : 'tomato'}
        checked={props.adapter.enabled}
        disabled={toggleDisabled}
        onChange={() => {
          if (props.adapter.enabled) getWNPRedux().disconnectSocket(props.adapter.port)
          else getWNPRedux().connectSocket(props.adapter.port)
          toggleAdapter(props.adapter.port)
          setToggleDisabled(true)
          setTimeout(() => setToggleDisabled(false), 250)
        }}
      />
      <div className={styles.name}>Custom adapter</div>
      <Input
        className={styles.input}
        value={props.adapter.port.toString()}
        placeholder='Port'
        onChange={(value) => {
          const port = parseInt(value || '0')
          if (isNaN(port)) return
          // Checks if the port is valid
          try {
            // eslint-disable-next-line no-new
            new URL(`ws://localhost:${port}`)
          } catch {
            return
          }
          if (BuiltInAdapters.some((e) => e.port === port)) return false
          if (settings.customAdapters.some((e) => e.port === port && e.id !== props.adapter.id)) return false
          getWNPRedux().disconnectSocket(props.adapter.port)
          updateCustomAdapter(props.adapter.id, port)
          clearTimeout(timeoutRef.current)
          if (port !== 0) timeoutRef.current = setTimeout(() => getWNPRedux().connectSocket(port), 250)
        }}
      />
      <Button small className={styles.button} onClick={remove}>
        {confirmDelete ? 'Confirm' : 'Remove'}
      </Button>
    </div>
  )
}

export default CustomAdapter