import {ICartUnitOfWork} from '../../modules/cart/unit-of-work/ICartUnitOfWork';
import {AddToCartUseCase} from '../../modules/cart/use-cases/commands/AddToCartUseCase';
import {ICartApplicationService} from './ICartApplicationService';

export interface CartApplicationUseCase {
  // Cart Commands
  addToCart: typeof AddToCartUseCase;
}

export class CartApplicationService implements ICartApplicationService {
  constructor(protected useCases: CartApplicationUseCase) {}

  // Cart Commands
  addToCart(cartUnitOfWork: ICartUnitOfWork): AddToCartUseCase {
    const addTOCartUseCase = new this.useCases.addToCart(cartUnitOfWork);
    return addTOCartUseCase;
  }
}
