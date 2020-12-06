import React, {useEffect, useRef, useState} from "react";
import Clock from "../lib/Clock";

export default function CurrentTime({clockRef}: {clockRef: React.MutableRefObject<Clock>}) {
  const [time, setTime] = useState<number>(0)

  function clockUp(clockRef: React.MutableRefObject<Clock>): React.MutableRefObject<Clock> {
    if (clockRef.current.hour >= 23) {
      clockRef.current.hour = 0
      return clockRef
    }

    clockRef.current.hour += 1
    return clockRef
  }

  function getTimeStr(hourNum: number): string {
    if (hourNum < 12) {
      return `AM ${hourNum}:00`
    }
    return `PM ${hourNum - 12}:00`
  }

  useEffect( () => {
      const interval = setInterval( () => {
        return setTime(clockUp(clockRef).current.hour)
      }, 1000)

      return () => { clearInterval(interval) }
    }, [time]
  )

  return(
    <div>
      現時刻：{getTimeStr(clockRef.current.hour)}
    </div>
  )
}