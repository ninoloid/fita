import CompositionRoot from '../application-service/CompositionRoot';
import {ILogger} from '../common/logging/ILogger';

export abstract class BaseQuery {
  protected logger: ILogger;

  constructor(name: string) {
    this.logger = CompositionRoot.getLoggerManager().getLogger(name);
  }
}
