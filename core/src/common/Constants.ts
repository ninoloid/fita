export const InjectionToken = {
  Namespace: 'NAMESPACE',
  LoggerManager: 'LOGGER_MANAGER',
  LogLevel: 'LOG_LEVEL',
  DefaultRegion: 'DEFAULT_REGION',
  NodeEnv: 'NODE_ENV',

  // KNEX
  KnexClient: 'KNEX_CLIENT',
  MySQLDatabase: 'MYSQL_DATABASE',
  MySQLHost: 'MYSQL_HOST',
  MySQLPassword: 'MYSQL_PASSWORD',
  MySQLPort: 'MYSQL_PORT',
  MySQLUser: 'MYSQL_USER',
  MaxConnectionPool: 'MAX_CONNECTION_POOL',
  MinConnectionPool: 'MIN_CONNECTION_POOL',

  // QUERIES
  ProductQuery: 'PRODUCT_QUERY',

  // APPLICATION SERVICES
  ProductApplicationService: 'PRODUCT_APPLICATION_SERVICE',
  CartApplicationService: 'CART_APPLICATION_SERVICE',

  // USE CASES
  ProductListUseCase: 'PRODUCT_LIST_USE_CASE',
  AddToCartUseCase: 'ADD_TO_CART_USE_CASE',

  // UNIT OF WORK
  CartUnitOfWorkFactory: 'CART_UNIT_OF_WORK_FACTORY',

  // REPOSITORY
  CartRepository: 'CART_REPOSITORY',
  CartProductRepository: 'CART_PRODUCT_REPOSITORY',
}

export const TableName = {
  PRODUCT: 'products',
  CART: 'carts',
  CART_PRODUCT: 'cart_products',
}
