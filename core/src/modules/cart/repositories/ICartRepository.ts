import {Cart} from '../domains/Cart';

export interface ICartRepository {
  create(cart: Cart): Promise<void>;
}
