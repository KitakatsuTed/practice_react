import { Product, Shop } from "../entities";
import React, {useEffect, useState} from 'react'

export default function productInput() {
  const [product, setProduct] = useState<Product|null>()
  const [shop, setShop] = useState<Shop>({products: []})

  const updateProductName = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setProduct(product.name = e.taget.value)
  }

  const updateProductPrice = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setProduct(product.price = e.taget.value)
  }


  const addToShop = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setShop(shop.products.push(product))
    setProduct(null)
  }

  return(
    <div>
      <div>
        <input type="text" onkeyup={updateProductName}/>
        <input type="text" onkeyup={updateProductPrice}/>
        <button onClick={addToShop}>追加</button>
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
            {shop.products.map((product, index) => {
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.price}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
