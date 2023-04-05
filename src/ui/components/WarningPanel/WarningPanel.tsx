import React from 'react'
import styles from './WarningPanel.module.scss'

const WarningPanel = () => (
  <div className='backdrop'>
    <div className={styles.main}>
      <h1>Warning</h1>
      <p>You have both WebNowPlaying-Redux and webnowplaying.js installed.</p>
      <br />
      <p>Run the following commands to uninstall:</p>
      <p className={styles.code}>spicetify config extensions webnowplaying.js-</p>
      <p className={styles.code}>spicetify apply</p>
    </div>
  </div>
)

export default WarningPanel