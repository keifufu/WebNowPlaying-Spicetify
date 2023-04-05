import React from 'react'

type IProps = {
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  color?: string
}

const Toggle: React.FC<IProps> = (props) => (
  <label className='x-toggle-wrapper x-settings-secondColumn'>
    <input
      disabled={props.disabled}
      className='x-toggle-input'
      type='checkbox'
      checked={props.checked}
      onChange={(e) => props.onChange(e.target.checked)}
    />
    <span className='x-toggle-indicatorWrapper' style={{ backgroundColor: props.color, cursor: props.disabled ? 'default' : 'pointer' }}>
      <span className='x-toggle-indicator'></span>
    </span>
  </label>
)

export default Toggle