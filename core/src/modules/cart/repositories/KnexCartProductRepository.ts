import Knex from 'knex';
import CompositionRoot from '../../../application-service/CompositionRoot';
import {TableName} from '../../../common/Constants';
import {KnexBaseRepository} from '../../../repository/KnexBaseRepository';
import {CartProduct} from '../domains/CartProduct';
import {MysqlCartProductMapper, MysqlCartProductProps} from '../mappers/MysqlCartProductMapper';
import {ICartProductRepository} from './ICartProductRepository';

export class KnexCartProductRepository
  extends KnexBaseRepository<MysqlCartProductProps>
  implements ICartProductRepository
{
  constructor(client: Knex) {
    super(client, TableName.CART_PRODUCT, 'KnexCartProductRepository');
  }

  async create(cartProduct: CartProduct): Promise<void> {
    const methodName = `create`;
    const traceId = CompositionRoot.getTraceId();

    this.logger.trace({methodName, traceId}, `BEGIN`);

    const props = MysqlCartProductMapper.toPersistence(cartProduct);

    const query = this.client(this.tableName).insert(props);

    await query;

    this.logger.debug({methodName, traceId, query: {sql: query.toQuery()}});

    this.logger.trace({methodName, traceId}, `END`);
  }

  async bulkCreate(cartProducts: CartProduct[]): Promise<void> {
    const methodName = `bulkCreate`;
    const traceId = CompositionRoot.getTraceId();

    this.logger.trace({methodName, traceId}, `BEGIN`);

    for (const cartProduct of cartProducts) {
      const props = MysqlCartProductMapper.toPersistence(cartProduct);
  
      const query = this.client(this.tableName).insert(props);
  
      await query;
  
      this.logger.debug({methodName, traceId, query: {sql: query.toQuery()}});
    }

    this.logger.trace({methodName, traceId}, `END`);
  }
}
