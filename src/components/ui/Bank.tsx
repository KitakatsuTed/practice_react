import React, {useRef, useState, useReducer, useEffect} from "react";
import {BankAccount} from "../entities";
import Clock from "../lib/Clock";

enum WithdrawStatus {
  READY = 'ready',
  DOING = 'doing',
  DONE = 'done'
}

interface WithdrawContext {
  status: WithdrawStatus
  withdrawMoney: number
}

interface dispatchContext {
  type: WithdrawStatus
  transactionMoney: number
}

function MoneyInput({withdrawProcess}: {withdrawProcess: (withdrawMoney: number) => boolean}) {
  const [inputMoney, setInputMoney] = useState<number>(0)

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setInputMoney(Number(e.target.value))
  }

  const onClickTransaction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(withdrawProcess(inputMoney)) {
      return setInputMoney(0)
    }
    return
  }

  return(
    <div>
      <input type="number" step="100" onChange={updateInput} value={inputMoney}/>円
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
      dispatch({type: withdrawState.status, transactionMoney: withdrawMoney})
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

    if (withdrawState.status !== WithdrawStatus.READY) {
      messages = [...messages, '引き出し処理が終わるまでお待ちください']
    }

    setErrors(messages)

    return messages.length === 0
  }

  const processStatus = () => {
    if (withdrawState.status === WithdrawStatus.READY) {
      return '引き出し可能'
    }
    if (withdrawState.status === WithdrawStatus.DOING) {
      return `${withdrawState.withdrawMoney}円を引き出し中...`
    }
    if (withdrawState.status === WithdrawStatus.DONE) {
      return '引き出し完了/再開準備中...'
    }
  }

  const reducer = (state: WithdrawContext, action: dispatchContext) => {
    switch (action.type) {
      case WithdrawStatus.READY:
        return({...state, status: WithdrawStatus.DOING, withdrawMoney: action.transactionMoney})
      case WithdrawStatus.DOING:
        return({...state, status: WithdrawStatus.DONE, withdrawMoney: action.transactionMoney})
      case WithdrawStatus.DONE:
        return({...state, status: WithdrawStatus.READY, withdrawMoney: 0})
      default:
        throw new Error(`unknown action type: ${action.type}`)
    }
  }

  const [withdrawState, dispatch] = useReducer(reducer, {status: WithdrawStatus.READY, withdrawMoney: 0})

  useEffect( () => {
    if (withdrawState.status === WithdrawStatus.DONE) {
      transactionMoney(withdrawState.withdrawMoney)
    }
    const interval = setInterval( () => {
      if (withdrawState.status !== WithdrawStatus.READY) {
        dispatch({ type: withdrawState.status, transactionMoney: withdrawState.withdrawMoney })
      }
    }, 1000 * 3)

    return () => { clearInterval(interval) }
  }, [withdrawState])

  return(
    <div>
      <ul>
        {errors.map((error, index) => {
          return (
            <li key={index}>{error}</li>
          )
        })}
      </ul>
      <div>
        <span>銀行残高:{bankMoneyAmount.current}</span>
        <br/>
        <span>お財布:{bankAccount.amount}</span>
        <br/>
        <span>{processStatus()}</span>
        <MoneyInput withdrawProcess={withdraw} />
      </div>
    </div>
  )
}
