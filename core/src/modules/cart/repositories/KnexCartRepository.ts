import Knex from 'knex';
import CompositionRoot from '../../../application-service/CompositionRoot';
import {TableName} from '../../../common/Constants';
import {KnexBaseRepository} from '../../../repository/KnexBaseRepository';
import {Cart} from '../domains/Cart';
import {MysqlCartMapper, MysqlCartProps} from '../mappers/MysqlCartMapper';
import {ICartRepository} from './ICartRepository';

export class KnexCartRepository
  extends KnexBaseRepository<MysqlCartProps>
  implements ICartRepository
{
  constructor(client: Knex) {
    super(client, TableName.CART, 'KnexCartRepository');
  }

  async create(cart: Cart): Promise<void> {
    const methodName = `create`;
    const traceId = CompositionRoot.getTraceId();

    this.logger.trace({methodName, traceId}, `BEGIN`);

    const props = MysqlCartMapper.toPersistence(cart);

    const query = this.client(this.tableName).insert(props);

    await query;

    this.logger.debug({methodName, traceId, query: {sql: query.toQuery()}});

    this.logger.trace({methodName, traceId}, `END`);
  }
}
