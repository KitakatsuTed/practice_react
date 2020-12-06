import { Notification } from "../entities";
import {Dispatch, SetStateAction, useEffect} from "react";

export default function Notifications({notifications, setNotifications}: {notifications: Notification[], setNotifications: Dispatch<SetStateAction<Notification[]>>}) {

  useEffect( () => {
    const interval = setInterval(() => {
      setNotifications([])
    }, 1000 * 5)

    return () => { clearInterval(interval) }
  } , [notifications])


  return (
    <div>
      {
        notifications.map((notificatoin, index) => {
          return <div key={index}>{notificatoin.body}</div>
        })
      }
    </div>
  )
}
