import React from 'react'
import styles from './Button.module.scss'

type IProps = {
  children: React.ReactNode
  disabled?: boolean
  small?: boolean
  className?: string
  onClick: () => void
}

const Input: React.FC<IProps> = (props) => (
  <span className={props.className}>
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={styles.button + (props.small ? ` ${styles.buttonSmall}` : '')}
    >
      {props.children}
    </button>
  </span>
)

export default Input