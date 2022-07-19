import Knex from 'knex';
import {BaseRepository} from './BaseRepository';

export class KnexBaseRepository<TRecord> extends BaseRepository<TRecord> {
  constructor(
    protected client: Knex<TRecord, TRecord[]>,
    protected tableName: string,
    protected name: string = 'KnexBaseRepository',
  ) {
    super(name);
  }
}
