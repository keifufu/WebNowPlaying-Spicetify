import React from 'react'
import { getWNPRedux } from '../../../app'
import { getVersionFromGithub, isVersionOutdated } from '../../../utils/misc'
import { SocketInfo, Adapter as TAdapter } from '../../../utils/settings'
import { useSettings } from '../../hooks/SettingsContext'
import Hyperlink from '../Hyperlink'
import Toggle from '../Toggle'
import styles from './Adapter.module.scss'

const AdapterAuthors: React.FC<{ adapter: TAdapter }> = (props) => (
  <div className={styles.authors}>
    {props.adapter.authors.map((author, i) => (
      <div>
        {i === 0 && (
          <span style={{ marginRight: '-0.125rem' }}>(</span>
        )}
        <Hyperlink text={author.name} link={author.link} className={styles.authorName} />
        {i !== props.adapter.authors.length - 1 && (
          <span style={{ marginLeft: '0.125rem' }}>,</span>
        )}
        {i === props.adapter.authors.length - 1 && (
          <span style={{ marginLeft: '0.125rem', marginRight: '0.5rem' }}>)</span>
        )}
      </div>
    ))}
  </div>
)

const Adapter: React.FC<{ adapter: TAdapter, enabled: boolean, info: SocketInfo }> = (props) => {
  const { toggleAdapter } = useSettings()
  const [githubVersion, setGithubVersion] = React.useState('0.0.0')
  const [toggleDisabled, setToggleDisabled] = React.useState(false)

  React.useEffect(() => {
    getVersionFromGithub(props.adapter.gh).then((version) => {
      setGithubVersion(version)
    })
  }, [])

  return (
    <div className={styles.adapter}>
      <Toggle
        color={props.info.isConnected ? 'lime' : props.info.isConnecting ? 'orange' : '#434756'}
        checked={props.enabled}
        disabled={toggleDisabled}
        onChange={() => {
          if (props.enabled) getWNPRedux().disconnectSocket(props.adapter.port)
          else getWNPRedux().connectSocket(props.adapter.port)
          toggleAdapter(props.adapter.port)
          setToggleDisabled(true)
          setTimeout(() => setToggleDisabled(false), 250)
        }}
      />
      <Hyperlink
        link={`https://github.com/${props.adapter.gh}`}
        className={styles.name}
        text={props.adapter.name}
      />
      <AdapterAuthors adapter={props.adapter} />
      {props.info.isConnected && githubVersion === 'Error' && (
        <div className={styles.version} style={{ color: 'tomato' }}>Couldn't check for updates</div>
      )}
      {props.info.isConnected && githubVersion !== 'Error' && isVersionOutdated(props.info.version, githubVersion) && props.info.version !== '0.0.0' && (
        <div className={styles.version}>
          <Hyperlink
            className={styles.updateAvailable}
            link={`https://github.com/${props.adapter.gh}/releases/latest`}
            text={'Update available'}
          />
        </div>
      )}
      {props.info.isConnected && props.info.version !== '0.0.0' && githubVersion !== 'Error' && !isVersionOutdated(props.info.version, githubVersion) && (
        <div className={styles.version} style={{ color: 'lime' }}>Up to date</div>
      )}
    </div>
  )
}

export default Adapter