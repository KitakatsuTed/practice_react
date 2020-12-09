import React, {useRef, useState, useReducer, useEffect} from "react";
import {BankAccount} from "../entities";
import Clock from "../lib/Clock";

enum WithdrawStatus {
  NOT_DOING = 'not_doing',
  DOING = 'doing',
  DONE = 'done'
}

interface WithdrawContext {
  status: WithdrawStatus
  process: () => void
}

function MoneyInput({withdrawProcess}: {withdrawProcess: (withdrawMoney: number) => boolean}) {
  const [inputMoney, setInputMoney] = useState<number>(0)

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setInputMoney(Number(e.target.value))
  }

  const onClickTransaction = (e: React
    .MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(withdrawProcess(inputMoney)) {
      return setInputMoney(0)
    }
    return
  }

  return(
    <div>
      <input type="number" onChange={updateInput} value={inputMoney}/>
      <button onClick={onClickTransaction}>引き出す</button>
    </div>
  )
}

export default function Bank({clockRef}: {clockRef: React.MutableRefObject<Clock>}) {
  const bankMoneyAmount: React.MutableRefObject<number> = useRef<number>(5000)
  const [errors, setErrors] = useState<string[]>([])
  const walletRef: React.MutableRefObject<number> = useRef<number>(1000)
  const [bankAccount, setBankAccount] = useState<BankAccount>({amount: walletRef.current})

  // ここbankAccountの状態に依存しているから引き剥がしたい
  function transactionMoney(withdrawMoney: number) {
    bankMoneyAmount.current -= withdrawMoney
    return setBankAccount({amount: walletRef.current += withdrawMoney})
  }

  const withdraw: (withdrawMoney: number) => boolean = (withdrawMoney: number) => {
    if (withdrawValidate(withdrawMoney)) {
      transactionMoney(withdrawMoney)
      return true
    }
    return false
  }

  const withdrawValidate = (withdrawMoney: number) => {
    let messages: string[] = []

    if (clockRef.current.isDaytime()) {
      messages = [...messages, '銀行はしまっています']
    }

    if ((bankMoneyAmount.current - withdrawMoney) < 0) {
      messages = [...messages, '限度額を超えています']
    }

    setErrors(messages)

    return messages.length === 0
  }

  function openStatusBank(): string {
    if (clockRef.current.isDaytime()) {
      return '閉店'
    }
    return '開店'
  }

  const reducer = (state: WithdrawContext, action: any) => {
    switch (action.type) {
      case WithdrawStatus.NOT_DOING:
        return({...state, status: WithdrawStatus.DOING, process: abort})
      case WithdrawStatus.DOING:
        return({...state, status: WithdrawStatus.DONE, process: abort})
      case WithdrawStatus.DONE:
        return({...state, status: WithdrawStatus.NOT_DOING, process: abort})
      default:
        throw new Error(`unknown action type: ${action.type}`)
    }
  }

  const abort = () => {
    console.log(state)
    return
  }
  const [state, dispatch] = useReducer(reducer, {status: WithdrawStatus.NOT_DOING, process: abort})

  useEffect( () => {
    const interval = setInterval( () => {
      if (state.status !== WithdrawStatus.NOT_DOING) {
        dispatch({ type: state.status })
      }
    }, 1000 * 5)

    return () => { clearInterval(interval) }
  }, [state])

  return(
    <div>
      <ul>
        {errors.map((error, index) => {
          return (
            <li key={index}>{error}</li>
          )
        })}
      </ul>
      <span>
        {openStatusBank}
      </span>
      <div>
        <span>銀行残高:{bankMoneyAmount.current}</span>
        <br/>
        <span>お財布:{bankAccount.amount}</span>
        <MoneyInput withdrawProcess={withdraw} />
      </div>
    </div>
  )
}
