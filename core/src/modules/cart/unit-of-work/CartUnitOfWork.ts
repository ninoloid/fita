import * as Knex from 'knex';
import {KnexBaseOfUnitOfWork} from '../../../unit-of-work/KnexBaseUnitOfWork';
import {IProductQuery} from '../../product/queries/IProductQuery';
import {ICartProductRepository} from '../repositories/ICartProductRepository';
import {ICartRepository} from '../repositories/ICartRepository';
import {ICartUnitOfWork} from './ICartUnitOfWork';

export type CartUnitOfWorkFactory = () => Promise<CartUnitOfWork>;
export class CartUnitOfWork
  extends KnexBaseOfUnitOfWork
  implements ICartUnitOfWork
{
  public constructor(
    context: Knex.Transaction,
    public readonly cartRepository: ICartRepository,
    public readonly cartProductRepository: ICartProductRepository,
    public readonly productQuery: IProductQuery,
  ) {
    super(context);
  }
}
