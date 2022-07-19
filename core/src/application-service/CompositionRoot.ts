import {asFunction, asValue, AwilixContainer, createContainer} from 'awilix';
import {InjectionToken} from '../common/Constants';
import {ProductListUseCase} from '../modules/product/use-cases/queries/ProductListUseCase/UseCase';
import {ILoggerManager} from '../common/logging/ILoggerManager';
import {PinoLoggerManager} from '../common/logging/PinoLoggerManager';
import {createNamespace, Namespace} from 'cls-hooked';
import {IProductQuery} from '../modules/product/queries/IProductQuery';
import {KnexProductQuery} from '../modules/product/queries/KnexProductQuery';
import Knex from 'knex';
import {ProductApplicationService} from './product/ProductApplicationService';
import {IProductApplicationService} from './product/IProductApplicationService';
import {CartUnitOfWork, CartUnitOfWorkFactory} from '../modules/cart/unit-of-work/CartUnitOfWork';
import {KnexCartRepository} from '../modules/cart/repositories/KnexCartRepository';
import {KnexCartProductRepository} from '../modules/cart/repositories/KnexCartProductRepository';
import { ICartRepository } from '../modules/cart/repositories/ICartRepository';
import { ICartProductRepository } from '../modules/cart/repositories/ICartProductRepository';
import { AddToCartUseCase } from '../modules/cart/use-cases/commands/AddToCartUseCase';
import { CartApplicationService } from './cart/CartApplicationService';
import { ICartApplicationService } from './cart/ICartApplicationService';

const NAMEPSACE = 'FITA';
const ns = createNamespace(NAMEPSACE);

let _container: AwilixContainer;

export default class CompositionRoot {
  public static composeApplication(): void {
    if (!_container) {
      _container = createContainer();
      this.composeNamespace();
      this.composeLoggingComponents();
      this.composeRepositories();
      this.composeQueries();
      this.composeUseCases();
      this.composeProductApplicationService();
      this.composeCartApplicationService();
      this.composeKnexClient();
      this.composeUnitOfWorkFactories();
    }
  }

  // COMPOSER
  private static composeNamespace(): void {
    _container.register<Namespace>(
      InjectionToken.Namespace,
      asFunction(() => {
        return ns;
      }),
    );
  }

  private static composeLoggingComponents(): void {
    const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';
    _container.register<string>(InjectionToken.LogLevel, asValue(logLevel));

    _container.register<ILoggerManager>(
      InjectionToken.LoggerManager,
      asFunction(() => {
        PinoLoggerManager.setLogLevel(logLevel);
        return PinoLoggerManager;
      }).singleton(),
    );
  }


  private static composeRepositories(): void {
    _container.register<ICartRepository>(
      InjectionToken.CartRepository,
      asFunction(() => {
        const client = _container.resolve<Knex>(InjectionToken.KnexClient);
        return new KnexCartRepository(client);
      }).singleton(),
    );

    _container.register<ICartProductRepository>(
      InjectionToken.CartProductRepository,
      asFunction(() => {
        const client = _container.resolve<Knex>(InjectionToken.KnexClient);
        return new KnexCartProductRepository(client);
      }).singleton(),
    );
  }

  private static composeQueries(): void {
    _container.register<IProductQuery>(
      InjectionToken.ProductQuery,
      asFunction(() => {
        const client = _container.resolve<Knex>(InjectionToken.KnexClient);
        return new KnexProductQuery(client);
      }).singleton(),
    );
  }

  private static composeUseCases(): void {
    // Product Queries
    _container.register<ProductListUseCase>(
      InjectionToken.ProductListUseCase,
      asFunction(() => {
        const productQuery = _container.resolve<IProductQuery>(
          InjectionToken.ProductQuery,
        );

        return new ProductListUseCase(productQuery);
      }).singleton(),
    );

    // Cart Commands
    _container.register<typeof AddToCartUseCase>(
      InjectionToken.AddToCartUseCase,
      asFunction(() => AddToCartUseCase),
    );
  }

  private static composeProductApplicationService(): void {
    _container.register(
      InjectionToken.ProductApplicationService,
      asFunction(() => {
        return new ProductApplicationService({
          productList: _container.resolve<ProductListUseCase>(
            InjectionToken.ProductListUseCase,
          ),
        });
      }),
    );
  }

  private static composeCartApplicationService(): void {
    _container.register(
      InjectionToken.CartApplicationService,
      asFunction(() => {
        return new CartApplicationService({
          addToCart: _container.resolve<typeof AddToCartUseCase>(
            InjectionToken.AddToCartUseCase,
          ),
        });
      }),
    );
  }

  private static composeKnexClient(): void {
    const mysqlHost = process.env.DB_HOST || '127.0.0.1';
    const mysqlPort = process.env.DB_PORT
      ? parseInt(process.env.DB_PORT!)
      : 3306;
    const mysqlDatabase = process.env.DB_NAME || 'myshop';
    const mysqlUser = process.env.DB_USERNAME || 'root';
    const mysqlPassword = process.env.DB_PASSWORD || 'root';

    const maxConnection = process.env.MAX_CONNECTION_POOL
      ? parseInt(process.env.MAX_CONNECTION_POOL!)
      : 50;
    const minConnection = process.env.MIN_CONNECTION_POOL
      ? parseInt(process.env.MIN_CONNECTION_POOL!)
      : 5;

    _container.register<string | undefined>(
      InjectionToken.MySQLHost,
      asValue(mysqlHost),
    );

    _container.register<number>(InjectionToken.MySQLPort, asValue(mysqlPort));

    _container.register<string | undefined>(
      InjectionToken.MySQLDatabase,
      asValue(mysqlDatabase),
    );

    _container.register<string | undefined>(
      InjectionToken.MySQLUser,
      asValue(mysqlUser),
    );

    _container.register<string | undefined>(
      InjectionToken.MySQLPassword,
      asValue(mysqlPassword),
    );

    _container.register<number>(
      InjectionToken.MinConnectionPool,
      asValue(minConnection),
    );

    _container.register<number>(
      InjectionToken.MaxConnectionPool,
      asValue(maxConnection),
    );

    _container.register<Knex>(
      InjectionToken.KnexClient,
      asFunction(() => {
        const host = _container.resolve<string>(InjectionToken.MySQLHost);
        const port = _container.resolve<number>(InjectionToken.MySQLPort);
        const database = _container.resolve<string>(
          InjectionToken.MySQLDatabase,
        );
        const user = _container.resolve<string>(InjectionToken.MySQLUser);
        const password = _container.resolve<string>(
          InjectionToken.MySQLPassword,
        );

        const minConnection = _container.resolve<number>(
          InjectionToken.MinConnectionPool,
        );
        const maxConnection = _container.resolve<number>(
          InjectionToken.MaxConnectionPool,
        );

        return Knex({
          client: 'mysql2',
          connection: {
            host,
            port,
            database,
            user,
            password,
          },
          pool: {
            min: minConnection,
            max: maxConnection,
            acquireTimeoutMillis: 2 * 1000, // 2 seconds
          },
        });
      })
        .singleton()
        .disposer(async (knex) => {
          await knex.destroy();
        }),
    );
  }

  private static composeUnitOfWorkFactories() {
    // Cart
    _container.register<CartUnitOfWorkFactory>(
      InjectionToken.CartUnitOfWorkFactory,
      asFunction(() => async () => {
        const client = _container.resolve<Knex>(InjectionToken.KnexClient);

        const trx = await client.transaction();

        const cartRepository = new KnexCartRepository(trx);
        const cartProductRepository = new KnexCartProductRepository(trx);
        const productQuery = _container.resolve<IProductQuery>(
          InjectionToken.ProductQuery,
        );

        return new CartUnitOfWork(
          trx,
          cartRepository,
          cartProductRepository,
          productQuery,
        );
      }),
    );
  }


// GETTER
  public static getLoggerManager(): ILoggerManager {
    return _container.resolve<ILoggerManager>(InjectionToken.LoggerManager);
  }

  public static getApplicationNamespace(): Namespace {
    return _container.resolve<Namespace>(InjectionToken.Namespace);
  }

  public static getTraceId(): string {
    return this.getApplicationNamespace().get('traceId');
  }

  public static getProductApplicationService(): IProductApplicationService {
    return _container.resolve<IProductApplicationService>(
      InjectionToken.ProductApplicationService,
    );
  }

  public static getCartApplicationService(): ICartApplicationService {
    return _container.resolve<ICartApplicationService>(
      InjectionToken.CartApplicationService,
    );
  }

  public static getCartUnitOfWorkFactory(): CartUnitOfWorkFactory {
    return _container.resolve<CartUnitOfWorkFactory>(
      InjectionToken.CartUnitOfWorkFactory,
    );
  }
}