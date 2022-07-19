import CompositionRoot from '../application-service/CompositionRoot';
import {ILogger} from '../common/logging/ILogger';

export type RepositoryEvent = 'afterCreate' | 'afterUpdate' | 'afterDestroy';

export type HookHandler<T> = (attributes: T) => Promise<void>;

export abstract class BaseRepository<T> {
  protected logger: ILogger;
  protected hooks: {[key: string]: HookHandler<T>[]};

  constructor(name: string) {
    this.logger = CompositionRoot.getLoggerManager().getLogger(name);
    this.hooks = {
      afterCreate: [],
      afterUpdate: [],
      afterDestroy: [],
    };
  }

  protected async afterCreate(attributes: T): Promise<void> {
    const methodName = `afterCreate`;
    const traceId = CompositionRoot.getTraceId();
    this.logger.trace({methodName, traceId}, `BEGIN`);

    this.logger.debug({methodName, traceId, args: {attributes}});

    const event: RepositoryEvent = 'afterCreate';

    await this.triggerHooks(event, attributes);

    this.logger.trace({methodName, traceId}, `END`);
  }

  protected async afterUpdate(attributes: T): Promise<void> {
    const methodName = `afterUpdate`;
    const traceId = CompositionRoot.getTraceId();
    this.logger.trace({methodName, traceId}, `BEGIN`);

    this.logger.debug({methodName, traceId, args: {attributes}});

    const event: RepositoryEvent = 'afterUpdate';
    await this.triggerHooks(event, attributes);

    this.logger.trace({methodName, traceId}, `END`);
  }

  protected async afterDestroy(attributes: T): Promise<void> {
    const methodName = `afterDestroy`;
    const traceId = CompositionRoot.getTraceId();
    this.logger.trace({methodName, traceId}, `BEGIN`);

    this.logger.debug({methodName, traceId, args: {attributes}});

    const event: RepositoryEvent = 'afterDestroy';
    await this.triggerHooks(event, attributes);

    this.logger.trace({methodName, traceId}, `END`);
  }

  private async triggerHooks(
    event: RepositoryEvent,
    attributes: T,
  ): Promise<void> {
    const hooks = this.hooks[event];

    await Promise.all(hooks.map((hook) => hook(attributes)));
  }

  public addHook(event: RepositoryEvent, handler: HookHandler<T>): void {
    this.hooks[event].push(handler);
  }
}
