import React from 'react'
import { copyToClipboard } from '../../../utils/misc'
import styles from './WarningPanel.module.scss'

const Command = ({ children }: { children: string }) => (
  <div className={styles.command}>
    <p className={styles.code}>
      {children}
    </p>
    <span className={styles.copy} onClick={() => copyToClipboard(children)}>
      <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='18' viewBox='0 0 512 512' >
        {/* eslint-disable-next-line max-len */}
        <g><path fill='currentColor' d='M 161.5,-0.5 C 242.167,-0.5 322.833,-0.5 403.5,-0.5C 432.339,5.1918 452.839,21.5251 465,48.5C 467.277,54.3315 468.944,60.3315 470,66.5C 470.667,173.833 470.667,281.167 470,388.5C 463.318,401.704 453.151,405.204 439.5,399C 435.61,396.404 432.777,392.904 431,388.5C 430.667,285.5 430.333,182.5 430,79.5C 427.5,55.6667 414.333,42.5 390.5,40C 314.167,39.6667 237.833,39.3333 161.5,39C 148.296,32.3178 144.796,22.1511 151,8.5C 153.84,4.67323 157.34,1.67323 161.5,-0.5 Z'/></g>
        {/* eslint-disable-next-line max-len */}
        <g><path fill='currentColor' d='M 323.5,511.5 C 251.167,511.5 178.833,511.5 106.5,511.5C 77.661,505.808 57.161,489.475 45,462.5C 42.7228,456.668 41.0561,450.668 40,444.5C 39.3333,345.5 39.3333,246.5 40,147.5C 47.5,110.667 69.6667,88.5 106.5,81C 178.833,80.3333 251.167,80.3333 323.5,81C 360,88.8333 382.167,111 390,147.5C 390.667,246.5 390.667,345.5 390,444.5C 384.649,473.519 368.482,494.019 341.5,506C 335.469,508.168 329.469,510.001 323.5,511.5 Z M 119.5,120.5 C 183.168,120.333 246.834,120.5 310.5,121C 334.333,123.5 347.5,136.667 350,160.5C 350.667,250.833 350.667,341.167 350,431.5C 347.5,455.333 334.333,468.5 310.5,471C 246.833,471.667 183.167,471.667 119.5,471C 95.6667,468.5 82.5,455.333 80,431.5C 79.3333,341.167 79.3333,250.833 80,160.5C 82.6776,136.656 95.8443,123.323 119.5,120.5 Z'/></g>
      </svg>
    </span>
  </div>
)

const WarningPanel = () => (
  <div className='backdrop'>
    <div className={styles.main}>
      <h1>Warning</h1>
      <p>You have both WebNowPlaying-Redux and webnowplaying.js installed.</p>
      <br />
      <p>Run the following commands to uninstall:</p>
      <Command>spicetify config extensions webnowplaying.js-</Command>
      <Command>spicetify apply</Command>
    </div>
  </div>
)

export default WarningPanel