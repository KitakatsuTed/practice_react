import React, {useRef, useState} from "react";
import {BankAccount} from "../entities";
import Clock from "../lib/Clock";

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

  // ここの戻り値の型を揃えたい。もうなんでも型を揃えたい
  const withdraw = (withdrawMoney: number) => {
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

  return(
    <div>
      <br/>
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
