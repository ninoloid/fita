import { ProductListDTO, ProductListResponse } from '../../modules/product/use-cases/queries/ProductListUseCase';

export interface IProductApplicationService {
  // Product Commands


  // Product Queries
  productList(dto: ProductListDTO): Promise<ProductListResponse>;
}
