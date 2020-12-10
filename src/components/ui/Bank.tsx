import React, {useRef, useState, useReducer, useEffect, SetStateAction, Dispatch} from "react";
import Clock from "../lib/Clock";

enum ProcessStatus {
  READY = 'ready',
  DOING = 'doing',
  DONE = 'done'
}

interface WithdrawContext {
  status: ProcessStatus
  withdrawMoney: number
}

interface dispatchContext {
  type: ProcessStatus
  inputMoney: number
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

export default function Bank({clockRef, wallet, setWallet}: {clockRef: React.MutableRefObject<Clock>, wallet: number, setWallet: Dispatch<SetStateAction<number>>}) {
  const bankMoneyAmount: React.MutableRefObject<number> = useRef<number>(5000)
  const [errors, setErrors] = useState<string[]>([])

  // ここbankAccountの状態に依存しているから引き剥がしたい
  function transactionMoney(withdrawMoney: number) {
    bankMoneyAmount.current -= withdrawMoney
    return setWallet(wallet += withdrawMoney)
  }

  const withdraw: (withdrawMoney: number) => boolean = (withdrawMoney: number) => {
    if (withdrawValidate(withdrawMoney)) {
      dispatch({type: withdrawContext.status, inputMoney: withdrawMoney})
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

    if (withdrawContext.status !== ProcessStatus.READY) {
      messages = [...messages, '引き出し処理が終わるまでお待ちください']
    }

    setErrors(messages)

    return messages.length === 0
  }

  const processStatus = () => {
    if (withdrawContext.status === ProcessStatus.READY) {
      return '引き出し可能'
    }
    if (withdrawContext.status === ProcessStatus.DOING) {
      return `${withdrawContext.withdrawMoney}円を引き出し中...`
    }
    if (withdrawContext.status === ProcessStatus.DONE) {
      return '引き出し完了/再開準備中...'
    }
  }

  const reducer = (state: WithdrawContext, action: dispatchContext) => {
    switch (action.type) {
      case ProcessStatus.READY:
        return({...state, status: ProcessStatus.DOING, withdrawMoney: action.inputMoney})
      case ProcessStatus.DOING:
        return({...state, status: ProcessStatus.DONE})
      case ProcessStatus.DONE:
        return({...state, status: ProcessStatus.READY, withdrawMoney: 0})
      default:
        throw new Error(`unknown action type: ${action.type}`)
    }
  }

  const [withdrawContext, dispatch] = useReducer(reducer, {status: ProcessStatus.READY, withdrawMoney: 0})

  useEffect( () => {
    if (withdrawContext.status === ProcessStatus.DONE) {
      transactionMoney(withdrawContext.withdrawMoney)
    }
    const interval = setInterval( () => {
      if (withdrawContext.status !== ProcessStatus.READY) {
        dispatch({ type: withdrawContext.status, inputMoney: withdrawContext.withdrawMoney })
      }
    }, 1000 * 3)

    return () => { clearInterval(interval) }
  }, [withdrawContext])

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
        <span>お財布:{wallet}</span>
        <br/>
        <span>{processStatus()}</span>
        <MoneyInput withdrawProcess={withdraw} />
      </div>
    </div>
  )
}
