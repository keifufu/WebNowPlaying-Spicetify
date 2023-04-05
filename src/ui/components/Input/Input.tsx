import React from 'react'
import styles from './Input.module.scss'

type IProps = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  className?: string
}

const Input: React.FC<IProps> = (props) => {
  const [value, setValue] = React.useState(props.value)

  return (
    <input
      className={`main-dropDown-dropDown ${props.className} ${styles.input}`}
      type='text'
      value={value === '0' ? '' : value}
      placeholder={props.placeholder}
      onChange={(e) => {
        setValue(e.target.value)
        props.onChange(e.target.value)
      }}
    />
  )
}

export default Input