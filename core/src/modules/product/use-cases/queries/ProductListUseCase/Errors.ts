import {UseCaseError} from '../../../../../errors/UseCaseError';
import {Result} from '../../../../../logic/Result';

export namespace ProductListErrors {
  export class InvalidRoleAccess extends Result<UseCaseError> {}
}
