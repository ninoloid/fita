import {date, object, string, number} from 'joi';
import {Entity} from '../../../domain/Entity';
import {UniqueEntityId} from '../../../domain/UniqueEntityId';
import {DomainError} from '../../../errors/DomainError';
import {Guard} from '../../../logic/Guard';
import {Result} from '../../../logic/Result';

export interface CartProductProps {
  cartId: UniqueEntityId;
  productId: UniqueEntityId;
  quantity: number;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class CartProduct extends Entity<CartProductProps> {
  private static SCHEMA = object<CartProductProps>({
    cartId: object().instance(UniqueEntityId).required(),
    productId: object().instance(UniqueEntityId).required(),
    quantity: number().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().allow(null).optional(),
  }).required();

  get id(): UniqueEntityId {
    return this._id;
  }

  get cartId(): UniqueEntityId {
    return this.props.cartId;
  }

  get productId(): UniqueEntityId {
    return this.props.productId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  public static create(
    props: CartProductProps,
    id?: UniqueEntityId,
  ): Result<CartProduct> {
    const guardResult = Guard.againstSchema<CartProductProps>(this.SCHEMA, props);
    if (!guardResult.succeeded) {
      return Result.fail(
        new DomainError(guardResult.message!, guardResult.errors),
      );
    } else {
      props = guardResult.value!;
      const cartProduct = new CartProduct(
        {
          ...props,
          createdAt: props.createdAt ? props.createdAt : new Date(),
          updatedAt: props.updatedAt ? props.updatedAt : new Date(),
        },
        id,
      );

      return Result.ok(cartProduct);
    }
  }
}
