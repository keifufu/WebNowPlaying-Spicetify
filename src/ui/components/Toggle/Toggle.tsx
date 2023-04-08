import React from 'react'

type IProps = {
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  color?: string
}

const Toggle: React.FC<IProps> = (props) => {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (!ref.current) return
    if (props.color) ref.current.style.setProperty('background-color', props.color, 'important')
    else ref.current.style.removeProperty('background-color')
  }, [props.color])

  return (
    <label className='x-toggle-wrapper x-settings-secondColumn'>
      <input
        disabled={props.disabled}
        className='x-toggle-input'
        type='checkbox'
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      />
      <span ref={ref} className='x-toggle-indicatorWrapper' style={{ cursor: props.disabled ? 'default' : 'pointer' }}>
        <span className='x-toggle-indicator'></span>
      </span>
    </label>
  )
}

export default Toggle