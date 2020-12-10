import {Cart} from "../entities";
import React, {useEffect, useState} from 'react'
import {useRecoilState} from "recoil";
import {productsState} from "../atom/Products";

export default function CartContent({setNotifications: setNotification}: {setNotifications: any}) {
  const [productName, setProductName] = useState<string>('')
  const [cart, setCart] = useState<Cart>({products: [], amount: 0})
  const [products, setProducts] = useRecoilState(productsState);
  const [errors, setErrors] = useState<string[]>([])
  const updateProductName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setProductName(e.target.value)
  }

  const addToCart = () => {
    const findProduct = findProductFromProducts()
    let messages: string[] = []
    if (findProduct) {
      setCart({ products: [...cart.products, findProduct], amount: calcAmount() + findProduct.price })
      setProducts(products.filter(p => p.name !== productName))
      setProductName('')
      setErrors(messages)
      setNotification([{body: `${productName}をカートに加えました`}])
    } else {
      setErrors([...messages, 'その商品はありません'])
    }
  }

  const calcAmount = () => {
    if (cart.products.length > 0) {
      const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
      return cart.products.map(product => product.price).reduce(reducer)
    }
    return 0
  }

  function purchase (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setCart({ products: [], amount: 0 })
    return
  }

  const findProductFromProducts = () => {
    return products.find(p => p.name === productName)
  }

  useEffect( () => {
    const interval = setInterval( () => {
      setErrors([])
    }, 1000 * 5)

    return () => { clearInterval(interval) }
  }, [errors])

  return(
    <div>
      <ul>
        {errors.map((error, index) => {
          return (
            <li key={index}>{error}</li>
          )
        })}
      </ul>
      <span>商品入力</span>
      <input type="text" onChange={updateProductName} value={productName}/>
      <button onClick={addToCart}>カートに入れる</button>
      <div>
        <span>カート: 合計{cart.amount}円</span>
        <table>
          <thead>
          <tr>
            <th>商品</th>
            <th>価格</th>
          </tr>
          </thead>
          <tbody>
          {cart.products.map((product, index) => {
            return(<tr key={index}>
              <td>{product.name}</td>
              <td>{product.price}</td>
            </tr>)
          })}
          </tbody>
        </table>
        <div>
          <button onClick={purchase}>購入</button>
        </div>
      </div>
    </div>
  )
}