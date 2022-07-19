import {date, object, number, bool} from 'joi';
import {Entity} from '../../../domain/Entity';
import {UniqueEntityId} from '../../../domain/UniqueEntityId';
import {DomainError} from '../../../errors/DomainError';
import {Guard} from '../../../logic/Guard';
import {Result} from '../../../logic/Result';

export interface CartProps {
  totalPrice: number;
  checkedOut: boolean;
  paid: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Cart extends Entity<CartProps> {
  private static SCHEMA = object<CartProps>({
    totalPrice: number().required(),
    checkedOut: bool().required(),
    paid: bool().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().allow(null).optional(),
  }).required();

  get id(): UniqueEntityId {
    return this._id;
  }

  get totalPrice(): number {
    return this.props.totalPrice;
  }

  get checkedOut(): boolean {
    return this.props.checkedOut;
  }


  get paid(): boolean {
    return this.props.paid;
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
    props: CartProps,
    id?: UniqueEntityId,
  ): Result<Cart> {
    const guardResult = Guard.againstSchema<CartProps>(this.SCHEMA, props);
    if (!guardResult.succeeded) {
      return Result.fail(
        new DomainError(guardResult.message!, guardResult.errors),
      );
    } else {
      props = guardResult.value!;
      const cart = new Cart(
        {
          ...props,
          createdAt: props.createdAt ? props.createdAt : new Date(),
          updatedAt: props.updatedAt ? props.updatedAt : new Date(),
        },
        id,
      );

      return Result.ok(cart);
    }
  }
}
