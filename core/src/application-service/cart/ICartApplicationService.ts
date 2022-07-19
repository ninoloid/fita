import {ICartUnitOfWork} from '../../modules/cart/unit-of-work/ICartUnitOfWork';
import {AddToCartUseCase} from '../../modules/cart/use-cases/commands/AddToCartUseCase';

export interface ICartApplicationService {
  // Cart Commands
  addToCart(cartUnitOfWork: ICartUnitOfWork): AddToCartUseCase;

  // Cart Queries
}
