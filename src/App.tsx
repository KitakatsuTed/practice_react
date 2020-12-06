import './App.css';
import ProductInput from "./components/ui/ProductInput";
import CartContent from "./components/ui/CartContent";
import React, {useEffect, useState} from 'react'
import Notifications from "./components/ui/Notifications";
import { Notification } from "./components/entities";
import Bank from "./components/ui/Bank";

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect( () => {
    const interval = setInterval(() => {
      setNotifications([])
    }, 1000 * 5)

    return () => { clearInterval(interval) }
  } , [notifications])

  return (
    <div className="App">
      <div className="notifications">
        <Notifications notifications={notifications} />
      </div>
      <div>
        <ProductInput setNotifications={setNotifications} />
        <CartContent setNotifications={setNotifications} />
      </div>
      <Bank />
    </div>
  );
}

export default App;
