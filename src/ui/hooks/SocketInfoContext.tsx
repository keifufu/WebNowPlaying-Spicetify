import React from 'react'
import { getWNPRedux } from '../../app'
import { SocketInfoMap } from '../../utils/settings'

const SocketInfoContext = React.createContext<{ socketInfo: SocketInfoMap }>({ socketInfo: new Map() })

export const SocketInfoProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [socketInfo, setSocketInfo] = React.useState(new Map())

  React.useEffect(() => {
    const update = () => setSocketInfo(getWNPRedux().getSocketInfo())
    update()
    const interval = setInterval(update, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <SocketInfoContext.Provider value={{ socketInfo }}>
      {props.children}
    </SocketInfoContext.Provider>
  )
}

export const useSocketInfo = () => React.useContext(SocketInfoContext)