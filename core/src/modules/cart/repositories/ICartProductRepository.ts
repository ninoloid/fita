import {CartProduct} from '../domains/CartProduct';

export interface ICartProductRepository {
  create(cartProduct: CartProduct): Promise<void>;
  bulkCreate(cartProducts: CartProduct[]): Promise<void>;
}
