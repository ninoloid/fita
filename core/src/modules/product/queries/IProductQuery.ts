import {UniqueEntityId} from '../../../domain/UniqueEntityId';
import {ProductListVM} from '../vms/ProductListVM';


export interface IProductQuery {
  retrieveProductList(): Promise<ProductListVM[]>;
  retrieveProductById(
    productId: UniqueEntityId,
  ): Promise<ProductListVM | undefined>;
}
