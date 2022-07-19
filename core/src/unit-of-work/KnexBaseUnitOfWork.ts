import * as Knex from 'knex';

export abstract class KnexBaseOfUnitOfWork {
  constructor(protected context: Knex.Transaction) {}

  public async commit(): Promise<void> {
    await this.context.commit();
  }

  public async rollback(): Promise<void> {
    await this.context.rollback();
  }
}
