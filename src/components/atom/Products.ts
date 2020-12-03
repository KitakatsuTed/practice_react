import {atom} from 'recoil';
import {Product} from '../entities'

export const productsState = atom<Product[]>({
  key: 'products',
  default: [{name: 'りんご', price: 100}, {name: 'オレンジ', price: 200}, {name: 'ぶどう', price: 300}],
})