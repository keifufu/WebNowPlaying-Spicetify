import React from 'react'

type IProps = {
  link: string
  text: string
  className?: string
}

const Hyperlink: React.FC<IProps> = (props) => (
  <a
    href={props.link}
    className={props.className}
    onClick={(e) => {
      e.preventDefault()
      window.open(props.link, '_blank')
    }}
  >
    {props.text}
  </a>
)

export default Hyperlink