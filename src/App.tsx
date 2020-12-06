import './App.css';
import ProductInput from "./components/ui/ProductInput";
import CartContent from "./components/ui/CartContent";
import React, {useEffect, useRef, useState} from 'react'
import Notifications from "./components/ui/Notifications";
import { Notification } from "./components/entities";
import Bank from "./components/ui/Bank";
import CurrentTime from "./components/ui/CurrentTime";

function App() {
  interface Clock {
    hour: number

  }

  const [notifications, setNotifications] = useState<Notification[]>([])
  const timeRef: React.MutableRefObject<number> = useRef(0)

  return (
    <div className="App">
      <div className="notifications">
        <Notifications notifications={notifications} setNotifications={setNotifications} />
      </div>
      <div>
        <CurrentTime timeRef={timeRef}/>
      </div>
      <div>
        <ProductInput setNotifications={setNotifications} />
        <CartContent setNotifications={setNotifications} />
      </div>
      <Bank timeRef={timeRef}/>
    </div>
  );
}

export default App;
