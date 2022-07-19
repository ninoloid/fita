import CompositionRoot from '../../../../../core/src/application-service/CompositionRoot';
import {ResponseProductListRequestProps} from './RequestResponse';

async function getProducts(
  _: any
): Promise<ResponseProductListRequestProps> {

  CompositionRoot.composeApplication();

  const service = CompositionRoot.getProductApplicationService();

  const logger = CompositionRoot.getLoggerManager().getLogger(
    'ProductService/ProductList',
  );
  
  const methodName = 'handler';
  const traceId = CompositionRoot.getTraceId();

  logger.trace({methodName, traceId}, 'BEGIN');

  const result = await service.productList({})
  if (result.isLeft()) {
    const error = result.value;
    throw error.errorValue()
  }

  logger.trace({methodName, traceId}, 'END');

  return result.value.getValue();
}

export default getProducts;
