import { Product } from "../entities";
import React, {useEffect, useState} from 'react'
import {useRecoilState} from "recoil";
import {productsState} from "../atom/Products";

export default function ProductInput({setNotifications: setNotifications}: {setNotifications: any}) {
  const [products, setProducts] = useRecoilState(productsState);
  const [product, setProduct] = useState<Product>({name: '', price: 0})
  // このstateは他でも同じような使われ方＋管理のされ方のなのでコンポーネントとして共通化の余地ありというかしたい
  const [errors, setErrors] = useState<string[]>([])
  const [amount, setAmount] = useState<number>(0)

  const updateProductName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setProduct({...product, name: e.target.value})
  }

  const updateProductPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setProduct({...product, price: Number(e.target.value)})
  }

  const addToList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setErrors([])
    if(validateProduct()){
      setProducts([...products, product])
      setNotifications([{body: `${product.name}を商品リストに加えました`}])
      resetProduct()
    }
  }

  const calcPrices = () => {
    if (products.length === 0 ) {
      setAmount(0)
    } else {
      const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
      setAmount(products.map(product => product.price).reduce(reducer))
    }
  }

  const resetProducts = () => {
    setProducts([])
    setNotifications([{body: '全ての商品をリストから削除しました'}])
    resetProduct()
  }

  const validateProduct = () => {
    let messages: string[] = []

    if(product.name.length === 0) {
      messages = [...messages, '商品名を入力してください']
    }

    if(product.price === 0 && product.name.length != 0) {
      messages = [...messages, '商品に値段をつけてください']
    }

    if(product.price > 1000) {
      messages = [...messages, 'それは高すぎます']
    }

    if(duplicate(product)) {
      messages = [...messages, '同名の商品はすでにあります']
    }

    setErrors(messages)

    return messages.length === 0
  }

  const resetProduct = () => {
    setProduct({name: '', price: 0})
  }

  const duplicate = (item: Product) => {
    return products.map(product => product.name).includes(item.name)
  }

  useEffect(() => {
    calcPrices()
  }, [products])

  useEffect( () => {
    const interval = setInterval( () => {
      setErrors([])
    }, 1000 * 5)

    return () => { clearInterval(interval) }
  }, [errors])

  return(
    <div>
      <div>
        <ul>
          {errors.map((error, index) => {
            return (
              <li key={index}>{error}</li>
            )
            })}
        </ul>
        <input type="text" onChange={updateProductName} value={product.name}/>
        <input type="number" onChange={updateProductPrice} value={product.price}/>
        <button onClick={addToList}>追加</button>
        <button onClick={resetProducts}>リセット</button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>商品</th>
              <th>価格</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                合計: {amount}
              </td>
            </tr>
            {products.map((product, index) => {
              return(<tr key={index}>
                <td>{product.name}</td>
                <td>{product.price}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
