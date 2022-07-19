import {UseCaseError} from '../../../../../errors/UseCaseError';
import {Result} from '../../../../../logic/Result';

export namespace AddToCartErrors {
  export class InvalidRoleAccess extends Result<UseCaseError> {}
}
