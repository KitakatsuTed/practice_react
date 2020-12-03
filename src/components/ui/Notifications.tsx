import { Notification } from "../entities";

export default function Notifications({notifications: notifications}: {notifications: Notification[]}) {
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
