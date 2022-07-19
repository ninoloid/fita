import Knex from 'knex';
import CompositionRoot from '../../../application-service/CompositionRoot';
import {UniqueEntityId} from '../../../domain/UniqueEntityId';
import {TableName} from '../../../common/Constants';
import {KnexBaseQuery} from '../../../query/KnexBaseQuery';
import {ProductListVM} from '../vms/ProductListVM';
import {
  IProductQuery,
} from './IProductQuery';
import {MysqlProductVMProps} from './MysqlProductVMProps';

export class KnexProductQuery
  extends KnexBaseQuery<MysqlProductVMProps>
  implements IProductQuery
{
  constructor(client: Knex) {
    super(client, TableName.PRODUCT, 'KnexPromoQuery');
  }

  async retrieveProductList(): Promise<ProductListVM[]> {
    const methodName = `retrieveProductList`;
    const traceId = CompositionRoot.getTraceId();

    this.logger.trace({methodName, traceId}, `BEGIN`);

    const query = this.client(this.tableName)
      .select(
        `${this.tableName}.id as id`,

        `${this.tableName}.sku as sku`,
        `${this.tableName}.name as name`,
        `${this.tableName}.price as price`,
        `${this.tableName}.quantity as quantity`,
      );

    this.logger.debug({
      methodName,
      traceId,
      query: query.toQuery(),
    });

    const productList: ProductListVM[] = [];

    const resultProduct: {
      id: string;

      sku: string;
      name: string;
      price: string;
      quantity: string;
    }[] = await query;

    if (resultProduct.length > 0) {
      for (const product of resultProduct) {
        const productOrError = ProductListVM.create({
          id: new UniqueEntityId(product.id),

          sku: product.sku,
          name: product.name,
          price: Number(product.price),
          quantity: Number(product.quantity),
        });

        if (productOrError.isFailure) {
          throw productOrError.errorValue();
        }

        productList.push(productOrError.getValue());
      }
    }

    this.logger.trace({methodName, traceId}, `END`);

    return productList;
  }

  async retrieveProductById(productId: UniqueEntityId): Promise<ProductListVM | undefined> {
    const methodName = `retrieveProductById`;
    const traceId = CompositionRoot.getTraceId();

    this.logger.trace({methodName, traceId}, `BEGIN`);

    const query = this.client(this.tableName)
      .select(
        `${this.tableName}.id as id`,

        `${this.tableName}.sku as sku`,
        `${this.tableName}.name as name`,
        `${this.tableName}.price as price`,
        `${this.tableName}.quantity as quantity`,
      )
      .where(`${this.tableName}.id`, productId.toString())
      .first();

    this.logger.debug({
      methodName,
      traceId,
      query: query.toQuery(),
    });

    let product: ProductListVM | undefined;

    const resultProduct: {
      id: string;

      sku: string;
      name: string;
      price: string;
      quantity: string;
    } = await query;

    const productOrError = ProductListVM.create({
      id: new UniqueEntityId(resultProduct.id),

      sku: resultProduct.sku,
      name: resultProduct.name,
      price: Number(resultProduct.price),
      quantity: Number(resultProduct.quantity),
    });

    if (productOrError.isFailure) {
      throw productOrError.errorValue();
    }
    
    product = productOrError.getValue();

    this.logger.trace({methodName, traceId}, `END`);

    return product;
  }
}
