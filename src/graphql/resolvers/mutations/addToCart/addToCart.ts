import CompositionRoot from '../../../../../core/src/application-service/CompositionRoot';
import { AddToCartDTO } from '../../../../../core/src/modules/cart/use-cases/commands/AddToCartUseCase';
import { IAddToCartArgs } from '../../typings';
import { ResponseAddToCartRequestProps } from './RequestResponse';

async function addToCart(
  _: any,
  args: IAddToCartArgs,
): Promise<ResponseAddToCartRequestProps> {

  CompositionRoot.composeApplication();

  const service = CompositionRoot.getCartApplicationService();

  const cartUnitOfWorkFactory = CompositionRoot.getCartUnitOfWorkFactory();

  const logger = CompositionRoot.getLoggerManager().getLogger(
    'ProductService/AddToCart',
  );
  
  const methodName = 'handler';
  const traceId = CompositionRoot.getTraceId();

  logger.trace({methodName, traceId}, 'BEGIN');

  const dto: AddToCartDTO = {
    products: args.products,
  }

  const cartUnitOfWork = await cartUnitOfWorkFactory();
  const addToCart = service.addToCart(cartUnitOfWork);

  const result = await addToCart.execute(dto);

  if (result.isLeft()) {
    cartUnitOfWork.rollback();
    const error = result.value;
    throw error.errorValue()
  }

  logger.trace({methodName, traceId}, 'END');

  cartUnitOfWork.commit();
  return result.value.getValue();
}

export default addToCart;
