import React, {useEffect, useRef, useState} from "react";

export default function CurrentTime({timeRef}: {timeRef: React.MutableRefObject<number>}) {
  const [time, setTime] = useState<number>(0)

  function clockUp(timeRef: React.MutableRefObject<number>): React.MutableRefObject<number> {
    if (timeRef.current >= 23) {
      timeRef.current = 0
      return timeRef
    }

    timeRef.current += 1
    return timeRef
  }

  function getTimeStr(hourNum: number): string {
    if (hourNum < 12) {
      return `AM ${hourNum}:00`
    }
    return `PM ${hourNum - 12}:00`
  }

  useEffect( () => {
      const interval = setInterval( () => {
        return setTime(clockUp(timeRef).current)
      }, 1000)

      return () => { clearInterval(interval) }
    }, [time]
  )

  return(
    <div>
      現時刻：{getTimeStr(timeRef.current)}
    </div>
  )
}