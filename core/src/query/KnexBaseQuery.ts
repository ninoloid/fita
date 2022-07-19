import Knex from 'knex';
import {BaseQuery} from './BaseQuery';

export class KnexBaseQuery<TRecord> extends BaseQuery {
  constructor(
    protected client: Knex<TRecord, TRecord[]>,
    protected tableName: string,
    protected name: string = 'KnexBaseQuery',
  ) {
    super(name);
  }
}
