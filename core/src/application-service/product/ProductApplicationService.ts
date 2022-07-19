import {
  ProductListDTO,
  ProductListResponse,
  ProductListUseCase
} from '../../modules/product/use-cases/queries/ProductListUseCase';
import {IProductApplicationService} from './IProductApplicationService';

export interface ProductApplicationUseCase {
  // Product Queries
  productList: ProductListUseCase;
}

export class ProductApplicationService implements IProductApplicationService {
  constructor(protected useCases: ProductApplicationUseCase) {}

  // Product Queries
  productList(dto: ProductListDTO): Promise<ProductListResponse> {
    return this.useCases.productList.execute(dto)
  }
}
