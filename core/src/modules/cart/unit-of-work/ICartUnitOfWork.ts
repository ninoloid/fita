import {IProductQuery} from '../../product/queries/IProductQuery';
import {ICartProductRepository} from '../repositories/ICartProductRepository';
import {ICartRepository} from '../repositories/ICartRepository';

export interface ICartUnitOfWork {
  readonly cartRepository: ICartRepository;
  readonly cartProductRepository: ICartProductRepository;
  readonly productQuery: IProductQuery;
}
