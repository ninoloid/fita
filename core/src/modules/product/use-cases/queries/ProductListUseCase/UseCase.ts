import {object} from 'joi';
import CompositionRoot from '../../../../../application-service/CompositionRoot';
import {BaseUseCase} from '../../../../../domain/BaseUseCase';
import {ApplicationError} from '../../../../../errors/ApplicationError';
import {Guard} from '../../../../../logic/Guard';
import {Either, left, Result, right} from '../../../../../logic/Result';
import {IProductQuery} from '../../../queries/IProductQuery';
import {
  JSONProductListVM,
  ProductListVM,
} from '../../../vms/ProductListVM';
import {ProductListDTO} from './DTO';
import {ProductListErrors} from './Errors';

type Response = Either<
  | ApplicationError.UnexpectedError
  | ApplicationError.ValidationError
  | ProductListErrors.InvalidRoleAccess,
  Result<ProductListUseCaseResponse>
>;

export type ProductListResponse = Response;

export type ProductListUseCaseResponseItem = JSONProductListVM;

export type ProductListUseCaseResponse = JSONProductListVM[];

export class ProductListUseCase extends BaseUseCase<
  ProductListDTO,
  ProductListResponse
> {
  private SCHEMA = object<ProductListDTO>({}).optional();

  constructor(protected productQuery: IProductQuery) {
    super('ProductListUseCase');
  }

  async execute(
    req: ProductListDTO,
  ): Promise<ProductListResponse> {
    const methodName = 'execute';
    const traceId = CompositionRoot.getTraceId();
    this.logger.trace({methodName, traceId}, 'BEGIN');

    const guardResult = Guard.againstSchema<ProductListDTO>(
      this.SCHEMA,
      req,
    );
    if (!guardResult.succeeded) {
      return left(
        new ApplicationError.ValidationError(
          guardResult.message!,
          guardResult.errors,
        ),
      );
    }
    const dto = guardResult.value!;

    try {
      const products = await this.productQuery.retrieveProductList()

      const response = products.map((product) => product.toJSON());

      this.logger.trace({methodName, traceId}, 'END');

      return right(Result.ok<JSONProductListVM[]>(response));
    } catch (e) {
      const err = e as Error;
      return left(new ApplicationError.UnexpectedError(e as Error));
    }
  }
}
