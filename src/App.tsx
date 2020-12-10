import './App.css';
import ProductInput from "./components/ui/ProductInput";
import CartContent from "./components/ui/CartContent";
import React, {useRef, useState} from 'react'
import Notifications from "./components/ui/Notifications";
import { Notification } from "./components/entities";
import Bank from "./components/ui/Bank";
import CurrentTime from "./components/ui/CurrentTime";
import Clock from "./components/lib/Clock";

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const clockRef: React.MutableRefObject<Clock> = useRef(Clock.Instance)
  const [wallet, setWallet] = useState<number>(1000)

  return (
    <div className="App">
      <div className="notifications">
        <Notifications notifications={notifications} setNotifications={setNotifications} />
      </div>
      <div>
        <CurrentTime clockRef={clockRef}/>
      </div>
      <div>
        <ProductInput setNotifications={setNotifications} />
        <CartContent setNotifications={setNotifications} wallet={wallet} setWallet={setWallet} />
      </div>
      <Bank clockRef={clockRef} wallet={wallet} setWallet={setWallet}/>
    </div>
  );
}

export default App;
